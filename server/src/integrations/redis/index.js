/**
 * Redis Integration — Public API
 * 
 * Exports the Redis client, cache service, and initialization.
 */
const { initRedis, getRedis, isRedisAvailable, ping } = require('./client');
const cache = require('./cache');

module.exports = {
  initRedis,
  getRedis,
  isRedisAvailable,
  ping,
  cache,
};
