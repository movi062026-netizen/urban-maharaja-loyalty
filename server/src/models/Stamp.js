const mongoose = require('mongoose');
const { STAMP_STATUS } = require('../constants');

const stampSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    loyaltyCardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoyaltyCard',
      required: true,
      index: true,
    },
    visitId: {
      type: String,
      required: [true, 'Visit ID is required'],
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(STAMP_STATUS),
      default: STAMP_STATUS.PENDING,
      index: true,
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent duplicate stamps for the same visit on the same loyalty card
stampSchema.index({ loyaltyCardId: 1, visitId: 1 }, { unique: true });

module.exports = mongoose.model('Stamp', stampSchema);
