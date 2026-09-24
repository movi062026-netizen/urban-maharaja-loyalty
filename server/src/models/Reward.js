const mongoose = require('mongoose');
const { REWARD_TYPES } = require('../constants');

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reward title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    requiredStamps: {
      type: Number,
      required: [true, 'Required stamps is required'],
      min: [1, 'Required stamps must be at least 1'],
    },
    validityDays: {
      type: Number,
      default: 30,
      min: [1, 'Validity must be at least 1 day'],
    },
    rewardType: {
      type: String,
      enum: Object.values(REWARD_TYPES),
      default: REWARD_TYPES.COMPLIMENTARY_ITEM,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

module.exports = mongoose.model('Reward', rewardSchema);
