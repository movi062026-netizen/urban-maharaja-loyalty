const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const settingsController = require('../controllers/settings.controller');
const { authenticate } = require('../middleware/auth');

// Public settings (for frontend)
router.get('/settings', settingsController.getSettings);

// Review tracking (authenticated guests)
router.post('/reviews/track', authenticate, reviewController.trackReviewClick);

// Royal Surprise (authenticated guests)
router.post('/surprise', authenticate, reviewController.playRoyalSurprise);

module.exports = router;
