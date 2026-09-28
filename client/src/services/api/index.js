import api from './client';

export const authApi = {
  requestOtp: (payload) => {
    const data = typeof payload === 'string' ? { email: payload } : payload;
    return api.post('/auth/guest/request-otp', data);
  },
  verifyOtp: (identifier, otp) => {
    const data = typeof identifier === 'string'
      ? { email: identifier, otp }
      : { ...identifier, otp };
    return api.post('/auth/guest/verify-otp', data);
  },
  registerCustomer: (data) => api.post('/auth/guest/register', data),
  guestLogin: (identifier, password) => {
    const clean = String(identifier).trim();
    const payload = clean.includes('@')
      ? { email: clean.toLowerCase(), identifier: clean, password }
      : { phone: clean.replace(/\D/g, ''), identifier: clean, password };
    return api.post('/auth/guest/login', payload);
  },
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  adminLogin: (email, password) => api.post('/auth/admin/login', { email, password }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
};

export const loyaltyApi = {
  getMyCard: () => api.get('/loyalty/cards/me'),
  getMyStamps: () => api.get('/loyalty/stamps/me'),
  getMyHistory: () => api.get('/loyalty/history/me'),
  requestMyStamp: () => api.post('/loyalty/stamps/request-my-stamp'),
  startNextCycle: () => api.post('/loyalty/cards/next-cycle'),
  searchGuest: (query) => {
    const params = typeof query === 'object'
      ? query
      : (query?.includes('@') ? { email: query } : { query });
    return api.get('/loyalty/guests/search', { params });
  },
  requestStamp: (guestId) => api.post('/loyalty/stamps', { guestId }),
  approveStamp: (stampId) => api.patch(`/loyalty/stamps/${stampId}/approve`),
  rejectStamp: (stampId, reason) => api.patch(`/loyalty/stamps/${stampId}/reject`, { reason }),
};

export const rewardApi = {
  getActiveRewards: () => api.get('/rewards'),
  getReward: (id) => api.get(`/rewards/${id}`),
  getMyRedemptions: () => api.get('/rewards/me'),
  createReward: (data) => api.post('/rewards', data),
  updateReward: (id, data) => api.patch(`/rewards/${id}`, data),
  redeemReward: (redemptionId) => api.post(`/rewards/${redemptionId}/redeem`),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: (days = 30) => api.get('/admin/analytics', { params: { days } }),
  getGuests: (params) => api.get('/admin/guests', { params }),
  getGuestDetail: (id) => api.get(`/admin/guests/${id}`),
  getStamps: (params) => api.get('/admin/stamps', { params }),
  getRewards: () => api.get('/admin/rewards'),
  getRedemptions: (params) => api.get('/admin/redemptions', { params }),
  getStaff: () => api.get('/admin/staff'),
  createStaff: (data) => api.post('/admin/staff', data),
  updateStaff: (id, data) => api.patch(`/admin/staff/${id}`, data),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  getRecentActivity: () => api.get('/admin/activity'),
};

export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data),
};

export const reviewApi = {
  trackClick: (source) => api.post('/reviews/track', { source }),
};

export const surpriseApi = {
  play: () => api.post('/surprise'),
};
