const express = require('express');
const router = express.Router();
const { getStats, getAllBookings } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/bookings', getAllBookings);

module.exports = router;
