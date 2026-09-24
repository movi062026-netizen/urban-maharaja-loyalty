const mongoose = require('mongoose');
const { LOYALTY_STATUS } = require('../constants');

const loyaltyCardSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    currentStamps: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetStamps: {
      type: Number,
      required: [true, 'Target stamps is required'],
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(LOYALTY_STATUS),
      default: LOYALTY_STATUS.ACTIVE,
      index: true,
    },
    cycleNumber: {
      type: Number,
      default: 1,
      min: 1,
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

// Each guest can have only one ACTIVE card at a time
loyaltyCardSchema.index(
  { guestId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: LOYALTY_STATUS.ACTIVE },
  }
);

module.exports = mongoose.model('LoyaltyCard', loyaltyCardSchema);
