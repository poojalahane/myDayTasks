// Imports
import Redis from "ioredis";
import { Logger } from "winston";

// Local Imports
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../constants";
import { createEntityLogger } from "../logging/logger.factory";

const logger: Logger = createEntityLogger("redisLogger");

const redis = new Redis({
  host: REDIS_HOST as string,
  port: REDIS_PORT as number,
  password: REDIS_PASSWORD as string,
  tls: {},
});

// Set up event listeners
// process.nextTick(): Ensures that logging does not block the event loop.
redis.on("error", (err) => {
  process.nextTick(() => {
    logger.error(`Redis Error: ${err.message}`);
  });
});

redis.on("connect", () => {
  logger.info("Connected to Redis");
});

redis.on("message", async (channel, key) => {
  if (channel === "cache-invalidate") {
    await redis.del(key);
    logger.info(`Invalidated cache for key: ${key}`);
  }
});

export { redis };
