import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RedisService } from "../services/redis.service";
import { queueAnalyticsEvent } from "../queues/analytics.queue";
import { Base62Converter } from "../utils/base62";

const prisma = new PrismaClient();
const cache = RedisService.getInstance();

export class UrlController {
  
  /**
   * Handle Rapid Redirect Lifecycle (GET /:shortCode)
   */
  public static async handleRedirect(req: Request, res: Response): Promise<void> {
    const { shortCode } = req.params;

    try {
      // 1. Redis L2 Cache Lookup
      let originalUrl = await cache.getRedirect(shortCode);

      if (!originalUrl) {
        // 2. Cache Miss: PostgreSQL Lookup
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

      // 4. Fire-and-Forget Analytics Tracking Event to Kafka/BullMQ
      queueAnalyticsEvent({
        shortCode,
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "",
        referrer: req.headers["referer"] || "",
        timestamp: Date.now()
      }).catch((err) => console.error("Telemetry ingestion queue error:", err));

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
        // Generate a new unique ID (simulate snowflake/autoincrement ID encoding)
        // For production, we use a global Snowflake ID. Here, we fetch next serial sequence.
        const tempId = BigInt(Date.now()); // Simple unique surrogate for demo purposes
        shortCode = Base62Converter.encode(tempId);
      }

      // Save to database
      const urlRecord = await prisma.url.create({
        data: {
          shortCode,
          originalUrl,
          userId: userId || null,
          expiresAt: expiresAt ? new Date(expiresAt) : null
        }
      });

      // Write-back to Redis cache instantly (warm-up cache)
      await cache.setRedirect(shortCode, originalUrl);

      res.status(201).json({
        success: true,
        data: {
          shortCode: urlRecord.shortCode,
          shortUrl: `https://lnk.cx/${urlRecord.shortCode}`,
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
}
