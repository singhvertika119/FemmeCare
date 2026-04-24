const express = require('express');
const router = express.Router();
const { createReview, getDoctorReviews } = require('../controllers/reviewController');
const { updateWorkingHours, getMyPatients } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Secure Route updating Doctor operational characteristics specifically
router.put('/working-hours', protect, authorize('Doctor'), updateWorkingHours);
router.get('/my-patients', protect, authorize('Doctor'), getMyPatients);

// Extracted Domain routing for Medical Professionals parameters
router.post('/:doctorId/reviews', protect, authorize('Patient'), createReview);
router.get('/:doctorId/reviews', getDoctorReviews);

module.exports = router;
