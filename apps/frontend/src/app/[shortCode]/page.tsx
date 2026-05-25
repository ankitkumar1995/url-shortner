import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma, redis } from "../../lib/db";

// Exclude administrative/static keywords from dynamic shortcode interceptions
const RESERVED_WORDS = new Set([
  "dashboard",
  "admin",
  "settings",
  "analytics",
  "api",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "_next",
  "static",
  "product",
  "features",
  "pricing",
  "resources",
  "sign-in",
  "sign-up",
]);

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

/**
 * Enterprise-Grade Dynamic URL Redirection Page.
 * Executes direct Serverless lookups using multi-tier caches (Redis L2)
 * and PostgreSQL fallbacks, records click analytics, and redirects dynamically.
 */
export default async function ShortCodeRedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const shortCode = resolvedParams.shortCode;

  // 1. Guard against reserved system paths
  if (RESERVED_WORDS.has(shortCode.toLowerCase())) {
    notFound();
  }

  const startTimestamp = Date.now();
  let originalUrl: string | null = null;

  try {
    // 2. Multi-tier Cache: Check Redis L2
    originalUrl = await redis.get(`url:redirect:${shortCode}`);

    if (!originalUrl) {
      // 3. Cache Miss: PostgreSQL relational query
      const urlRecord = await prisma.url.findUnique({
        where: { shortCode },
      });

      // Guard: Link not found or explicitly deactivated
      if (!urlRecord || !urlRecord.isActive) {
        notFound();
      }

      // Guard: Expiration validation check
      if (urlRecord.expiresAt && new Date(urlRecord.expiresAt) < new Date()) {
        notFound();
      }

      originalUrl = urlRecord.originalUrl;

      // Warm up Redis Cache dynamically with Adaptive Jitter (12-24 hours)
      const baseTtl = 43200; // 12 hours
      const jitter = Math.floor(Math.random() * 43200);
      await redis.set(`url:redirect:${shortCode}`, originalUrl, "EX", baseTtl + jitter);
    }

    // 4. Ingest click analytics asynchronously in background thread
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "unknown";
    const referrer = headersList.get("referer") || "Direct";
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const latency = Date.now() - startTimestamp;

    // Parse platform types
    let device = "Desktop";
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobi") || ua.includes("android") || ua.includes("iphone")) {
      device = "Mobile";
    }

    let browser = "Chrome";
    if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";

    let os = "Windows";
    if (ua.includes("mac os")) os = "MacOS";
    else if (ua.includes("linux")) os = "Linux";
    else if (ua.includes("iphone")) os = "iOS";
    else if (ua.includes("android")) os = "Android";

    let country = "United States";
    if (ip === "127.0.0.1" || ip === "::1") {
      country = "Localhost";
    }

    const refHost = referrer !== "Direct" ? new URL(referrer).hostname : "Direct";

    // Asynchronous click event logging
    prisma.click.create({
      data: {
        shortCode,
        ip,
        country,
        browser,
        device,
        os,
        referrer: refHost,
        latency,
      },
    }).then(() => {
      redis.incr("global:analytics:total_clicks");
    }).catch((err) => {
      console.error("Next.js Click log write failed:", err);
    });

  } catch (error) {
    console.error("Next.js Redirection engine crash:", error);
    // If database connection error, fail-safe to notFound() instead of crashing
    notFound();
  }

  // 5. Temporary Redirect (302) to the long URL
  let targetUrl = originalUrl;
  if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }
  redirect(targetUrl);
}
