/**
 * Create (or rotate the password of) an administrator account.
 *
 * Non-destructive: never deletes or modifies any other data.
 * Credentials come from environment variables so they never live in the repo:
 *
 *   ADMIN_NAME="Owner Name" ADMIN_EMAIL=owner@example.com ADMIN_PASSWORD='...' npm run create-admin
 *
 * Add --reset-password to change the password of an existing admin.
 */
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const { ROLES } = require('../constants');

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,128}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exit(1);
};

const run = async () => {
  const name = (process.env.ADMIN_NAME || 'Administrator').trim();
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const resetPassword = process.argv.includes('--reset-password');

  if (!process.env.MONGODB_URI) fail('MONGODB_URI is not set.');
  if (!EMAIL.test(email)) fail('Set ADMIN_EMAIL to a valid email address.');
  if (!STRONG_PASSWORD.test(password)) {
    fail('ADMIN_PASSWORD must be 12+ characters with uppercase, lowercase, a number and a symbol.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email }).select('+password +refreshToken');

  if (existing) {
    if (existing.role !== ROLES.ADMIN) {
      fail(`${email} already belongs to a ${existing.role} account. Use a different email.`);
    }
    if (!resetPassword) {
      console.log(`ℹ️  Admin ${email} already exists. Re-run with --reset-password to change its password.`);
    } else {
      existing.password = password;
      existing.refreshToken = null; // sign out every existing session
      existing.isActive = true;
      await existing.save();
      console.log(`🔑 Password updated for admin ${email}. All sessions were signed out.`);
    }
  } else {
    await User.create({ name, email, password, role: ROLES.ADMIN, isActive: true });
    console.log(`👑 Admin created: ${email}`);
  }

  await mongoose.connection.close();
};

run().catch(async (err) => {
  console.error('❌ create-admin failed:', err.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
