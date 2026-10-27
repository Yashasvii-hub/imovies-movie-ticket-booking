const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const memoryStore = require('../config/memoryStore');

// Helper to generate a unique booking reference
const generateBookingRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'IM-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// @desc    Process simulated payment and complete seat booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      showtimeId,
      seats, // array of { seatNumber, tier, price }
      paymentMethod // 'card' | 'upi' | 'netbanking' | 'wallet'
    } = req.body;

    const userId = req.user._id || req.user.id;

    if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Showtime ID and seats are required to complete booking.' });
    }

    const seatNumbers = seats.map(s => s.seatNumber);
    const subtotal = seats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
    const convenienceFee = 35;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const totalAmount = subtotal + convenienceFee + tax;

    const bookingRef = generateBookingRef();
    const transactionId = 'TXN-' + Math.random().toString(36).substring(2, 12).toUpperCase();

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const showtime = await Showtime.findById(showtimeId).populate('movieId').populate('theaterId');
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });

      // Verify seats are not already booked
      const conflict = seatNumbers.find(s => showtime.bookedSeats.includes(s));
      if (conflict) {
        return res.status(400).json({ success: false, message: `Seat ${conflict} was just booked by another user.` });
      }

      // Add to booked seats and clear locks
      showtime.bookedSeats.push(...seatNumbers);
      showtime.lockedSeats = showtime.lockedSeats.filter(l => !seatNumbers.includes(l.seatNumber));
      await showtime.save();

      const booking = await Booking.create({
        bookingReference: bookingRef,
        userId,
        movieId: showtime.movieId._id,
        theaterId: showtime.theaterId._id,
        showtimeId: showtime._id,
        movieTitle: showtime.movieId.title,
        moviePoster: showtime.movieId.posterUrl,
        theaterName: showtime.theaterId.name,
        screenName: showtime.screenName,
        showDate: showtime.date,
        showTime: showtime.time,
        seats,
        subtotal,
        convenienceFee,
        tax,
        totalAmount,
        paymentDetails: {
          method: paymentMethod || 'card',
          transactionId,
          status: 'success',
          paidAt: new Date()
        },
        bookingStatus: 'confirmed',
        qrCodeData: `IMOVIES|${bookingRef}|${showtime.movieId.title}|SEATS:${seatNumbers.join(',')}|TOTAL:${totalAmount}`
      });

      return res.status(201).json({
        success: true,
        message: 'Tickets booked successfully!',
        data: booking
      });
    } else {
      const showtime = memoryStore.showtimes.find(s => s._id.toString() === showtimeId.toString());
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });

      const movie = memoryStore.movies.find(m => m._id.toString() === showtime.movieId.toString());
      const theater = memoryStore.theaters.find(t => t._id.toString() === showtime.theaterId.toString());

      const conflict = seatNumbers.find(s => showtime.bookedSeats.includes(s));
      if (conflict) {
        return res.status(400).json({ success: false, message: `Seat ${conflict} was just booked.` });
      }

      showtime.bookedSeats.push(...seatNumbers);
      showtime.lockedSeats = showtime.lockedSeats.filter(l => !seatNumbers.includes(l.seatNumber));

      const newBooking = {
        _id: '66a5' + Math.random().toString(16).substring(2, 22).padEnd(20, '0'),
        bookingReference: bookingRef,
        userId: userId.toString(),
        movieId: movie ? movie._id : showtime.movieId,
        theaterId: theater ? theater._id : showtime.theaterId,
        showtimeId: showtime._id,
        movieTitle: movie ? movie.title : 'Movie',
        moviePoster: movie ? movie.posterUrl : '',
        theaterName: theater ? theater.name : 'Grand Cineplex',
        screenName: showtime.screenName,
        showDate: showtime.date,
        showTime: showtime.time,
        seats,
        subtotal,
        convenienceFee,
        tax,
        totalAmount,
        paymentDetails: {
          method: paymentMethod || 'card',
          transactionId,
          status: 'success',
          paidAt: new Date()
        },
        bookingStatus: 'confirmed',
        qrCodeData: `IMOVIES|${bookingRef}|${movie ? movie.title : 'Movie'}|SEATS:${seatNumbers.join(',')}|TOTAL:${totalAmount}`,
        createdAt: new Date()
      };

      memoryStore.bookings.unshift(newBooking);

      return res.status(201).json({
        success: true,
        message: 'Tickets booked successfully!',
        data: newBooking
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking history for current logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } else {
      const bookings = memoryStore.bookings.filter(b => b.userId.toString() === userId.toString());
      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking voucher by reference or ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const booking = await Booking.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { bookingReference: id }]
      });

      if (!booking) return res.status(404).json({ success: false, message: 'Booking voucher not found.' });

      // Ensure user owns this booking unless admin
      if (req.user.role !== 'admin' && booking.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this booking voucher.' });
      }

      return res.status(200).json({ success: true, data: booking });
    } else {
      const booking = memoryStore.bookings.find(b => b._id.toString() === id || b.bookingReference === id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking voucher not found.' });

      if (req.user.role !== 'admin' && booking.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this booking voucher.' });
      }

      return res.status(200).json({ success: true, data: booking });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const booking = await Booking.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { bookingReference: id }]
      });

      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      if (req.user.role !== 'admin' && booking.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
      }

      if (booking.bookingStatus === 'cancelled') {
        return res.status(400).json({ success: false, message: 'This booking is already cancelled.' });
      }

      booking.bookingStatus = 'cancelled';
      await booking.save();

      // Release seats back to showtime
      const showtime = await Showtime.findById(booking.showtimeId);
      if (showtime) {
        const releasedSeatNumbers = booking.seats.map(s => s.seatNumber);
        showtime.bookedSeats = showtime.bookedSeats.filter(s => !releasedSeatNumbers.includes(s));
        await showtime.save();
      }

      return res.status(200).json({ success: true, message: 'Booking successfully cancelled and seats released.', data: booking });
    } else {
      const booking = memoryStore.bookings.find(b => b._id.toString() === id || b.bookingReference === id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      if (req.user.role !== 'admin' && booking.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
      }

      if (booking.bookingStatus === 'cancelled') {
        return res.status(400).json({ success: false, message: 'This booking is already cancelled.' });
      }

      booking.bookingStatus = 'cancelled';

      const showtime = memoryStore.showtimes.find(s => s._id.toString() === booking.showtimeId.toString());
      if (showtime) {
        const releasedSeatNumbers = booking.seats.map(s => s.seatNumber);
        showtime.bookedSeats = showtime.bookedSeats.filter(s => !releasedSeatNumbers.includes(s));
      }

      return res.status(200).json({ success: true, message: 'Booking successfully cancelled and seats released.', data: booking });
    }
  } catch (error) {
    next(error);
  }
};
