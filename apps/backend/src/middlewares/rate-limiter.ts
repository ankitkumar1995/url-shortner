import { Request, Response, NextFunction } from "express";
import { RedisService } from "../services/redis.service";

const redis = RedisService.getInstance().getClient();

/**
 * Sliding Window Rate Limiter Express Middleware.
 * Implemented using Redis Sorted Sets to track active request timestamps accurately.
 * 
 * @param windowSizeInSeconds The tracking window size.
 * @param maxRequests Maximum requests allowed inside the window.
 */
export const slidingWindowRateLimiter = (windowSizeInSeconds: number, maxRequests: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const key = `rl:rate:${ip}`;
    const now = Date.now();
    const windowStart = now - windowSizeInSeconds * 1000;

    try {
      const multi = redis.multi();

      // 1. Remove request timestamps older than our sliding window
      multi.zremrangebyscore(key, 0, windowStart);

      // 2. Count active request timestamps remaining in our window
      multi.zcard(key);

      // 3. Add current request timestamp to the sorted set with a unique score/member
      multi.zadd(key, now, `${now}-${Math.random()}`);

      // 4. Update TTL to keep Redis keys self-cleaning
      multi.expire(key, windowSizeInSeconds);

      // Execute Redis multi transaction atomically
      const results = await multi.exec();
      if (!results) {
        res.status(500).json({ error: "Unable to process rate-limits" });
        return;
      }

      // zcard result is at index 1 of the multi operation
      const requestCount = results[1][1] as number;

      if (requestCount >= maxRequests) {
        res.status(429).json({
          success: false,
          error: "Too Many Requests",
          retryAfter: windowSizeInSeconds
        });
        return;
      }

      next();
    } catch (error) {
      // Fail Open: Do not block legitimate traffic if Redis goes down in production
      console.error("Rate Limiter pipeline failure:", error);
      next();
    }
  };
};
