const express = require('express');
const router = express.Router();
const { createReview, getDoctorReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:doctorId/reviews', protect, authorize('Patient'), createReview);
router.get('/:doctorId/reviews', getDoctorReviews);

module.exports = router;
