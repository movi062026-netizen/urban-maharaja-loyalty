const router = require('express').Router();

const authRoutes = require('./auth.routes');
const loyaltyRoutes = require('./loyalty.routes');
const rewardRoutes = require('./reward.routes');
const adminRoutes = require('./admin.routes');
const publicRoutes = require('./public.routes');

// API v1 routes
router.use('/auth', authRoutes);
router.use('/loyalty', loyaltyRoutes);
router.use('/rewards', rewardRoutes);
router.use('/admin', adminRoutes);
router.use('/', publicRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Urban Maharaja API is running',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
