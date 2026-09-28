const rateLimit = require('express-rate-limit');
const {
  createTokenBucketLimiter,
  user100PerMinuteLimiter,
  passwordLoginTokenBucket,
  guestOtpTokenBucket,
  googleAuthTokenBucket,
  resolveUserKey,
} = require('./tokenBucketLimiter');

/**
 * 100 Requests Per User Per Minute Token Bucket Limiter
 * - Capacity: 100 tokens
 * - Refill Rate: 100 tokens per 60 seconds (1.6667 tokens/sec)
 * - Identifies by authenticated User ID (req.user.id / JWT), falls back to IP
 * - Independent per user: User A hitting the limit never impacts User B
 */
const apiLimiter = user100PerMinuteLimiter;
const userRateLimiter = user100PerMinuteLimiter;

/**
 * Stricter limiter for authentication endpoints (window fallback)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many authentication attempts, please try again later',
      details: [],
    },
  },
});

/**
 * Strict limiter for stamp/redemption operations
 */
const operationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many operations, please slow down',
      details: [],
    },
  },
});

module.exports = {
  apiLimiter,
  userRateLimiter,
  user100PerMinuteLimiter,
  authLimiter,
  operationLimiter,
  createTokenBucketLimiter,
  passwordLoginTokenBucket,
  guestOtpTokenBucket,
  googleAuthTokenBucket,
  resolveUserKey,
};
