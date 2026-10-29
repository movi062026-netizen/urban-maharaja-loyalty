const mongoose = require('mongoose');

/**
 * A browser/device that agreed to receive push notifications for a user.
 * One document per device endpoint; re-subscribing on login moves it to the new user.
 */
const pushSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    endpoint: { type: String, required: true, unique: true, maxlength: 1000 },
    keys: {
      p256dh: { type: String, required: true, maxlength: 200 },
      auth: { type: String, required: true, maxlength: 100 },
    },
    lang: { type: String, enum: ['en', 'hi'], default: 'en' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);
