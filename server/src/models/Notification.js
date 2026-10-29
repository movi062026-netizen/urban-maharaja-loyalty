const mongoose = require('mongoose');

const NOTIFICATION_TTL_DAYS = 30;

/**
 * Stored copy of every notification so users who were offline still see it.
 * Old notifications expire automatically after NOTIFICATION_TTL_DAYS.
 */
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, maxlength: 60 },
    title: { type: String, maxlength: 200 },
    message: { type: String, maxlength: 1000 },
    link: { type: String, maxlength: 200 },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: NOTIFICATION_TTL_DAYS * 24 * 60 * 60 });

module.exports = mongoose.model('Notification', notificationSchema);
