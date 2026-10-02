const Booking = require('../models/Booking');
const { success, created } = require('../utils/response');
const { logAudit } = require('../services/audit.service');

const createBooking = async (req, res, next) => {
  try {
    const { name, phone, email, date, time, guests, seating, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Guest name and phone number are required for reservation' },
      });
    }

    const booking = await Booking.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '19:30',
      guests: guests || '2 Royalty',
      seating: seating || 'Main Pavilion',
      notes: notes ? notes.trim() : '',
      status: 'PENDING',
    });

    return created(res, { booking }, 'Table reservation received successfully! Our concierge team will reach out.');
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Booking.countDocuments(query),
    ]);

    const pendingCount = await Booking.countDocuments({ status: 'PENDING' });
    const confirmedCount = await Booking.countDocuments({ status: 'CONFIRMED' });
    const todayCount = await Booking.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    return success(res, {
      bookings,
      total,
      stats: {
        pending: pendingCount,
        confirmed: confirmedCount,
        today: todayCount,
      },
    }, 'Bookings retrieved');
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!status || !allowed.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: { message: `Status must be one of: ${allowed.join(', ')}` },
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: status.toUpperCase() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { message: 'Booking not found' },
      });
    }

    if (req.user) {
      try {
        await logAudit({
          action: 'BOOKING_STATUS_UPDATE',
          performedBy: req.user._id,
          targetType: 'Booking',
          targetId: booking._id,
          details: { status: booking.status, guestName: booking.name, phone: booking.phone },
        });
      } catch (auditErr) {
        // Continue even if audit fails
      }
    }

    return success(res, { booking }, `Booking status updated to ${booking.status}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
