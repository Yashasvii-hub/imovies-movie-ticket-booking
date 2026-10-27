const express = require('express');
const router = express.Router();
const {
  getShowtimes,
  getShowtimeById,
  lockSeats,
  releaseSeats,
  createShowtime,
  deleteShowtime
} = require('../controllers/showtimeController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getShowtimes)
  .post(protect, authorize('admin'), createShowtime);

router.route('/:id')
  .get(getShowtimeById)
  .delete(protect, authorize('admin'), deleteShowtime);

router.post('/:id/lock-seats', protect, lockSeats);
router.post('/:id/release-seats', protect, releaseSeats);

module.exports = router;
