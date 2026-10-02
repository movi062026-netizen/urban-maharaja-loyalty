const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');

// Public route: Guest submits table reservation
router.post('/', bookingController.createBooking);

// Staff and Admin routes: View & manage incoming reservations
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.STAFF), bookingController.getBookings);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.STAFF), bookingController.updateBookingStatus);

module.exports = router;
