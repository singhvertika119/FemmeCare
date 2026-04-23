const Review = require('../models/Review');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Create a new Review strictly validating completed appointments
// @route   POST /api/doctors/:doctorId/reviews
// @access  Private (Patient only)
const createReview = async (req, res) => {
  const { doctorId } = req.params;
  const { rating, comment } = req.body;
  const patientId = req.user.id;

  try {
    // Phase 1: Security Validation
    // Users can solely drop reviews if they maintain physical completion interactions
    const validAppointment = await Appointment.findOne({
      doctor: doctorId,
      patient: patientId,
      status: 'Completed'
    });

    if (!validAppointment) {
      return res.status(403).json({ message: 'Action Forbidden: You must have a completed appointment with this provider to submit verified feedback.' });
    }

    // Phase 2: Instantiating the payload database log
    const review = await Review.create({
      doctorId,
      patientId,
      rating: Number(rating),
      comment
    });

    // Phase 3: Synchronized Aggregation Pipeline
    // Calculate global mathematical constraints strictly natively inside MongoDB
    const reviews = await Review.find({ doctorId });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews;

    // Mutate the parent structure actively
    await User.findByIdAndUpdate(doctorId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews
    });

    res.status(201).json({ message: 'Feedback authenticated and successfully mapped.', review });
  } catch (error) {
    console.error("Aggregation Pipeline Error", error);
    res.status(500).json({ message: 'Server logic failed allocating your review.' });
  }
};

// @desc    Extrapolate all associated Reviews mapped strictly against a single Doctor
// @route   GET /api/doctors/:doctorId/reviews
// @access  Public
const getDoctorReviews = async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Populate the patient to display standard alias footprints securely (e.g., 'Sarah J.')
    const reviews = await Review.find({ doctorId })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to access remote document dependencies.' });
  }
};

module.exports = {
  createReview,
  getDoctorReviews
};
