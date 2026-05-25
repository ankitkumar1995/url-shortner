import Redis from "ioredis";

export class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      reconnectOnError: (err) => {
        console.error("Redis reconnection error", err);
        return true;
      }
    });

    this.client.on("connect", () => console.log("Redis cache successfully connected."));
    this.client.on("error", (err) => console.error("Redis operational error", err));
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  /**
   * Fetch cached short URL redirection destination.
   */
  public async getRedirect(shortCode: string): Promise<string | null> {
    const key = `url:redirect:${shortCode}`;
    return this.client.get(key);
  }

  /**
   * Set redirect target in cache with random TTL to mitigate stampedes.
   */
  public async setRedirect(shortCode: string, originalUrl: string): Promise<void> {
    const key = `url:redirect:${shortCode}`;
    // Base TTL of 24 Hours (86400 seconds) + Random Jitter of 1-4 Hours (3600-14400 seconds)
    const baseTtl = 86400; 
    const jitter = Math.floor(Math.random() * 14400);
    await this.client.set(key, originalUrl, "EX", baseTtl + jitter);
  }

  /**
   * Delete cached record (used on edit/delete actions).
   */
  public async invalidateCache(shortCode: string): Promise<void> {
    const key = `url:redirect:${shortCode}`;
    await this.client.del(key);
  }
}
