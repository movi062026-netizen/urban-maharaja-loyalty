const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.GUEST,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    // Dev-only OTP for guest authentication
    devOtp: {
      type: String,
      select: false,
    },
    devOtpExpiry: {
      type: Date,
      select: false,
    },
    // Password reset fields (powered by Resend)
    resetPasswordOtp: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.devOtp;
        delete ret.devOtpExpiry;
        delete ret.resetPasswordOtp;
        delete ret.resetPasswordExpires;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index: phone must be unique among guests
userSchema.index({ phone: 1, role: 1 }, { unique: true, sparse: true });
// Email must be unique for staff/admin
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
