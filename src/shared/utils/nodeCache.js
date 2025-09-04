const NodeCache = require('node-cache');

// Create a cache instance with default TTL of 5 minutes
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every minute
  useClones: false // Don't clone objects for better performance
});

/**
 * Set cache data with optional TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds (optional)
 */
const setCacheData = (key, data, ttl = 300) => {
  try {
    cache.set(key, data, ttl);
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

/**
 * Get cache data by key
 * @param {string} key - Cache key
 * @returns {any} Cached data or null if not found
 */
const getCacheData = (key) => {
  try {
    return cache.get(key) || null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Delete cache data by key
 * @param {string} key - Cache key
 * @returns {boolean} Success status
 */
const deleteCacheData = (key) => {
  try {
    cache.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

/**
 * Clear all cache data
 * @returns {boolean} Success status
 */
const clearCache = () => {
  try {
    cache.flushAll();
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

/**
 * Get cache statistics
 * @returns {object} Cache statistics
 */
const getCacheStats = () => {
  try {
    return cache.getStats();
  } catch (error) {
    console.error('Cache stats error:', error);
    return null;
  }
};

/**
 * Check if key exists in cache
 * @param {string} key - Cache key
 * @returns {boolean} Whether key exists
 */
const hasCacheData = (key) => {
  try {
    return cache.has(key);
  } catch (error) {
    console.error('Cache has error:', error);
    return false;
  }
};

module.exports = {
  setCacheData,
  getCacheData,
  deleteCacheData,
  clearCache,
  getCacheStats,
  hasCacheData,
  cache // Export cache instance for advanced usage
};
