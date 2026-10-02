const mongoose = require('mongoose');
const { REDEMPTION_STATUS } = require('../constants');

const rewardRedemptionSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
      required: true,
      index: true,
    },
    loyaltyCardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoyaltyCard',
      required: true,
    },
    redeemedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(REDEMPTION_STATUS),
      default: REDEMPTION_STATUS.AVAILABLE,
      index: true,
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    redeemedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        if (!ret.code && ret._id) {
          ret.code = 'UM-RW-' + ret._id.toString().slice(-6).toUpperCase();
        }
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.__v;
        if (!ret.code && ret._id) {
          ret.code = 'UM-RW-' + ret._id.toString().slice(-6).toUpperCase();
        }
        return ret;
      },
    },
  }
);

// Prevent duplicate AVAILABLE/REDEEMED redemptions for the same reward on the same card
rewardRedemptionSchema.index(
  { guestId: 1, rewardId: 1, loyaltyCardId: 1 },
  { unique: true }
);

module.exports = mongoose.model('RewardRedemption', rewardRedemptionSchema);
