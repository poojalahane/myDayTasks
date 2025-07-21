/* eslint-disable @typescript-eslint/no-explicit-any */
// Imports
import { decode, encode } from "@msgpack/msgpack";

// Local Imports
import { redis } from "../lib/redis";

/* ---------------------------------------------- MSGPACK UTIL FUNCTIONS -------------------------------------------------- */

/**
 * Serializes data into a Buffer using MessagePack encoding.
 *
 * This function is needed to efficiently encode data before storing it in Redis,
 * as MessagePack provides better performance and smaller payload sizes compared to JSON.
 *
 * @param data - Any data type that needs to be serialized
 * @returns A Buffer containing the MessagePack encoded data
 */
export const serialize = (data: any): Buffer => {
  try {
    return Buffer.from(encode(data));
  } catch (error) {
    console.warn(
      "MessagePack serialization failed, falling back to JSON:",
      error
    );
    return Buffer.from(JSON.stringify(data));
  }
};

/**
 * Deserializes a Buffer containing MessagePack encoded data back into its original form.
 *
 * This function is needed to decode data retrieved from Redis back into usable JavaScript objects.
 *
 * @param data - Buffer containing MessagePack encoded data
 * @returns The decoded data of type T
 */
export const deserialize = <T>(data: Buffer): T => {
  try {
    return decode(data) as T;
  } catch (error) {
    console.warn(
      "MessagePack deserialization failed, falling back to JSON:",
      error
    );
    return JSON.parse(data.toString()) as T;
  }
};

/* -------------------------------------------- END MSGPACK UTIL FUNCTIONS ------------------------------------------------ */

/* ---------------------------------------------- REDIS UTIL FUNCTIONS -------------------------------------------------- */

/**
 * Checks if Redis connection is healthy by attempting to ping the server.
 *
 * This function is needed for health monitoring and ensuring Redis is available before performing operations.
 *
 * @returns Promise<boolean> - true if Redis is healthy, false otherwise
 */
export const cacheHealthCheck = async (): Promise<boolean> => {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error("Redis health check failed:", error);
    return false;
  }
};

/**
 * Clears all data from Redis cache.
 *
 * This function is needed when you want to completely reset the cache state,
 * useful during testing or when needing to clear corrupted cache data.
 *
 * @returns Promise<void>
 */
export const flushCache = async (): Promise<void> => {
  await redis.flushall();
};

/**
 * Retrieves a value from Redis cache for a given key.
 *
 * This function is needed to fetch previously cached data, avoiding expensive
 * operations like database queries or API calls.
 *
 * @param key - String key to lookup in Redis
 * @returns Promise resolving to cached data of type T if found, null otherwise
 */
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const data = await redis.getBuffer(key);
  return data ? deserialize<T>(data) : null;
};

/**
 * Stores a value in Redis cache under a given key.
 *
 * This function is needed to cache frequently accessed data to improve application performance
 * by reducing load on primary data sources.
 *
 * @param key - String key under which to store the data
 * @param value - Any data to be cached
 * @param ttl - Optional time-to-live in seconds
 * @returns Promise<void>
 */
export const cacheSet = async (
  key: string,
  value: any,
  ttl?: number
): Promise<void> => {
  try {
    const serializedData = serialize(value);
    const bufferData = Buffer.from(serializedData);

    if (ttl) {
      try {
        await redis.set(key, bufferData, "EX", ttl);
      } catch (error) {
        console.error("Failed to set the cache", error);
      }
    } else {
      try {
        await redis.set(key, bufferData);
      } catch (error) {
        console.error("Failed to set the cache", error);
      }
    }
  } catch (error) {
    console.error("Failed to serialize data", error);
  }
};

/**
 * Deletes a value from Redis cache for a given key.
 *
 * This function is needed when cached data needs to be invalidated,
 * such as when the underlying data has changed.
 *
 * @param key - String key to delete from cache
 * @returns Promise<void>
 */
export const cacheDelete = async (key: string): Promise<void> => {
  await redis.del(key);
};

/**
 * Deletes multiple cache entries matching a pattern in Redis.
 *
 * This function is needed for bulk cache invalidation when multiple related
 * cache entries need to be cleared, such as all entries for a specific user or entity.
 *
 * @param pattern - String pattern to match Redis keys against
 * @returns Promise<void>
 */
export const cacheDeleteByPattern = async (pattern: string): Promise<void> => {
  const stream = redis.scanStream({ match: pattern, count: 100 });

  stream.on("data", (keys: string[]) => {
    if (keys.length) {
      const pipeline = redis.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      pipeline
        .exec()
        .catch((err: any) => console.error("Failed to delete keys: ", err));
    }
  });

  stream.on("end", () => {
    console.log("Finished deleting keys matching pattern:", pattern);
  });
};

/**
 * Generates a cache key by concatenating provided arguments with a colon separator.
 *
 * This function is needed to create consistent and predictable cache keys
 * when multiple parameters are involved in identifying cached data.
 *
 * @param args - Array of strings or numbers to form the key
 * @returns String representing the generated cache key
 */
export const generateCacheKey = (...args: (string | number)[]): string => {
  return args.join(":");
};

/**
 * Wraps a fetch function with caching logic using Redis.
 *
 * This function is needed to implement a cache-aside pattern, automatically managing
 * cache reads and writes while providing a clean interface for data access.
 *
 * @param key - String cache key
 * @param ttl - Number of seconds for cache TTL
 * @param fetchFunction - Function that returns Promise<T> to fetch data if not cached
 * @returns Promise<T> resolving to either cached or freshly fetched data
 */
export const cacheWrap = async <T>(
  key: string,
  ttl: number,
  fetchFunction: () => Promise<T>
): Promise<T> => {
  const cachedData = await cacheGet<T>(key);

  if (cachedData) return cachedData;
  else {
    const data = await fetchFunction();
    if (data) await cacheSet(key, data, ttl);
    return data;
  }
};

/**
 * Stores a list of items in Redis cache.
 *
 * This function is needed when caching arrays of data, optimizing the storage
 * using MessagePack serialization for better performance.
 *
 * @param key - String cache key
 * @param value - Array of items of type T to cache
 * @param ttl - Optional TTL in seconds
 * @returns Promise<void>
 */
export const cacheSetList = async <T>(
  key: string,
  value: T[],
  ttl?: number
): Promise<void> => {
  const serializedData = Buffer.from(serialize(value));
  if (ttl) {
    await redis.set(key, serializedData, "EX", ttl);
  } else {
    await redis.set(key, serializedData);
  }
};

/**
 * Retrieves a list of items from Redis cache.
 *
 * This function is needed to fetch previously cached arrays of data,
 * handling the MessagePack deserialization automatically.
 *
 * @param key - String cache key
 * @returns Promise resolving to array of type T if found, null otherwise
 */
export const cacheGetList = async <T>(key: string): Promise<T[] | null> => {
  const data = await redis.getBuffer(key);
  return data ? deserialize<T[]>(data) : null;
};

/**
 * Implements a distributed lock pattern for cache operations.
 *
 * This function is needed to prevent multiple concurrent processes from
 * simultaneously fetching and caching the same data (cache stampede prevention).
 *
 * @param key - String cache key
 * @param ttl - Number of seconds for cache TTL
 * @param fetchFunction - Function that returns Promise<T> to fetch data
 * @param lockTimeout - Optional timeout in ms for the lock (default 5000)
 * @returns Promise<T> resolving to either cached or freshly fetched data
 */
export const cacheWrapWithLock = async <T>(
  key: string,
  ttl: number,
  fetchFunction: () => Promise<T>,
  lockTimeout = 5000
): Promise<T> => {
  const cachedData = await cacheGet<T>(key);
  if (cachedData) {
    return cachedData;
  }

  const lockKey = `${key}:lock`;

  // Acquire the lock
  // @ts-expect-error
  const lock = await redis.set(lockKey, "locked", "NX", "PX", lockTimeout);
  // set(key: RedisKey, value: string | number | Buffer, millisecondsToken: "PX", milliseconds: string | number, nx: "NX", callback?: Callback<"OK">)

  if (lock) {
    try {
      const data = await fetchFunction();
      if (data) {
        await cacheSet(key, data, ttl);
      }
      return data;
    } finally {
      // Release the lock
      await redis.del(lockKey);
    }
  } else {
    // Wait and retry after a short delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return await cacheWrapWithLock(key, ttl, fetchFunction, lockTimeout);
  }
};

/**
 * Retrieves multiple values from Redis cache in a single operation.
 *
 * This function is needed to efficiently fetch multiple cached items at once,
 * reducing network round trips to Redis.
 *
 * @param keys - Array of string keys to fetch
 * @returns Promise resolving to array of T or null for each key
 */
export const cacheMGet = async <T>(keys: string[]): Promise<(T | null)[]> => {
  const data = await redis.mgetBuffer(...keys);
  return data.map((item: Buffer | null) =>
    item ? deserialize<T>(item) : null
  );
};

/**
 * Stores multiple key-value pairs in Redis cache in a single operation.
 *
 * This function is needed to efficiently cache multiple items at once,
 * reducing network round trips to Redis.
 *
 * @param keyValuePairs - Array of tuples containing key and value to cache
 * @param ttl - Optional TTL in seconds
 * @returns Promise<void>
 */
export const cacheMSet = async (
  keyValuePairs: [string, any][],
  ttl?: number
): Promise<void> => {
  const pipeline = redis.pipeline();
  for (const [key, value] of keyValuePairs) {
    const serializedData = serialize(value);
    if (ttl) {
      pipeline.set(key, serializedData, "EX", ttl);
    } else {
      pipeline.set(key, serializedData);
    }
  }
  await pipeline.exec();
};

/**
 * Creates or updates a field in a Redis hash.
 *
 * This function is needed when storing structured data where multiple fields
 * belong to a single key (hash).
 *
 * @param key - String key of the hash
 * @param field - String field name in the hash
 * @param value - Any value to store
 * @returns Promise<void>
 */
export const createHashSet = async (
  key: string,
  field: string,
  value: any
): Promise<void> => {
  const serializedData = serialize(value);
  await redis.hset(key, field, serializedData);
};

/**
 * Retrieves a field value from a Redis hash.
 *
 * This function is needed to fetch specific fields from structured data
 * stored as a Redis hash.
 *
 * @param key - String key of the hash
 * @param field - String field name to retrieve
 * @returns Promise resolving to value of type T if found, null otherwise
 */
export const cacheHashGet = async <T>(
  key: string,
  field: string
): Promise<T | null> => {
  const data = await redis.hgetBuffer(key, field);
  return data ? deserialize<T>(data) : null;
};

/* ---------------------------------------------- END REDIS UTIL FUNCTIONS -------------------------------------------------- */
