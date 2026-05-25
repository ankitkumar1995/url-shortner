import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

// Instantiate singletons for Next.js hot-reloads in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const globalForRedis = global as unknown as { redis: Redis };
export const redis =
  globalForRedis.redis ||
  new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

redis.on("error", (err) => {
  // Fail Open: Redis errors should not crash the server
  console.error("Next.js Redis Connection failure:", err);
});
