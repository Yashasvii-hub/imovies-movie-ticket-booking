const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Showtime = require('../models/Showtime');
const memoryStore = require('../config/memoryStore');
const { getDBMode } = require('../config/db');

// @desc    Get Admin Dashboard KPIs and summary stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const totalMovies = await Movie.countDocuments({ isActive: true });
      const totalUsers = await User.countDocuments();
      const totalShowtimes = await Showtime.countDocuments();
      const confirmedBookings = await Booking.find({ bookingStatus: 'confirmed' });

      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

      const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

      return res.status(200).json({
        success: true,
        data: {
          totalRevenue,
          totalBookings: confirmedBookings.length,
          totalTicketsSold,
          totalMovies,
          totalUsers,
          totalShowtimes,
          dbMode: getDBMode(),
          recentBookings
        }
      });
    } else {
      const totalMovies = memoryStore.movies.filter(m => m.isActive).length;
      const totalUsers = memoryStore.users.length;
      const totalShowtimes = memoryStore.showtimes.length;
      const confirmedBookings = memoryStore.bookings.filter(b => b.bookingStatus === 'confirmed');

      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);
      const recentBookings = memoryStore.bookings.slice(0, 5);

      return res.status(200).json({
        success: true,
        data: {
          totalRevenue,
          totalBookings: confirmedBookings.length,
          totalTicketsSold,
          totalMovies,
          totalUsers,
          totalShowtimes,
          dbMode: 'in-memory (fully operational)',
          recentBookings
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings across the platform
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const bookings = await Booking.find().sort({ createdAt: -1 }).populate('userId', 'name email phone');
      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } else {
      const populated = memoryStore.bookings.map(b => {
        const u = memoryStore.users.find(user => user._id.toString() === b.userId.toString());
        return {
          ...b,
          userId: u ? { name: u.name, email: u.email, phone: u.phone } : { name: 'Customer', email: 'user@imovies.com' }
        };
      });
      return res.status(200).json({ success: true, count: populated.length, data: populated });
    }
  } catch (error) {
    next(error);
  }
};
