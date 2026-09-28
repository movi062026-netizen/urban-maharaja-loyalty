/**
 * Token Bucket Rate Limiter
 * 
 * Implements the classic Token Bucket algorithm for rate limiting.
 * Provides smooth burst handling with constant refill rates.
 * Works with Redis (when available) and high-performance in-memory fallback.
 */

const { getRedis, isRedisAvailable } = require('../integrations/redis/client');
const logger = require('../config/logger');

class MemoryTokenBucketStore {
  constructor(cleanupIntervalMs = 60000) {
    this.buckets = new Map();
    // Periodic garbage collection for inactive buckets (TTL: 1 hour)
    this.gcTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, bucket] of this.buckets.entries()) {
        if (now - bucket.lastRefill > 3600000) {
          this.buckets.delete(key);
        }
      }
    }, cleanupIntervalMs);

    if (this.gcTimer.unref) {
      this.gcTimer.unref();
    }
  }

  get(key) {
    return this.buckets.get(key) || null;
  }

  set(key, bucket) {
    this.buckets.set(key, bucket);
  }
}

const memoryStore = new MemoryTokenBucketStore();

/**
 * Creates an Express middleware using the Token Bucket algorithm
 * 
 * @param {Object} options
 * @param {number} options.capacity - Maximum bucket capacity (tokens)
 * @param {number} options.refillRatePerSec - Number of tokens added per second
 * @param {string} options.bucketName - Identifier prefix (e.g. 'auth:login')
 * @param {Function} [options.keyGenerator] - Custom key generator function (req) => string
 * @param {string} [options.errorMessage] - Custom error message for rate limit breach
 */
const createTokenBucketLimiter = ({
  capacity = 5,
  refillRatePerSec = 1 / 15, // 1 token every 15 seconds (4 per minute)
  bucketName = 'tb:default',
  keyGenerator = null,
  errorMessage = 'Too many attempts. Token bucket depleted. Please try again shortly.',
}) => {
  return async (req, res, next) => {
    try {
      // 1. Resolve rate limit key
      let identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      if (typeof keyGenerator === 'function') {
        const customKey = keyGenerator(req);
        if (customKey) {
          identifier = `${identifier}:${customKey}`;
        }
      }

      const fullKey = `${bucketName}:${identifier}`;
      const now = Date.now();
      const redis = isRedisAvailable() ? getRedis() : null;

      let bucket = null;

      if (redis) {
        try {
          const cached = await redis.get(fullKey);
          if (cached) {
            bucket = typeof cached === 'string' ? JSON.parse(cached) : cached;
          }
        } catch (err) {
          logger.warn('Token bucket Redis get failed, using memory fallback', { error: err.message });
        }
      }

      if (!bucket) {
        bucket = memoryStore.get(fullKey) || {
          tokens: capacity,
          lastRefill: now,
        };
      }

      // 2. Refill tokens based on elapsed time
      const elapsedSeconds = Math.max(0, (now - bucket.lastRefill) / 1000);
      const tokensToAdd = elapsedSeconds * refillRatePerSec;
      const currentTokens = Math.min(capacity, bucket.tokens + tokensToAdd);

      // 3. Check if token can be consumed
      if (currentTokens >= 1) {
        const remainingTokens = currentTokens - 1;
        const updatedBucket = {
          tokens: remainingTokens,
          lastRefill: now,
        };

        // Save to store
        memoryStore.set(fullKey, updatedBucket);
        if (redis) {
          const ttlSeconds = Math.ceil(capacity / refillRatePerSec) + 60;
          redis.set(fullKey, JSON.stringify(updatedBucket), { ex: ttlSeconds }).catch(() => {});
        }

        // Set standard rate limit headers
        res.setHeader('X-RateLimit-Limit', capacity);
        res.setHeader('X-RateLimit-Remaining', Math.floor(remainingTokens));
        res.setHeader('X-RateLimit-Reset', Math.ceil((capacity - remainingTokens) / refillRatePerSec));

        return next();
      }

      // 4. Bucket is empty — calculate seconds until next token is available
      const neededTokens = 1 - currentTokens;
      const retryAfterSec = Math.max(1, Math.ceil(neededTokens / refillRatePerSec));

      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('X-RateLimit-Limit', capacity);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', retryAfterSec);

      logger.warn(`Token bucket rate limit exceeded for ${fullKey}`, {
        ip: req.ip,
        bucket: bucketName,
        retryAfterSec,
      });

      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT',
          message: `${errorMessage} Please retry in ${retryAfterSec} seconds.`,
          retryAfter: retryAfterSec,
          details: [],
        },
      });
    } catch (error) {
      logger.error('Token bucket middleware error', { error: error.message });
      // Fail open so legitimate users are not locked out on unexpected errors
      return next();
    }
  };
};

/**
 * Pre-configured Token Bucket for Staff/Admin Login (Email + Password)
 * Capacity: 5 attempts
 * Refill rate: 1 token every 12 seconds (~5 attempts per minute sustained, burst of 5)
 */
const passwordLoginTokenBucket = createTokenBucketLimiter({
  capacity: 5,
  refillRatePerSec: 1 / 12,
  bucketName: 'tb:login:password',
  keyGenerator: (req) => {
    const email = req.body?.email?.trim()?.toLowerCase();
    return email || 'no_email';
  },
  errorMessage: 'Too many password login attempts for this account.',
});

/**
 * Pre-configured Token Bucket for Guest OTP Requests & Registration
 * Capacity: 5 attempts
 * Refill rate: 1 token every 15 seconds (burst of 5, 4 per minute sustained)
 */
const guestOtpTokenBucket = createTokenBucketLimiter({
  capacity: 5,
  refillRatePerSec: 1 / 15,
  bucketName: 'tb:guest:otp',
  keyGenerator: (req) => {
    const id = req.body?.email || req.body?.phone || req.body?.identifier;
    return id ? String(id).trim().toLowerCase() : 'no_id';
  },
  errorMessage: 'Too many OTP requests dispatched.',
});

/**
 * Pre-configured Token Bucket for Google Authentication
 * Capacity: 8 attempts
 * Refill rate: 1 token every 8 seconds
 */
const googleAuthTokenBucket = createTokenBucketLimiter({
  capacity: 8,
  refillRatePerSec: 1 / 8,
  bucketName: 'tb:auth:google',
  keyGenerator: (req) => req.ip,
  errorMessage: 'Too many Google authentication attempts.',
});

module.exports = {
  createTokenBucketLimiter,
  passwordLoginTokenBucket,
  guestOtpTokenBucket,
  googleAuthTokenBucket,
};
