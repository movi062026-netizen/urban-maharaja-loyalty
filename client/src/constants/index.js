export const ROLES = {
  GUEST: 'GUEST',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

export const STAMP_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const REDEMPTION_STATUS = {
  AVAILABLE: 'AVAILABLE',
  REDEEMED: 'REDEEMED',
  EXPIRED: 'EXPIRED',
};

export const LOYALTY_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
};

export const TIERS = {
  EMERALD: {
    name: 'Emerald',
    minStamps: 0,
    perks: ['Standard Dining Access', 'Digital Stamp Tracking', 'Seasonal Greetings'],
  },
  RUBY: {
    name: 'Ruby',
    minStamps: 7,
    perks: ['Complimentary Royal Dessert', 'Priority Floor Table', 'Chef Welcome Amuse-Bouche'],
  },
  KOHINOOR: {
    name: 'Kohinoor',
    minStamps: 12,
    perks: ['Private Jharokha Booth', 'Vintage Pairing Discounts', 'Personal Sommelier Invitation', 'Lifetime Sovereign Recognition'],
  },
};

export const ROLE_HOME_ROUTES = {
  ADMIN: '/admin/dashboard',
  STAFF: '/staff/dashboard',
  GUEST: '/guest/card',
};

export const REWARDS_TERMS_AND_CONDITIONS = [
  'Rewards are available only through the Urban Maharaja Rewards program.',
  'Stamps are provided only on eligible visits according to program rules.',
  'One rewards account is permitted per customer.',
  'Rewards cannot be exchanged for cash.',
  'Rewards cannot be combined with other offers unless specifically mentioned.',
  'Rewards are subject to their individual validity period.',
  'Urban Maharaja may modify or update the rewards program from time to time.',
  'Urban Maharaja reserves the right to verify reward eligibility before redemption.',
];
