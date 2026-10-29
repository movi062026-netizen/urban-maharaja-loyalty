const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const bookingController = require('../controllers/booking.controller');
const { authenticate, authorize, optionalAuthenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ROLES } = require('../constants');
const { bookingRules, mongoIdParam } = require('../validators/business.validator');

// Public form — cap submissions per IP so it cannot be used to spam staff
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Too many reservation requests. Please call us instead.', details: [] },
  },
});

const statusRules = [
  body('status').isString().isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).withMessage('Invalid status'),
  body('staffNote').optional().isString().isLength({ max: 300 }).withMessage('Note cannot exceed 300 characters'),
];

// Public route: anyone can request a table; signed-in customers get it linked for tracking
router.post('/', bookingLimiter, optionalAuthenticate, bookingRules, validate, bookingController.createBooking);

// Customer: track & cancel own bookings
router.get('/me', authenticate, authorize(ROLES.GUEST), bookingController.getMyBookings);
router.patch('/me/:id/cancel', authenticate, authorize(ROLES.GUEST), mongoIdParam, validate, bookingController.cancelMyBooking);

// Staff and Admin routes: View & manage incoming reservations
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.STAFF), bookingController.getBookings);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.STAFF), mongoIdParam, statusRules, validate, bookingController.updateBookingStatus);

module.exports = router;
