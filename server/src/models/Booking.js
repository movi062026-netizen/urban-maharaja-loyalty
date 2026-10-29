const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    date: {
      type: String,
      required: [true, 'Reservation date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Reservation time is required'],
      trim: true,
    },
    guests: {
      type: String,
      required: [true, 'Number of guests is required'],
      trim: true,
      default: '2 Royalty',
    },
    seating: {
      type: String,
      trim: true,
      default: 'Main Pavilion',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
    },
    // Set when a signed-in customer books, so they can track it and get notified
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Short message from staff shown to the customer (e.g. "Table 7 ready")
    staffNote: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledBy: {
      type: String,
      enum: ['GUEST', 'STAFF'],
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ phone: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ guestId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
