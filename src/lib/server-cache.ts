import { LRUCache } from "lru-cache";

export const serverCache = new LRUCache<string, Record<string, unknown>>({
  max: 500,
  ttl: 1000 * 60 * 5,
});

export function cacheGet<T>(key: string): T | undefined {
  return serverCache.get(key) as T | undefined;
}

export function cacheSet<T>(key: string, value: T): T {
  serverCache.set(key, value as Record<string, unknown>);
  return value;
}
