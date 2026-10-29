const crypto = require('crypto');
const webpush = require('web-push');
const env = require('../config/env');
const logger = require('../config/logger');
const { ROLES } = require('../constants');
const User = require('../models/User');
const Notification = require('../models/Notification');
const PushSubscription = require('../models/PushSubscription');
const { pushText } = require('./notificationText');

/**
 * Notification hub.
 *  1. Every (non-silent) notification is saved, so people who were offline see it later.
 *  2. Open browser tabs get it instantly over Server-Sent Events.
 *  3. Subscribed devices get a Web Push — a real phone/desktop system notification
 *     with the device's own notification sound, even when the site is closed.
 */
const clients = new Map(); // clientId -> { res, userId, role }

const HEARTBEAT_MS = 25000;
const MAX_STREAMS_PER_USER = 5;

const pushEnabled = Boolean(env.WEB_PUSH_PUBLIC_KEY && env.WEB_PUSH_PRIVATE_KEY);
if (pushEnabled) {
  webpush.setVapidDetails(env.WEB_PUSH_SUBJECT, env.WEB_PUSH_PUBLIC_KEY, env.WEB_PUSH_PRIVATE_KEY);
}

const write = (res, payload) => {
  try {
    res.write(`event: notification\ndata: ${JSON.stringify(payload)}\n\n`);
  } catch (error) {
    logger.warn('Failed to push realtime notification', { error: error.message });
  }
};

// Server links are role-relative ('/bookings'); make them absolute per recipient
const resolveLink = (link, role) => {
  if (!link || link.startsWith('/guest')) return link;
  if (role === ROLES.ADMIN) return `/admin${link}`;
  if (role === ROLES.STAFF) return `/staff${link}`;
  return link;
};

/**
 * Register an SSE stream for an authenticated user.
 */
const subscribe = (req, res) => {
  // Cap open streams per account so one user cannot exhaust server sockets
  const open = [...clients.values()].filter((c) => c.userId === req.user.id).length;
  if (open >= MAX_STREAMS_PER_USER) {
    return res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMIT', message: 'Too many open notification streams', details: [] },
    });
  }

  const clientId = crypto.randomUUID();

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();
  res.write(`retry: 5000\nevent: ready\ndata: ${JSON.stringify({ clientId })}\n\n`);

  clients.set(clientId, { res, userId: req.user.id, role: req.user.role });

  const heartbeat = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      // Socket already gone — cleanup below handles it
    }
  }, HEARTBEAT_MS);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(clientId);
  });
};

const sendPush = async (userIds, docsByUser) => {
  if (!pushEnabled || !userIds.length) return;
  const subs = await PushSubscription.find({ userId: { $in: userIds } });
  await Promise.all(subs.map(async (sub) => {
    const doc = docsByUser.get(String(sub.userId));
    if (!doc) return;
    const { title, body } = pushText(doc, sub.lang);
    const payload = JSON.stringify({ id: String(doc._id), type: doc.type, title, body, url: doc.link || '/' });
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } },
        payload,
        { TTL: 60 * 60 * 24, urgency: 'high' }
      );
    } catch (error) {
      // Device unsubscribed or the subscription expired — forget it
      if (error.statusCode === 404 || error.statusCode === 410) {
        await PushSubscription.deleteOne({ _id: sub._id }).catch(() => {});
      } else {
        logger.warn('Web push failed', { statusCode: error.statusCode, error: error.message });
      }
    }
  }));
};

/**
 * Deliver one notification to a set of recipients ({ _id, role }).
 */
const deliver = async (recipients, notification) => {
  if (!recipients.length) return;
  const { type, title, message, link, silent = false, data = {} } = notification;

  // Silent events only refresh open screens; nothing to store or push
  if (silent) {
    const ids = new Set(recipients.map((r) => String(r._id)));
    const payload = { id: crypto.randomUUID(), type, silent: true, data, createdAt: new Date().toISOString() };
    for (const client of clients.values()) {
      if (ids.has(client.userId)) write(client.res, payload);
    }
    return;
  }

  const docs = await Notification.insertMany(recipients.map((r) => ({
    userId: r._id,
    type,
    title,
    message,
    link: resolveLink(link, r.role),
    data,
  })));
  const docsByUser = new Map(docs.map((d) => [String(d.userId), d]));

  for (const client of clients.values()) {
    const doc = docsByUser.get(client.userId);
    if (doc) {
      write(client.res, {
        id: String(doc._id),
        type: doc.type,
        title: doc.title,
        message: doc.message,
        link: doc.link,
        data: doc.data,
        read: false,
        createdAt: doc.createdAt.toISOString(),
      });
    }
  }

  await sendPush(recipients.map((r) => r._id), docsByUser);
};

const notifyUser = (userId, notification) => {
  if (!userId) return;
  User.findById(userId).select('_id role').lean()
    .then((user) => (user ? deliver([user], notification) : null))
    .catch((error) => logger.warn('notifyUser failed', { error: error.message }));
};

/**
 * Notify every active user holding one of `roles`.
 * `excludeUserId` skips the person who performed the action (they already know).
 */
const notifyRoles = (roles, notification, { excludeUserId } = {}) => {
  const skip = excludeUserId ? String(excludeUserId) : null;
  User.find({ role: { $in: roles }, isActive: true }).select('_id role').lean()
    .then((users) => deliver(users.filter((u) => String(u._id) !== skip), notification))
    .catch((error) => logger.warn('notifyRoles failed', { error: error.message }));
};

const notifyStaff = (notification, options) => notifyRoles([ROLES.STAFF, ROLES.ADMIN], notification, options);

module.exports = {
  subscribe,
  notifyUser,
  notifyRoles,
  notifyStaff,
  pushEnabled,
};
