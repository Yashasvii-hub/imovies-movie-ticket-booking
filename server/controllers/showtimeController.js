const mongoose = require('mongoose');
const Showtime = require('../models/Showtime');
const Theater = require('../models/Theater');
const memoryStore = require('../config/memoryStore');

// Helper to clean expired seat locks (older than 8 minutes)
const cleanExpiredLocks = (showtime) => {
  const now = new Date().getTime();
  const LOCK_DURATION_MS = 8 * 60 * 1000;
  showtime.lockedSeats = (showtime.lockedSeats || []).filter(lock => {
    const lockTime = new Date(lock.lockedAt).getTime();
    return now - lockTime < LOCK_DURATION_MS;
  });
};

// @desc    Get showtimes filtered by movie, date, or theater
// @route   GET /api/showtimes
// @access  Public
exports.getShowtimes = async (req, res, next) => {
  try {
    const { movieId, date, theaterId } = req.query;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      let filter = {};
      if (movieId) filter.movieId = movieId;
      if (date) filter.date = date;
      if (theaterId) filter.theaterId = theaterId;

      const showtimes = await Showtime.find(filter)
        .populate('movieId', 'title posterUrl duration rating')
        .populate('theaterId', 'name location city screens');

      return res.status(200).json({ success: true, count: showtimes.length, data: showtimes });
    } else {
      let list = [...memoryStore.showtimes];
      if (movieId) list = list.filter(s => s.movieId.toString() === movieId.toString());
      if (date) list = list.filter(s => s.date === date);
      if (theaterId) list = list.filter(s => s.theaterId.toString() === theaterId.toString());

      // Clean expired locks and attach references
      list.forEach(cleanExpiredLocks);

      const populated = list.map(s => {
        const movie = memoryStore.movies.find(m => m._id.toString() === s.movieId.toString());
        const theater = memoryStore.theaters.find(t => t._id.toString() === s.theaterId.toString());
        return {
          ...s,
          movieId: movie || { _id: s.movieId, title: 'Selected Movie' },
          theaterId: theater || { _id: s.theaterId, name: 'Main Cineplex' }
        };
      });

      return res.status(200).json({ success: true, count: populated.length, data: populated });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single showtime with real-time seat status
// @route   GET /api/showtimes/:id
// @access  Public
exports.getShowtimeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const showtime = await Showtime.findById(id)
        .populate('movieId', 'title posterUrl duration rating genre')
        .populate('theaterId');

      if (!showtime) {
        return res.status(404).json({ success: false, message: 'Showtime not found.' });
      }

      cleanExpiredLocks(showtime);
      await showtime.save();

      return res.status(200).json({ success: true, data: showtime });
    } else {
      const showtime = memoryStore.showtimes.find(s => s._id.toString() === id.toString());
      if (!showtime) {
        return res.status(404).json({ success: false, message: 'Showtime not found.' });
      }

      cleanExpiredLocks(showtime);

      const movie = memoryStore.movies.find(m => m._id.toString() === showtime.movieId.toString());
      const theater = memoryStore.theaters.find(t => t._id.toString() === showtime.theaterId.toString());

      return res.status(200).json({
        success: true,
        data: {
          ...showtime,
          movieId: movie,
          theaterId: theater
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Lock seats temporarily during checkout (prevent double booking)
// @route   POST /api/showtimes/:id/lock-seats
// @access  Private
exports.lockSeats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { seats } = req.body; // array of seat identifiers: ['B3', 'B4']
    const userId = req.user._id || req.user.id;

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one seat to reserve.' });
    }

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const showtime = await Showtime.findById(id);
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });

      cleanExpiredLocks(showtime);

      // Check if any seat is already booked
      const alreadyBooked = seats.find(s => showtime.bookedSeats.includes(s));
      if (alreadyBooked) {
        return res.status(400).json({ success: false, message: `Seat ${alreadyBooked} has already been booked.` });
      }

      // Check if any seat is locked by someone else
      const lockedByOther = seats.find(s => {
        const lock = showtime.lockedSeats.find(l => l.seatNumber === s);
        return lock && lock.lockedBy.toString() !== userId.toString();
      });

      if (lockedByOther) {
        return res.status(409).json({ success: false, message: `Seat ${lockedByOther} is currently on hold by another customer. Please choose a different seat.` });
      }

      // Add locks
      seats.forEach(s => {
        const existingLock = showtime.lockedSeats.find(l => l.seatNumber === s);
        if (existingLock) {
          existingLock.lockedAt = new Date();
        } else {
          showtime.lockedSeats.push({ seatNumber: s, lockedBy: userId, lockedAt: new Date() });
        }
      });

      await showtime.save();
      return res.status(200).json({ success: true, message: 'Seats held successfully for checkout.', lockedSeats: seats });
    } else {
      const showtime = memoryStore.showtimes.find(s => s._id.toString() === id.toString());
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });

      cleanExpiredLocks(showtime);

      const alreadyBooked = seats.find(s => showtime.bookedSeats.includes(s));
      if (alreadyBooked) {
        return res.status(400).json({ success: false, message: `Seat ${alreadyBooked} has already been booked.` });
      }

      const lockedByOther = seats.find(s => {
        const lock = showtime.lockedSeats.find(l => l.seatNumber === s);
        return lock && lock.lockedBy.toString() !== userId.toString();
      });

      if (lockedByOther) {
        return res.status(409).json({ success: false, message: `Seat ${lockedByOther} is currently on hold by another customer.` });
      }

      seats.forEach(s => {
        const existingLock = showtime.lockedSeats.find(l => l.seatNumber === s);
        if (existingLock) {
          existingLock.lockedAt = new Date();
        } else {
          showtime.lockedSeats.push({ seatNumber: s, lockedBy: userId, lockedAt: new Date() });
        }
      });

      return res.status(200).json({ success: true, message: 'Seats held successfully for checkout.', lockedSeats: seats });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Release temporarily locked seats
// @route   POST /api/showtimes/:id/release-seats
// @access  Private
exports.releaseSeats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { seats } = req.body;
    const userId = req.user._id || req.user.id;

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const showtime = await Showtime.findById(id);
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });

      showtime.lockedSeats = showtime.lockedSeats.filter(l => {
        return !(seats.includes(l.seatNumber) && l.lockedBy.toString() === userId.toString());
      });

      await showtime.save();
      return res.status(200).json({ success: true, message: 'Seats released.' });
    } else {
      const showtime = memoryStore.showtimes.find(s => s._id.toString() === id.toString());
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });

      showtime.lockedSeats = showtime.lockedSeats.filter(l => {
        return !(seats.includes(l.seatNumber) && l.lockedBy.toString() === userId.toString());
      });

      return res.status(200).json({ success: true, message: 'Seats released.' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create showtime (Admin)
// @route   POST /api/showtimes
// @access  Private/Admin
exports.createShowtime = async (req, res, next) => {
  try {
    const { movieId, theaterId, date, time, format, pricing } = req.body;

    if (!movieId || !theaterId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Movie, theater, date, and time are required.' });
    }

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const showtime = await Showtime.create(req.body);
      return res.status(201).json({ success: true, message: 'Showtime created successfully.', data: showtime });
    } else {
      const newShowtime = {
        _id: '66a4' + Math.random().toString(16).substring(2, 22).padEnd(20, '0'),
        movieId,
        theaterId,
        screenNumber: 1,
        screenName: 'Screen 1 (Main Hall)',
        date,
        time,
        format: format || 'IMAX 3D',
        pricing: pricing || { standard: 250, premium: 350, vip: 500 },
        bookedSeats: [],
        lockedSeats: [],
        createdAt: new Date()
      };

      memoryStore.showtimes.push(newShowtime);
      return res.status(201).json({ success: true, message: 'Showtime created successfully.', data: newShowtime });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete showtime (Admin)
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
exports.deleteShowtime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const showtime = await Showtime.findByIdAndDelete(id);
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found.' });
      return res.status(200).json({ success: true, message: 'Showtime deleted.' });
    } else {
      const index = memoryStore.showtimes.findIndex(s => s._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'Showtime not found.' });
      memoryStore.showtimes.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Showtime deleted.' });
    }
  } catch (error) {
    next(error);
  }
};
