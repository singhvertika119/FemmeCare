const express = require('express');
const router = express.Router();
const { createReview, getDoctorReviews } = require('../controllers/reviewController');
const { updateWorkingHours } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Secure Route updating Doctor operational characteristics specifically
router.put('/working-hours', protect, authorize('Doctor'), updateWorkingHours);

// Extracted Domain routing for Medical Professionals parameters
router.post('/:doctorId/reviews', protect, authorize('Patient'), createReview);
router.get('/:doctorId/reviews', getDoctorReviews);

module.exports = router;
