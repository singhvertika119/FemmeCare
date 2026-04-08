const express = require('express');
const router = express.Router();
const { getDoctors, bookAppointment, getMyAppointments } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/doctors', getDoctors);
router.post('/', protect, authorize('Patient'), bookAppointment);
router.get('/mine', protect, getMyAppointments);

module.exports = router;
