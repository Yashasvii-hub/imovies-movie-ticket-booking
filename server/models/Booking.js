const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String },
  theaterName: { type: String, required: true },
  screenName: { type: String, required: true },
  showDate: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: [
    {
      seatNumber: { type: String, required: true },
      tier: { type: String, default: 'Standard' },
      price: { type: Number, required: true }
    }
  ],
  subtotal: { type: Number, required: true },
  convenienceFee: { type: Number, default: 35 },
  tax: { type: Number, default: 18 },
  totalAmount: { type: Number, required: true },
  paymentDetails: {
    method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'], default: 'card' },
    transactionId: { type: String, required: true },
    status: { type: String, enum: ['success', 'pending', 'failed'], default: 'success' },
    paidAt: { type: Date, default: Date.now }
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  qrCodeData: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
