/**
 * Token Bucket Rate Limiter
 * 
 * Implements the classic Token Bucket algorithm for rate limiting.
 * Provides smooth burst handling with constant refill rates.
 * Supports per-user rate limiting with IP fallback for unauthenticated requests.
 * Features atomic synchronous memory operations and atomic Redis Lua evaluation for concurrency safety.
 */

const jwt = require('jsonwebtoken');
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

  /**
   * Atomic consumption in Node.js event loop.
   * Because JavaScript runs synchronously on a single thread,
   * synchronous get-refill-check-set has zero race conditions for concurrent requests.
   */
  consume(key, capacity, refillRatePerSec, cost = 1) {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: capacity,
        lastRefill: now,
      };
    }

    // Refill tokens based on elapsed time
    const elapsedSeconds = Math.max(0, (now - bucket.lastRefill) / 1000);
    const tokensToAdd = elapsedSeconds * refillRatePerSec;
    const currentTokens = Math.min(capacity, bucket.tokens + tokensToAdd);

    if (currentTokens >= cost) {
      const remainingTokens = currentTokens - cost;
      bucket.tokens = remainingTokens;
      bucket.lastRefill = now;
      this.buckets.set(key, bucket);

      return {
        allowed: true,
        remainingTokens,
        retryAfterSec: 0,
      };
    }

    // Bucket depleted
    const neededTokens = cost - currentTokens;
    const retryAfterSec = Math.max(1, Math.ceil(neededTokens / refillRatePerSec));

    return {
      allowed: false,
      remainingTokens: 0,
      retryAfterSec,
    };
  }
}

const memoryStore = new MemoryTokenBucketStore();

/**
 * Helper to resolve user identifier:
 * 1. Authenticated user ID (req.user.id)
 * 2. JWT in Authorization header (if middleware executed before authenticate)
 * 3. Client IP address fallback (unauthenticated patrons)
 */
const resolveUserKey = (req) => {
  // 1. Authenticated user object already attached
  if (req.user && (req.user.id || req.user._id)) {
    return `user:${req.user.id || req.user._id}`;
  }

  // 2. Authorization header present with Bearer token
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      if (decoded && (decoded.id || decoded.sub)) {
        return `user:${decoded.id || decoded.sub}`;
      }
    } catch (_err) {
      // Ignore decode errors and fallback to IP
    }
  }

  // 3. Fallback to IP address for unauthenticated requests
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown-ip';
  return `ip:${ip}`;
};

/**
 * Creates an Express middleware using the Token Bucket algorithm
 * 
 * @param {Object} options
 * @param {number} options.capacity - Maximum bucket capacity (tokens)
 * @param {number} options.refillRatePerSec - Number of tokens added per second
 * @param {string} options.bucketName - Identifier prefix (e.g. 'tb:user:api')
 * @param {Function} [options.keyGenerator] - Custom key generator function (req) => string
 * @param {string} [options.errorMessage] - Custom error message for rate limit breach
 */
const createTokenBucketLimiter = ({
  capacity = 100,
  refillRatePerSec = 100 / 60, // 100 tokens per 60 seconds (1.6667 tokens/sec)
  bucketName = 'tb:default',
  keyGenerator = null,
  errorMessage = 'Too many requests. Rate limit of 100 requests per minute exceeded. Please try again later.',
}) => {
  return async (req, res, next) => {
    try {
      // 1. Resolve rate limit key
      let identifier = '';
      if (typeof keyGenerator === 'function') {
        identifier = keyGenerator(req) || resolveUserKey(req);
      } else {
        identifier = resolveUserKey(req);
      }

      const fullKey = `${bucketName}:${identifier}`;
      const redis = isRedisAvailable() ? getRedis() : null;

      let result = null;

      // When Redis is configured, execute atomic Lua evaluation
      if (redis) {
        try {
          const now = Date.now();
          const ttlSec = Math.ceil(capacity / refillRatePerSec) + 60;
          
          // Lua script for atomic token bucket in Redis
          const luaScript = `
            local key = KEYS[1]
            local capacity = tonumber(ARGV[1])
            local refillRate = tonumber(ARGV[2])
            local cost = tonumber(ARGV[3])
            local now = tonumber(ARGV[4])
            local ttl = tonumber(ARGV[5])

            local data = redis.call('get', key)
            local tokens = capacity
            local lastRefill = now

            if data then
              local decoded = cjson.decode(data)
              tokens = tonumber(decoded.tokens)
              lastRefill = tonumber(decoded.lastRefill)
              local elapsed = math.max(0, (now - lastRefill) / 1000)
              tokens = math.min(capacity, tokens + (elapsed * refillRate))
            end

            if tokens >= cost then
              tokens = tokens - cost
              local payload = cjson.encode({ tokens = tokens, lastRefill = now })
              redis.call('set', key, payload, 'EX', ttl)
              return { 1, math.floor(tokens), 0 }
            else
              local needed = cost - tokens
              local retryAfter = math.ceil(needed / refillRate)
              return { 0, 0, retryAfter }
            end
          `;

          const evalRes = await redis.eval(
            luaScript,
            [fullKey],
            [capacity, refillRatePerSec, 1, now, ttlSec]
          );

          if (evalRes && Array.isArray(evalRes)) {
            result = {
              allowed: evalRes[0] === 1,
              remainingTokens: Number(evalRes[1]),
              retryAfterSec: Number(evalRes[2]),
            };
          }
        } catch (err) {
          logger.warn('Token bucket Redis evaluation failed, falling back to memory store', {
            error: err.message,
          });
        }
      }

      // Memory Store execution (Atomic in Node.js event loop)
      if (!result) {
        result = memoryStore.consume(fullKey, capacity, refillRatePerSec, 1);
      }

      // 2. If allowed, attach rate limit headers and continue
      if (result.allowed) {
        res.setHeader('X-RateLimit-Limit', capacity);
        res.setHeader('X-RateLimit-Remaining', Math.floor(result.remainingTokens));
        res.setHeader('X-RateLimit-Reset', Math.ceil((capacity - result.remainingTokens) / refillRatePerSec));
        return next();
      }

      // 3. Bucket depleted — return 429 Too Many Requests
      res.setHeader('Retry-After', result.retryAfterSec);
      res.setHeader('X-RateLimit-Limit', capacity);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', result.retryAfterSec);

      logger.warn(`Rate limit exceeded: ${fullKey}`, {
        identifier,
        bucket: bucketName,
        retryAfterSec: result.retryAfterSec,
      });

      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT',
          message: errorMessage,
          retryAfter: result.retryAfterSec,
          details: [],
        },
      });
    } catch (error) {
      logger.error('Token bucket middleware error', { error: error.message });
      // Fail open so users are not blocked on unexpected errors
      return next();
    }
  };
};

/**
 * 100 requests per user per minute Token Bucket limiter
 * - Capacity: 100 tokens
 * - Refill rate: 100 tokens per 60 seconds (1.6667 tokens/sec)
 * - Identifies by authenticated User ID (req.user.id / JWT), falls back to IP
 * - User A reaching limit does not affect User B
 */
const user100PerMinuteLimiter = createTokenBucketLimiter({
  capacity: 100,
  refillRatePerSec: 100 / 60,
  bucketName: 'tb:user:100min',
  keyGenerator: resolveUserKey,
  errorMessage: 'Too many requests. Limit of 100 requests per minute exceeded. Please try again later.',
});

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
    const ip = req.ip || 'ip';
    return email ? `${ip}:${email}` : ip;
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
    const ip = req.ip || 'ip';
    return id ? `${ip}:${String(id).trim().toLowerCase()}` : ip;
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
  keyGenerator: (req) => req.ip || 'ip',
  errorMessage: 'Too many Google authentication attempts.',
});

module.exports = {
  createTokenBucketLimiter,
  user100PerMinuteLimiter,
  passwordLoginTokenBucket,
  guestOtpTokenBucket,
  googleAuthTokenBucket,
  resolveUserKey,
};
