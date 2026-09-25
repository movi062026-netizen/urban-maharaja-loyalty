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
