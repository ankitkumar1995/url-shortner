import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RedisService } from "../services/redis.service";
import { Base62Converter } from "../utils/base62";
import { AnalyticsService } from "../services/analytics.service";

const prisma = new PrismaClient();
const cache = RedisService.getInstance();

export class UrlController {
  
  /**
   * Handle Redirection (GET /:shortCode) with real-time latency calculation and telemetry logging.
   */
  public static async handleRedirect(req: Request, res: Response): Promise<void> {
    const { shortCode } = req.params;
    const redirectStart = Date.now(); // Start timer to calculate redirect speed latency!

    try {
      // 1. Redis Cache Lookup
      let originalUrl = await cache.getRedirect(shortCode);

      if (!originalUrl) {
        // 2. Cache Miss: PostgreSQL DB Query
        const urlRecord = await prisma.url.findUnique({
          where: { shortCode }
        });

        if (!urlRecord || !urlRecord.isActive) {
          res.status(404).send("URL not found or deactivated.");
          return;
        }

        // Validate expiration constraints
        if (urlRecord.expiresAt && new Date(urlRecord.expiresAt) < new Date()) {
          res.status(410).send("URL has expired.");
          return;
        }

        originalUrl = urlRecord.originalUrl;

        // 3. Write back to Redis cache
        await cache.setRedirect(shortCode, originalUrl);
      }

      // Calculate resolution latency in milliseconds
      const redirectLatency = Date.now() - redirectStart;

      // 4. Asynchronously record the click telemetry logs in the DB
      AnalyticsService.recordClick({
        shortCode,
        ip: req.ip || req.headers["x-forwarded-for"] as string || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "",
        referrer: req.headers["referer"] || "",
        latency: redirectLatency
      }).catch((err) => console.error("Click Ingestion telemetry failure:", err));

      // 5. Temporary Redirect
      res.setHeader("Cache-Control", "private, max-age=90");
      res.redirect(302, originalUrl);

    } catch (error) {
      console.error("Redirection pipeline execution error:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  /**
   * Create Shortened URL (POST /api/v1/shorten)
   */
  public static async createShortUrl(req: Request, res: Response): Promise<void> {
    const { originalUrl, customAlias, expiresAt, userId } = req.body;

    if (!originalUrl) {
      res.status(400).json({ error: "originalUrl is a required parameter." });
      return;
    }

    try {
      let shortCode = customAlias;

      if (shortCode) {
        // Check if custom alias is already registered
        const existing = await prisma.url.findUnique({ where: { shortCode } });
        if (existing) {
          res.status(409).json({ error: "Custom alias is already registered." });
          return;
        }
      } else {
        // Generate a new unique ID
        const tempId = BigInt(Date.now());
        shortCode = Base62Converter.encode(tempId);
      }

      // Save to PostgreSQL DB
      const urlRecord = await prisma.url.create({
        data: {
          shortCode,
          originalUrl,
          userId: userId || null,
          expiresAt: expiresAt ? new Date(expiresAt) : null
        }
      });

      // Warm up Redis cache instantly
      await cache.setRedirect(shortCode, originalUrl);

      res.status(201).json({
        success: true,
        data: {
          shortCode: urlRecord.shortCode,
          shortUrl: `${req.protocol}://${req.get("host")}/${urlRecord.shortCode}`,
          originalUrl: urlRecord.originalUrl,
          expiresAt: urlRecord.expiresAt,
          createdAt: urlRecord.createdAt
        }
      });

    } catch (error) {
      console.error("URL creation failure:", error);
      res.status(500).json({ error: "Failed to shorten URL." });
    }
  }

  /**
   * GET /api/v1/links - Retrieve all dynamic active links from DB
   */
  public static async getAllLinks(req: Request, res: Response): Promise<void> {
    try {
      const urls = await prisma.url.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { clicks: true }
          }
        }
      });

      const formatted = urls.map((url) => ({
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
        originalUrl: url.originalUrl,
        clicks: url._count.clicks,
        isActive: url.isActive,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt
      }));

      res.status(200).json({ success: true, data: formatted });
    } catch (error) {
      console.error("Failed to query links:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * GET /api/v1/analytics/overview - Overall overview metrics
   */
  public static async getAnalyticsOverview(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AnalyticsService.getOverviewStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * GET /api/v1/analytics/clicks - Time-series clicks
   */
  public static async getAnalyticsClicks(req: Request, res: Response): Promise<void> {
    try {
      const data = await AnalyticsService.getClicksTimeSeries();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * GET /api/v1/analytics/devices - Device analytics
   */
  public static async getAnalyticsDevices(req: Request, res: Response): Promise<void> {
    try {
      const data = await AnalyticsService.getDeviceStats();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * GET /api/v1/analytics/countries - Geographical analytics
   */
  public static async getAnalyticsCountries(req: Request, res: Response): Promise<void> {
    try {
      const data = await AnalyticsService.getGeoStats();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * GET /api/v1/analytics/referrers - Referrer analytics
   */
  public static async getAnalyticsReferrers(req: Request, res: Response): Promise<void> {
    try {
      const data = await AnalyticsService.getReferrerStats();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
