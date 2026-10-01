/**
 * Database seed script — Idempotent
 * Creates demo data for development.
 * 
 * Usage: npm run seed
 * 
 * NEVER run against production database.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const LoyaltyCard = require('../models/LoyaltyCard');
const Stamp = require('../models/Stamp');
const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const RestaurantSettings = require('../models/RestaurantSettings');
const AuditLog = require('../models/AuditLog');
const { ROLES, LOYALTY_STATUS, STAMP_STATUS, REDEMPTION_STATUS, REWARD_TYPES, AUDIT_ACTIONS, ENTITY_TYPES } = require('../constants');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-maharaja';

const seed = async () => {
  console.log('🌱 Starting seed...');
  console.log(`📦 Database: ${MONGODB_URI}`);

  // Safety check
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot seed in production!');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data (idempotent)
  await Promise.all([
    User.deleteMany({}),
    LoyaltyCard.deleteMany({}),
    Stamp.deleteMany({}),
    Reward.deleteMany({}),
    RewardRedemption.deleteMany({}),
    RestaurantSettings.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // ── Admin ──────────────────────────────────────────
  const admin = await User.create({
    name: 'Admin Maharaja',
    email: 'admin@urbanmaharaja.com',
    password: 'Admin@123',
    role: ROLES.ADMIN,
  });
  console.log('👑 Admin created: admin@urbanmaharaja.com / Admin@123');

  // ── Staff ──────────────────────────────────────────
  const staff = await User.create({
    name: 'Ravi Kumar',
    email: 'staff@urbanmaharaja.com',
    password: 'Staff@123',
    role: ROLES.STAFF,
  });
  console.log('🧑‍💼 Staff created: staff@urbanmaharaja.com / Staff@123');

  // ── Guests ─────────────────────────────────────────
  const guestData = [
    { name: 'Rahul Sharma', phone: '9876543210' },
    { name: 'Priya Patel', phone: '9876543211' },
    { name: 'Amit Singh', phone: '9876543212' },
    { name: 'Sneha Reddy', phone: '9876543213' },
    { name: 'Vikram Malhotra', phone: '9876543214' },
    { name: 'Anita Desai', phone: '9876543215' },
    { name: 'Karan Kapoor', phone: '9876543216' },
    { name: 'Meera Joshi', phone: '9876543217' },
    { name: 'Arjun Nair', phone: '9876543218' },
    { name: 'Deepika Gupta', phone: '9876543219' },
  ];

  const guests = await User.insertMany(
    guestData.map((g) => ({ ...g, role: ROLES.GUEST }))
  );
  console.log(`👥 ${guests.length} guests created`);

  // ── Rewards ────────────────────────────────────────
  const rewards = await Reward.insertMany([
    {
      title: 'Complimentary Royal Dessert',
      description: 'A signature dessert from our royal kitchen, on the house.',
      requiredStamps: 5,
      validityDays: 30,
      rewardType: REWARD_TYPES.COMPLIMENTARY_ITEM,
      isActive: true,
    },
    {
      title: '20% Royal Discount',
      description: 'Enjoy 20% off your entire dining bill.',
      requiredStamps: 5,
      validityDays: 14,
      rewardType: REWARD_TYPES.DISCOUNT_PERCENTAGE,
      metadata: { percentage: 20 },
      isActive: true,
    },
    {
      title: 'Complimentary Royal Beverage',
      description: 'A premium beverage of your choice.',
      requiredStamps: 3,
      validityDays: 21,
      rewardType: REWARD_TYPES.FREE_BEVERAGE,
      isActive: true,
    },
  ]);
  console.log(`🎁 ${rewards.length} rewards created`);

  // ── Restaurant Settings ────────────────────────────
  await RestaurantSettings.create({
    restaurantName: 'Urban Maharaja',
    tagline: 'A Fine Dine',
    address: 'Plot No. AC-209, Central Spine, Mahal Road, Jagatpura, Jaipur, Rajasthan 302017',
    phone: '+91 (800) MAHARAJA',
    email: 'contact@urbanmaharaja.com',
    googleReviewUrl: 'https://share.google/2nmScZz1II7jKmnKO',
    googleMapsUrl: 'https://share.google/2nmScZz1II7jKmnKO',
    reservationUrl: 'https://urban-maharaja-premium-restaurant-menu-website-hbi32srb0.vercel.app/',
    loyaltyConfig: {
      targetStamps: 5,
      isRoyalSurpriseEnabled: true,
      royalSurpriseOptions: [
        { title: 'Complimentary Dessert', description: 'A sweet royal treat!', probability: 0.3 },
        { title: '10% Discount', description: 'Enjoy 10% off your bill.', probability: 0.25 },
        { title: 'Free Beverage', description: 'A refreshing drink on us!', probability: 0.15 },
        { title: 'Better Luck Next Time', description: 'Your next visit might be luckier!', probability: 0.3 },
      ],
    },
  });
  console.log('⚙️  Restaurant settings created');

  // ── Loyalty Cards & Stamps ─────────────────────────

  // Guest 1: Rahul — 3 stamps (active card)
  const card1 = await LoyaltyCard.create({
    guestId: guests[0]._id,
    currentStamps: 3,
    targetStamps: 5,
    status: LOYALTY_STATUS.ACTIVE,
    cycleNumber: 1,
  });

  for (let i = 0; i < 3; i++) {
    await Stamp.create({
      guestId: guests[0]._id,
      loyaltyCardId: card1._id,
      visitId: `visit-${guests[0]._id}-seed-${i}`,
      approvedBy: staff._id,
      status: STAMP_STATUS.APPROVED,
      approvedAt: new Date(Date.now() - (3 - i) * 7 * 24 * 60 * 60 * 1000),
    });
  }

  // Guest 2: Priya — completed cycle + active cycle 2
  const card2a = await LoyaltyCard.create({
    guestId: guests[1]._id,
    currentStamps: 5,
    targetStamps: 5,
    status: LOYALTY_STATUS.COMPLETED,
    cycleNumber: 1,
  });

  for (let i = 0; i < 5; i++) {
    await Stamp.create({
      guestId: guests[1]._id,
      loyaltyCardId: card2a._id,
      visitId: `visit-${guests[1]._id}-seed-c1-${i}`,
      approvedBy: staff._id,
      status: STAMP_STATUS.APPROVED,
      approvedAt: new Date(Date.now() - (10 - i) * 7 * 24 * 60 * 60 * 1000),
    });
  }

  // Redeemed reward for Priya
  await RewardRedemption.create({
    guestId: guests[1]._id,
    rewardId: rewards[0]._id,
    loyaltyCardId: card2a._id,
    redeemedBy: staff._id,
    status: REDEMPTION_STATUS.REDEEMED,
    redeemedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
  });

  const card2b = await LoyaltyCard.create({
    guestId: guests[1]._id,
    currentStamps: 2,
    targetStamps: 5,
    status: LOYALTY_STATUS.ACTIVE,
    cycleNumber: 2,
  });

  for (let i = 0; i < 2; i++) {
    await Stamp.create({
      guestId: guests[1]._id,
      loyaltyCardId: card2b._id,
      visitId: `visit-${guests[1]._id}-seed-c2-${i}`,
      approvedBy: staff._id,
      status: STAMP_STATUS.APPROVED,
      approvedAt: new Date(Date.now() - (2 - i) * 7 * 24 * 60 * 60 * 1000),
    });
  }

  // Guest 3: Amit — 5 stamps, reward available (not yet redeemed)
  const card3 = await LoyaltyCard.create({
    guestId: guests[2]._id,
    currentStamps: 5,
    targetStamps: 5,
    status: LOYALTY_STATUS.COMPLETED,
    cycleNumber: 1,
  });

  for (let i = 0; i < 5; i++) {
    await Stamp.create({
      guestId: guests[2]._id,
      loyaltyCardId: card3._id,
      visitId: `visit-${guests[2]._id}-seed-${i}`,
      approvedBy: staff._id,
      status: STAMP_STATUS.APPROVED,
      approvedAt: new Date(Date.now() - (5 - i) * 5 * 24 * 60 * 60 * 1000),
    });
  }

  await RewardRedemption.create({
    guestId: guests[2]._id,
    rewardId: rewards[0]._id,
    loyaltyCardId: card3._id,
    status: REDEMPTION_STATUS.AVAILABLE,
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  });

  // Guest 4: Sneha — pending stamp
  const card4 = await LoyaltyCard.create({
    guestId: guests[3]._id,
    currentStamps: 1,
    targetStamps: 5,
    status: LOYALTY_STATUS.ACTIVE,
    cycleNumber: 1,
  });

  await Stamp.create({
    guestId: guests[3]._id,
    loyaltyCardId: card4._id,
    visitId: `visit-${guests[3]._id}-seed-0`,
    approvedBy: staff._id,
    status: STAMP_STATUS.APPROVED,
    approvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  });

  await Stamp.create({
    guestId: guests[3]._id,
    loyaltyCardId: card4._id,
    visitId: `visit-${guests[3]._id}-seed-pending`,
    status: STAMP_STATUS.PENDING,
  });

  // Remaining guests — new cards with 0 stamps
  for (let i = 4; i < guests.length; i++) {
    await LoyaltyCard.create({
      guestId: guests[i]._id,
      currentStamps: 0,
      targetStamps: 5,
      status: LOYALTY_STATUS.ACTIVE,
      cycleNumber: 1,
    });
  }

  // ── Audit Logs ─────────────────────────────────────
  const auditEntries = [
    { actorId: admin._id, actorRole: ROLES.ADMIN, action: AUDIT_ACTIONS.LOGIN, entityType: ENTITY_TYPES.USER, entityId: admin._id },
    { actorId: staff._id, actorRole: ROLES.STAFF, action: AUDIT_ACTIONS.LOGIN, entityType: ENTITY_TYPES.USER, entityId: staff._id },
    { actorId: staff._id, actorRole: ROLES.STAFF, action: AUDIT_ACTIONS.STAMP_APPROVED, entityType: ENTITY_TYPES.STAMP, metadata: { guestName: 'Rahul Sharma' } },
    { actorId: admin._id, actorRole: ROLES.ADMIN, action: AUDIT_ACTIONS.REWARD_CREATED, entityType: ENTITY_TYPES.REWARD, metadata: { title: 'Complimentary Royal Dessert' } },
    { actorId: admin._id, actorRole: ROLES.ADMIN, action: AUDIT_ACTIONS.SETTINGS_UPDATED, entityType: ENTITY_TYPES.SETTINGS, metadata: { updatedFields: ['loyaltyConfig'] } },
    { actorId: staff._id, actorRole: ROLES.STAFF, action: AUDIT_ACTIONS.REWARD_REDEEMED, entityType: ENTITY_TYPES.REDEMPTION, metadata: { guestName: 'Priya Patel' } },
  ];

  await AuditLog.insertMany(auditEntries);
  console.log(`📋 ${auditEntries.length} audit logs created`);

  console.log('\n✅ Seed complete!\n');
  console.log('Demo credentials:');
  console.log('  Admin:  admin@urbanmaharaja.com / Admin@123');
  console.log('  Staff:  staff@urbanmaharaja.com / Staff@123');
  console.log('  Guest:  Phone: 9876543210 | OTP: 123456 (dev mode)');
  console.log('');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
