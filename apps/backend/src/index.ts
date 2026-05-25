import express from "express";
import { UrlController } from "./controllers/url.controller";
import { slidingWindowRateLimiter } from "./middlewares/rate-limiter";
import { RedisService } from "./services/redis.service";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Redis on startup
RedisService.getInstance();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Short URL Redirect Path (Optimized)
app.get("/:shortCode", UrlController.handleRedirect);

// API Shortening Path (Rate Limited: 10 requests per minute for demonstration)
app.post(
  "/api/v1/shorten",
  slidingWindowRateLimiter(60, 10),
  UrlController.createShortUrl
);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled exception in router pipeline:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Boot Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 URL Shortener Backend listening on port ${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
  console.log(`==================================================`);
});
