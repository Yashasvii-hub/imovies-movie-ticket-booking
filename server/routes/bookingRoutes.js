const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createBooking);

router.get('/my-bookings', protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
