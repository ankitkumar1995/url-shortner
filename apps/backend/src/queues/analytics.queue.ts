import { Queue, Worker, Job } from "bullmq";
import { RedisService } from "../services/redis.service";

const connection = RedisService.getInstance().getClient();

export interface ClickAnalyticsEvent {
  shortCode: string;
  ip: string;
  userAgent: string;
  referrer: string;
  timestamp: number;
}

// 1. Initialize BullMQ Queue
export const analyticsQueue = new Queue<ClickAnalyticsEvent>("analyticsInbound", {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry failed log writes up to 3 times
    backoff: {
      type: "exponential",
      delay: 2000 // Start retrying after 2 seconds
    },
    removeOnComplete: true, // Auto-cleanup successful jobs
    removeOnFail: 100 // Keep last 100 failed jobs for debugging
  }
});

// 2. Queue Producer Helper
export async function queueAnalyticsEvent(event: ClickAnalyticsEvent): Promise<void> {
  await analyticsQueue.add("logClick", event);
}

// 3. Queue Worker to process click tracking asynchronously
export const analyticsWorker = new Worker<ClickAnalyticsEvent>(
  "analyticsInbound",
  async (job: Job<ClickAnalyticsEvent>) => {
    const { shortCode, ip, userAgent, referrer, timestamp } = job.data;
    
    // Simulate complex background enrichments (e.g. GeoIP, User-Agent parsing)
    const country = ip === "127.0.0.1" ? "Localhost" : "United States";
    const browser = userAgent.includes("Mozilla") ? "Firefox/Chrome" : "Other";

    // In production, this batch inserts data directly into a ClickHouse or TimescaleDB OLAP cluster
    console.log(
      `[Analytics Worker (Job #${job.id})] Parsed click for '${shortCode}'. Country: ${country}, Browser: ${browser}, Referrer: ${referrer || "Direct"}`
    );
  },
  {
    connection,
    concurrency: 10 // Process up to 10 click events in parallel per worker thread
  }
);

analyticsWorker.on("completed", (job) => {
  console.log(`[Analytics Worker] Job ${job.id} completed successfully.`);
});

analyticsWorker.on("failed", (job, err) => {
  console.error(`[Analytics Worker] Job ${job?.id} failed with error:`, err);
});
