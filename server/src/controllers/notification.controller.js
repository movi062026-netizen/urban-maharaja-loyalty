const Notification = require('../models/Notification');
const PushSubscription = require('../models/PushSubscription');
const env = require('../config/env');
const { success } = require('../utils/response');
const { ValidationError } = require('../utils/errors');
const { pushEnabled } = require('../services/notification.service');

// Latest notifications + unread count for the signed-in user
const listMine = async (req, res, next) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(30).lean(),
      Notification.countDocuments({ userId: req.user.id, read: false }),
    ]);
    success(res, {
      notifications: notifications.map(({ _id, ...n }) => ({ ...n, id: String(_id) })),
      unreadCount,
    }, 'Notifications');
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    await Notification.updateOne({ _id: req.params.id, userId: req.user.id }, { read: true });
    success(res, {}, 'Marked read');
  } catch (error) {
    next(error);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    success(res, {}, 'All marked read');
  } catch (error) {
    next(error);
  }
};

const clearMine = async (req, res, next) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });
    success(res, {}, 'Notifications cleared');
  } catch (error) {
    next(error);
  }
};

const pushConfig = (req, res) => {
  success(res, { enabled: pushEnabled, publicKey: pushEnabled ? env.WEB_PUSH_PUBLIC_KEY : null }, 'Push config');
};

// Save (or move to this user) the device's push subscription
const subscribePush = async (req, res, next) => {
  try {
    const { subscription, lang } = req.body;
    const endpoint = subscription?.endpoint;
    const keys = subscription?.keys;
    if (typeof endpoint !== 'string' || !endpoint.startsWith('https://') || typeof keys?.p256dh !== 'string' || typeof keys?.auth !== 'string') {
      throw new ValidationError('Invalid push subscription');
    }
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { userId: req.user.id, endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth }, lang: lang === 'hi' ? 'hi' : 'en' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    success(res, {}, 'Push enabled');
  } catch (error) {
    next(error);
  }
};

// Called on logout so the next person using this device does not get these alerts
const unsubscribePush = async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    if (typeof endpoint === 'string') {
      await PushSubscription.deleteOne({ endpoint, userId: req.user.id });
    }
    success(res, {}, 'Push disabled');
  } catch (error) {
    next(error);
  }
};

module.exports = { listMine, markRead, markAllRead, clearMine, pushConfig, subscribePush, unsubscribePush };
