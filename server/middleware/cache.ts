import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

// Initialize in-memory cache with TTL defaults
// For production with multiple instances, use Redis instead
const cache = new NodeCache({
  stdTTL: 300, // Default TTL in seconds (5 minutes)
  checkperiod: 120 // Cleanup interval in seconds
});

// Statistics to track cache performance
const cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
  invalidations: 0
};

// Log cache stats every 5 minutes
setInterval(() => {
  const hitRatio = cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100 || 0;
  console.log(`[Cache Stats] Hits: ${cacheStats.hits}, Misses: ${cacheStats.misses}, Sets: ${cacheStats.sets}, Invalidations: ${cacheStats.invalidations}, Hit Ratio: ${hitRatio.toFixed(2)}%`);
}, 5 * 60 * 1000);

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string | ((req: Request) => string); // Custom key or function to generate key
}

/**
 * Middleware factory for caching API responses
 * @param options Cache configuration options
 */
export function cacheMiddleware(options: CacheOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const cacheKey = typeof options.key === 'function' 
      ? options.key(req) 
      : options.key || `${req.originalUrl || req.url}`;

    // Try to get from cache
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse) {
      cacheStats.hits++;
      // Return cached response
      res.status(200).send(cachedResponse);
      return;
    }
    
    cacheStats.misses++;

    // Store original send method
    const originalSend = res.send;

    // Override send method to cache response
    res.send = function(body: any): Response {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, body, options.ttl);
        cacheStats.sets++;
      }
      
      // Call original send method
      return originalSend.call(this, body);
    };

    next();
  };
}

/**
 * Function to manually invalidate cache entries based on pattern
 * @param pattern String pattern to match against cache keys
 */
export function invalidateCache(pattern: string): number {
  let count = 0;
  
  // Get all keys
  const keys = cache.keys();
  
  // Create RegExp from pattern
  const regex = new RegExp(pattern);
  
  // Find and delete matching keys
  keys.forEach(key => {
    if (regex.test(key)) {
      cache.del(key);
      count++;
    }
  });
  
  if (count > 0) {
    cacheStats.invalidations += count;
    console.log(`[Cache] Invalidated ${count} entries matching pattern: ${pattern}`);
  }
  
  return count;
}

export function getCacheStats() {
  return {
    ...cacheStats,
    hitRatio: cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100 || 0,
    keys: cache.keys().length,
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 // MB
  };
}

export function clearCache() {
  const count = cache.keys().length;
  cache.flushAll();
  console.log(`[Cache] Cleared all ${count} entries`);
  return count;
}

export { cache };