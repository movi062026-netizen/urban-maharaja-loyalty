/**
 * Redis Cache Service — Application-level caching with Upstash Redis.
 * 
 * Provides domain-specific caching for:
 * - Restaurant settings (frequently read, rarely updated)
 * - Dashboard stats (expensive aggregation queries)
 * - Guest loyalty card data (read-heavy)
 * - Active rewards list (public endpoint)
 * - OTP storage for guest authentication
 * 
 * All methods fall back gracefully if Redis is unavailable.
 */
const redis = require('./client');
const logger = require('../../config/logger');

// ── Cache Key Prefixes ────────────────────────────────
const KEYS = {
  SETTINGS: 'settings:restaurant',
  DASHBOARD: 'cache:dashboard',
  ANALYTICS: (days) => `cache:analytics:${days}`,
  GUEST_CARD: (guestId) => `cache:card:${guestId}`,
  ACTIVE_REWARDS: 'cache:rewards:active',
  OTP: (phone) => `otp:${phone}`,
  OTP_ATTEMPTS: (phone) => `otp:attempts:${phone}`,
  RESET_OTP: (email) => `reset_otp:${email}`,
  RESET_ATTEMPTS: (email) => `reset_attempts:${email}`,
  SESSION: (userId) => `session:${userId}`,
  RATE_LIMIT: (key) => `rl:${key}`,
};

// ── TTL Constants (seconds) ───────────────────────────
const TTL = {
  SETTINGS: 300,       // 5 minutes
  DASHBOARD: 60,       // 1 minute
  ANALYTICS: 120,      // 2 minutes
  GUEST_CARD: 30,      // 30 seconds (frequently changing)
  ACTIVE_REWARDS: 300, // 5 minutes
  OTP: 300,            // 5 minutes
  OTP_ATTEMPTS: 900,   // 15 minutes
  RESET_OTP: 900,      // 15 minutes
  SESSION: 86400,      // 24 hours
};

// ── Settings Cache ────────────────────────────────────

const getCachedSettings = async () => {
  return redis.get(KEYS.SETTINGS);
};

const setCachedSettings = async (settings) => {
  return redis.set(KEYS.SETTINGS, settings, TTL.SETTINGS);
};

const invalidateSettings = async () => {
  return redis.del(KEYS.SETTINGS);
};

// ── Dashboard Cache ───────────────────────────────────

const getCachedDashboard = async () => {
  return redis.get(KEYS.DASHBOARD);
};

const setCachedDashboard = async (data) => {
  return redis.set(KEYS.DASHBOARD, data, TTL.DASHBOARD);
};

const invalidateDashboard = async () => {
  return redis.del(KEYS.DASHBOARD);
};

// ── Analytics Cache ───────────────────────────────────

const getCachedAnalytics = async (days) => {
  return redis.get(KEYS.ANALYTICS(days));
};

const setCachedAnalytics = async (days, data) => {
  return redis.set(KEYS.ANALYTICS(days), data, TTL.ANALYTICS);
};

// ── Guest Card Cache ──────────────────────────────────

const getCachedGuestCard = async (guestId) => {
  return redis.get(KEYS.GUEST_CARD(guestId));
};

const setCachedGuestCard = async (guestId, data) => {
  return redis.set(KEYS.GUEST_CARD(guestId), data, TTL.GUEST_CARD);
};

const invalidateGuestCard = async (guestId) => {
  return redis.del(KEYS.GUEST_CARD(guestId));
};

// ── Active Rewards Cache ──────────────────────────────

const getCachedActiveRewards = async () => {
  return redis.get(KEYS.ACTIVE_REWARDS);
};

const setCachedActiveRewards = async (rewards) => {
  return redis.set(KEYS.ACTIVE_REWARDS, rewards, TTL.ACTIVE_REWARDS);
};

const invalidateActiveRewards = async () => {
  return redis.del(KEYS.ACTIVE_REWARDS);
};

// ── OTP Management ────────────────────────────────────

/**
 * Store OTP for phone number with 5-minute TTL.
 */
const storeOtp = async (phone, otp) => {
  return redis.set(KEYS.OTP(phone), otp, TTL.OTP);
};

/**
 * Retrieve stored OTP for phone number.
 */
const getOtp = async (phone) => {
  return redis.get(KEYS.OTP(phone));
};

/**
 * Delete OTP after successful verification.
 */
const deleteOtp = async (phone) => {
  return redis.del(KEYS.OTP(phone));
};

/**
 * Track OTP request attempts for rate limiting.
 * @returns {number|null} — Current attempt count
 */
const trackOtpAttempt = async (phone) => {
  const key = KEYS.OTP_ATTEMPTS(phone);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, TTL.OTP_ATTEMPTS);
  }
  return count;
};

/**
 * Get current OTP attempt count.
 */
const getOtpAttempts = async (phone) => {
  return (await redis.get(KEYS.OTP_ATTEMPTS(phone))) || 0;
};

// ── Reset Password OTP Management ──────────────────────

/**
 * Store password reset OTP for email with 15-minute TTL.
 */
const storeResetOtp = async (email, otp) => {
  const normalized = email.trim().toLowerCase();
  return redis.set(KEYS.RESET_OTP(normalized), otp, TTL.RESET_OTP);
};

/**
 * Retrieve stored password reset OTP for email.
 */
const getResetOtp = async (email) => {
  const normalized = email.trim().toLowerCase();
  return redis.get(KEYS.RESET_OTP(normalized));
};

/**
 * Delete password reset OTP after successful reset.
 */
const deleteResetOtp = async (email) => {
  const normalized = email.trim().toLowerCase();
  return redis.del(KEYS.RESET_OTP(normalized));
};

/**
 * Track password reset attempts for rate limiting.
 */
const trackResetAttempt = async (email) => {
  const normalized = email.trim().toLowerCase();
  const key = KEYS.RESET_ATTEMPTS(normalized);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, TTL.RESET_OTP);
  }
  return count;
};

// ── Session / Token Blacklist ─────────────────────────

/**
 * Store active session token for user.
 */
const setSession = async (userId, tokenData) => {
  return redis.set(KEYS.SESSION(userId), tokenData, TTL.SESSION);
};

/**
 * Get user's active session.
 */
const getSession = async (userId) => {
  return redis.get(KEYS.SESSION(userId));
};

/**
 * Remove session on logout.
 */
const removeSession = async (userId) => {
  return redis.del(KEYS.SESSION(userId));
};

// ── Cache Invalidation Helpers ────────────────────────

/**
 * Invalidate all loyalty-related caches for a guest.
 * Call after stamp approval, rejection, or reward redemption.
 */
const invalidateGuestCaches = async (guestId) => {
  await Promise.all([
    invalidateGuestCard(guestId),
    invalidateDashboard(),
  ]);
};

/**
 * Invalidate all reward-related caches.
 * Call after reward create/update/deactivate.
 */
const invalidateRewardCaches = async () => {
  await invalidateActiveRewards();
};

module.exports = {
  KEYS,
  TTL,
  // Settings
  getCachedSettings,
  setCachedSettings,
  invalidateSettings,
  // Dashboard
  getCachedDashboard,
  setCachedDashboard,
  invalidateDashboard,
  // Analytics
  getCachedAnalytics,
  setCachedAnalytics,
  // Guest Card
  getCachedGuestCard,
  setCachedGuestCard,
  invalidateGuestCard,
  // Rewards
  getCachedActiveRewards,
  setCachedActiveRewards,
  invalidateActiveRewards,
  // OTP
  storeOtp,
  getOtp,
  deleteOtp,
  trackOtpAttempt,
  getOtpAttempts,
  // Password Reset OTP (Resend)
  storeResetOtp,
  getResetOtp,
  deleteResetOtp,
  trackResetAttempt,
  // Session
  setSession,
  getSession,
  removeSession,
  // Invalidation helpers
  invalidateGuestCaches,
  invalidateRewardCaches,
};
