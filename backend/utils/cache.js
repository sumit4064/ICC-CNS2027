/**
 * @file cache.js
 * @description Lightweight, zero-dependency in-memory TTL cache utility.
 * Used for caching public read-only API responses and presigned asset URLs
 * to reduce database round-trips and CPU overhead.
 */

class MemoryCache {
  constructor(defaultTtlSeconds = 60, maxItems = 500) {
    this.defaultTtl = defaultTtlSeconds * 1000;
    this.maxItems = maxItems;
    this.store = new Map();
  }

  /**
   * Retrieves an item from cache if it exists and hasn't expired.
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Stores an item with a TTL in seconds.
   * @param {string} key
   * @param {any} value
   * @param {number} [ttlSeconds]
   */
  set(key, value, ttlSeconds) {
    // Evict oldest entries if capacity reached
    if (this.store.size >= this.maxItems) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    const ttl = typeof ttlSeconds === 'number' ? ttlSeconds * 1000 : this.defaultTtl;
    this.store.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  /**
   * Deletes a specific cache key.
   * @param {string} key
   */
  del(key) {
    this.store.delete(key);
  }

  /**
   * Deletes all keys matching a given prefix.
   * Useful for invalidating e.g. 'speakers', 'committee', 'tracks', etc.
   * @param {string} prefix
   */
  delPrefix(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clears the entire cache.
   */
  clear() {
    this.store.clear();
  }
}

export const serverCache = new MemoryCache(60, 1000);
export default serverCache;
