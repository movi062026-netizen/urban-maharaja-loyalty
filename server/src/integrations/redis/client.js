/**
 * Upstash Redis Client — Serverless Redis integration.
 * 
 * Uses @upstash/redis for REST-based Redis operations.
 * Provides caching, rate limiting store, and OTP management.
 * 
 * Falls back gracefully if Redis is not configured.
 */
const { Redis } = require('@upstash/redis');
const env = require('../../config/env');
const logger = require('../../config/logger');

let redis = null;
let isConnected = false;

/**
 * Initialize Upstash Redis client.
 * Safe to call multiple times — returns cached instance.
 */
const initRedis = () => {
  if (redis) return redis;

  if (!env.UPSTASH_REDIS_URL || !env.UPSTASH_REDIS_TOKEN) {
    logger.warn('Upstash Redis not configured — caching disabled. Set UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN.');
    return null;
  }

  try {
    redis = new Redis({
      url: env.UPSTASH_REDIS_URL,
      token: env.UPSTASH_REDIS_TOKEN,
    });
    isConnected = true;
    logger.info('✅ Upstash Redis client initialized', { url: env.UPSTASH_REDIS_URL });
    return redis;
  } catch (error) {
    logger.error('❌ Failed to initialize Upstash Redis', { error: error.message });
    return null;
  }
};

/**
 * Get the Redis client instance.
 */
const getRedis = () => {
  if (!redis) return initRedis();
  return redis;
};

/**
 * Check if Redis is available and connected.
 */
const isRedisAvailable = () => isConnected && redis !== null;

/**
 * Ping Redis to verify connectivity.
 */
const ping = async () => {
  const client = getRedis();
  if (!client) return false;
  try {
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    logger.error('Redis ping failed', { error: error.message });
    isConnected = false;
    return false;
  }
};

// ── Cache Operations ──────────────────────────────────

/**
 * Get a cached value by key.
 * @param {string} key 
 * @returns {any|null}
 */
const get = async (key) => {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.get(key);
  } catch (error) {
    logger.error('Redis GET failed', { key, error: error.message });
    return null;
  }
};

/**
 * Set a cached value with optional TTL.
 * @param {string} key 
 * @param {any} value 
 * @param {number} [ttlSeconds] — Time to live in seconds
 */
const set = async (key, value, ttlSeconds) => {
  const client = getRedis();
  if (!client) return false;
  try {
    if (ttlSeconds) {
      await client.set(key, value, { ex: ttlSeconds });
    } else {
      await client.set(key, value);
    }
    return true;
  } catch (error) {
    logger.error('Redis SET failed', { key, error: error.message });
    return false;
  }
};

/**
 * Delete a cached key.
 * @param {string} key 
 */
const del = async (key) => {
  const client = getRedis();
  if (!client) return false;
  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.error('Redis DEL failed', { key, error: error.message });
    return false;
  }
};

/**
 * Set a key only if it doesn't exist (for locks/deduplication).
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlSeconds 
 */
const setNX = async (key, value, ttlSeconds) => {
  const client = getRedis();
  if (!client) return false;
  try {
    const result = await client.set(key, value, { nx: true, ex: ttlSeconds });
    return result === 'OK';
  } catch (error) {
    logger.error('Redis SETNX failed', { key, error: error.message });
    return false;
  }
};

/**
 * Increment a counter key.
 * @param {string} key 
 * @returns {number|null}
 */
const incr = async (key) => {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.incr(key);
  } catch (error) {
    logger.error('Redis INCR failed', { key, error: error.message });
    return null;
  }
};

/**
 * Set TTL on an existing key.
 * @param {string} key 
 * @param {number} ttlSeconds 
 */
const expire = async (key, ttlSeconds) => {
  const client = getRedis();
  if (!client) return false;
  try {
    await client.expire(key, ttlSeconds);
    return true;
  } catch (error) {
    logger.error('Redis EXPIRE failed', { key, error: error.message });
    return false;
  }
};

/**
 * Get remaining TTL on a key.
 * @param {string} key 
 * @returns {number|null} — seconds remaining, -1 if no TTL, -2 if key doesn't exist
 */
const ttl = async (key) => {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.ttl(key);
  } catch (error) {
    logger.error('Redis TTL failed', { key, error: error.message });
    return null;
  }
};

/**
 * Check if a key exists.
 * @param {string} key 
 * @returns {boolean}
 */
const exists = async (key) => {
  const client = getRedis();
  if (!client) return false;
  try {
    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    logger.error('Redis EXISTS failed', { key, error: error.message });
    return false;
  }
};

module.exports = {
  initRedis,
  getRedis,
  isRedisAvailable,
  ping,
  get,
  set,
  del,
  setNX,
  incr,
  expire,
  ttl,
  exists,
};
