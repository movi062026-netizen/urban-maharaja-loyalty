const Booking = require('../models/Booking');
const { success, created } = require('../utils/response');
const { createAuditLog, auditContext } = require('../services/audit.service');
const notifications = require('../services/notification.service');
const { sendBookingStatusEmail } = require('../integrations/email');
const { AUDIT_ACTIONS, ENTITY_TYPES, PAGINATION, ROLES } = require('../constants');
const { NotFoundError, ConflictError } = require('../utils/errors');

const { escapeRegex } = require('../utils/regex');

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

const bookingSummary = (booking) => ({
  bookingId: booking._id,
  name: booking.name,
  guests: booking.guests,
  date: booking.date,
  time: booking.time,
  status: booking.status,
  staffNote: booking.staffNote,
});

// Tell the customer (in-app if they have an account, email if they left one)
const notifyCustomer = (booking) => {
  if (booking.guestId) {
    notifications.notifyUser(booking.guestId, {
      type: `BOOKING_${booking.status}`,
      title: `Table booking ${booking.status.toLowerCase()}`,
      message: `Your table for ${booking.guests} on ${booking.date} at ${booking.time} is ${booking.status.toLowerCase()}.`,
      link: '/guest/bookings',
      data: bookingSummary(booking),
    });
  }
  if (booking.email) {
    sendBookingStatusEmail({
      to: booking.email,
      name: booking.name,
      status: booking.status,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      staffNote: booking.staffNote,
    }).catch(() => {});
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { name, phone, email, date, time, guests, seating, notes } = req.body;

    // Signed-in customers get the booking linked to their account for live tracking
    const guestId = req.user?.role === ROLES.GUEST ? req.user.id : undefined;

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
      guestId,
    });

    notifications.notifyStaff({
      type: 'BOOKING_CREATED',
      title: 'New table reservation',
      message: `${booking.name} booked a table for ${booking.guests} on ${booking.date} at ${booking.time}.`,
      link: '/bookings',
      data: bookingSummary(booking),
    });
    notifyCustomer(booking);

    return created(
      res,
      { booking, tracked: Boolean(guestId) },
      'Table request received! You will be notified as soon as our team confirms it.'
    );
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (typeof status === 'string' && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    if (typeof search === 'string' && search.trim()) {
      const pattern = escapeRegex(String(search).trim());
      query.$or = [
        { name: { $regex: pattern, $options: 'i' } },
        { phone: { $regex: pattern, $options: 'i' } },
        { email: { $regex: pattern, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;
    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
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

// Customer: their own bookings, newest first
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guestId: req.user.id })
      .select('-handledBy')
      .sort({ createdAt: -1 })
      .limit(50);
    return success(res, { bookings }, 'Your bookings');
  } catch (error) {
    next(error);
  }
};

// Customer: cancel their own upcoming booking
const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, guestId: req.user.id });
    if (!booking) throw new NotFoundError('Booking not found');
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new ConflictError(`This booking is already ${booking.status.toLowerCase()}`);
    }

    booking.status = 'CANCELLED';
    booking.cancelledBy = 'GUEST';
    await booking.save();

    createAuditLog({
      ...auditContext(req),
      action: AUDIT_ACTIONS.BOOKING_STATUS_UPDATED,
      entityType: ENTITY_TYPES.BOOKING,
      entityId: booking._id,
      metadata: { status: booking.status, cancelledBy: 'GUEST' },
    });

    notifications.notifyStaff({
      type: 'BOOKING_CANCELLED_BY_GUEST',
      title: 'Booking cancelled by guest',
      message: `${booking.name} cancelled their table for ${booking.date} at ${booking.time}.`,
      link: '/bookings',
      data: bookingSummary(booking),
    });

    return success(res, { booking }, 'Booking cancelled');
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, staffNote } = req.body;

    if (typeof status !== 'string' || !STATUSES.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: { message: `Status must be one of: ${STATUSES.join(', ')}` },
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) throw new NotFoundError('Booking not found');

    const previous = booking.status;
    booking.status = status.toUpperCase();
    booking.handledBy = req.user.id;
    if (typeof staffNote === 'string') booking.staffNote = staffNote.trim().slice(0, 300);
    if (booking.status === 'CANCELLED') booking.cancelledBy = 'STAFF';
    await booking.save();

    createAuditLog({
      ...auditContext(req),
      action: AUDIT_ACTIONS.BOOKING_STATUS_UPDATED,
      entityType: ENTITY_TYPES.BOOKING,
      entityId: booking._id,
      metadata: { from: previous, status: booking.status, guestName: booking.name, phone: booking.phone },
    });

    if (previous !== booking.status) {
      notifyCustomer(booking);

      // Keep the rest of the team in sync (the person who acted already knows)
      notifications.notifyStaff(
        {
          type: 'BOOKING_UPDATED',
          title: 'Booking updated',
          message: `${req.user.name} marked ${booking.name}'s booking as ${booking.status.toLowerCase()}.`,
          link: '/bookings',
          data: { ...bookingSummary(booking), actorName: req.user.name },
        },
        { excludeUserId: req.user.id }
      );
    }

    return success(res, { booking }, `Booking status updated to ${booking.status}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getMyBookings,
  cancelMyBooking,
  updateBookingStatus,
};
