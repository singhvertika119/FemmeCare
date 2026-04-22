const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorSlots, bookAppointment, getMyAppointments, cancelAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/doctors', getDoctors);
router.get('/doctors/:id/slots', protect, getDoctorSlots);
router.post('/', protect, authorize('Patient'), bookAppointment);
router.get('/mine', protect, getMyAppointments);
router.patch('/:id/cancel', protect, authorize('Patient'), cancelAppointment);

module.exports = router;
