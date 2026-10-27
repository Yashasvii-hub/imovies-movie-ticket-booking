const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide theater name'],
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    default: 'Metropolis'
  },
  screens: [
    {
      screenNumber: { type: Number, default: 1 },
      screenName: { type: String, default: 'Screen 1 (IMAX)' },
      soundSystem: { type: String, default: 'Dolby Atmos 7.1' },
      totalSeats: { type: Number, default: 60 },
      seatLayout: {
        rows: { type: [String], default: ['A', 'B', 'C', 'D', 'E', 'F'] },
        seatsPerRow: { type: Number, default: 10 },
        tiers: [
          {
            name: { type: String, default: 'Standard' }, // Standard, Premium, VIP
            rows: { type: [String], default: ['A', 'B', 'C'] },
            basePrice: { type: Number, default: 250 }
          },
          {
            name: { type: String, default: 'Premium' },
            rows: { type: [String], default: ['D', 'E'] },
            basePrice: { type: Number, default: 350 }
          },
          {
            name: { type: String, default: 'VIP Recliner' },
            rows: { type: [String], default: ['F'] },
            basePrice: { type: Number, default: 500 }
          }
        ]
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Theater', theaterSchema);
