const express = require('express');
const router = express.Router();
const {
  getGroomers,
  getGroomerById,
  createBooking,
  getUserBookings,
  cancelBooking,
} = require('../controllers/groomingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getGroomers);
router.get('/bookings/my-bookings', authMiddleware, getUserBookings);
router.get('/:id', getGroomerById);
router.post('/bookings', authMiddleware, createBooking);
router.patch('/bookings/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;
