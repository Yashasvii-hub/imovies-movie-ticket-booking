const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
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
  screenNumber: {
    type: Number,
    default: 1
  },
  screenName: {
    type: String,
    default: 'Screen 1 (IMAX)'
  },
  date: {
    type: String, // 'YYYY-MM-DD' format for clean querying
    required: true
  },
  time: {
    type: String, // e.g. '10:00 AM', '01:30 PM', '06:00 PM', '09:45 PM'
    required: true
  },
  format: {
    type: String, // '2D', '3D', 'IMAX 3D', '4DX'
    default: 'IMAX 3D'
  },
  pricing: {
    standard: { type: Number, default: 250 },
    premium: { type: Number, default: 350 },
    vip: { type: Number, default: 500 }
  },
  // Booked seats format: ['A1', 'A2', 'C5']
  bookedSeats: {
    type: [String],
    default: []
  },
  // Temporary locked seats for holding seat during payment flow (auto-expires in 8 minutes)
  lockedSeats: [
    {
      seatNumber: { type: String, required: true },
      lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      lockedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Showtime', showtimeSchema);
