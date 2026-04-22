const Appointment = require('../models/Appointment');
const User = require('../models/User');

const seedDoctors = [
  { name: 'Sarah Jenkins', email: 'sarah@femmecare.com', password: 'password', specialty: 'Obstetrician/Gynecologist', bio: 'Expert in maternal-fetal medicine and high-risk pregnancies.', role: 'Doctor', phoneNumber: '555-102-1928', clinicAddress: '100 Medical Plaza, New York, NY', averageRating: 4.9, totalReviews: 124 },
  { name: 'Emily Chen', email: 'emily@femmecare.com', password: 'password', specialty: 'Gynecologist', bio: 'Specializes in minimally invasive surgery and preventive care.', role: 'Doctor', phoneNumber: '555-304-9812', clinicAddress: '240 Wellness Blvd, Los Angeles, CA', averageRating: 4.8, totalReviews: 89 },
  { name: 'Aisha Patel', email: 'aisha@femmecare.com', password: 'password', specialty: 'Reproductive Endocrinologist', bio: 'Focused on fertility treatments and hormonal imbalances.', role: 'Doctor', phoneNumber: '555-881-2290', clinicAddress: '78 Fertility Ave, Chicago, IL', averageRating: 5.0, totalReviews: 210 }
];

// @desc    Get all doctors (mocked with DB fallback)
// @route   GET /api/appointments/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    let doctors = await User.find({ role: 'Doctor' }).select('-password');
    if (doctors.length === 0) {
      for (const doc of seedDoctors) {
         try { await User.create(doc); } catch (e) {} // ignore duplicates
      }
      doctors = await User.find({ role: 'Doctor' }).select('-password');
    }
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get doctor's slots for a specific date
// @route   GET /api/appointments/doctors/:id/slots?date=YYYY-MM-DD
// @access  Private
const getDoctorSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query; // strict YYYY-MM-DD

  try {
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { start, end, slotDuration } = doctor.workingHours || { start: '09:00', end: '17:00', slotDuration: 30 };
    
    // Parse mathematical grid matrices
    const startParts = start.split(':');
    const endParts = end.split(':');
    
    let currentSlot = new Date(1970, 0, 1, parseInt(startParts[0]), parseInt(startParts[1]));
    const endTime = new Date(1970, 0, 1, parseInt(endParts[0]), parseInt(endParts[1]));

    const possibleSlots = [];
    while (currentSlot < endTime) {
      // Structure format string cleanly
      const timeString = currentSlot.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      possibleSlots.push(timeString);
      currentSlot = new Date(currentSlot.getTime() + slotDuration * 60000);
    }

    // Interrogate existing database footprint avoiding overlapping
    const existingAppointments = await Appointment.find({
      doctor: id,
      date,
      status: { $ne: 'Cancelled' }
    });

    const bookedSlotStrings = existingAppointments.map(app => app.timeSlot);

    // Merge validation matrix
    const slots = possibleSlots.map(time => ({
      time,
      isBooked: bookedSlotStrings.includes(time)
    }));

    res.json(slots);
  } catch (error) {
    console.error("Slot Mapping Error", error);
    res.status(500).json({ message: 'Server logic failed while computing slots' });
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, reason, appointmentType } = req.body;

  try {
    const type = appointmentType || 'In-Person';
    let videoLink = undefined;
    
    // For Mongoose Object IDs we can just generate a random string or wait for the ID
    // Since we don't have the _id yet, we use a random mock hash representing the meeting room
    if (type === 'Video Call') {
       const mockRoomHash = Math.random().toString(36).substring(2, 10);
       videoLink = `https://meet.femmecare.com/room/${mockRoomHash}`;
    }

    // Defensive collision rejection block
    const existingConflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $ne: 'Cancelled' }
    });

    if (existingConflict) {
      return res.status(400).json({ message: 'Apologies. This specific time slot was just booked by another patient.' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
      appointmentType: type,
      videoLink
    });
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Booking Error", error);
    res.status(500).json({ message: 'Error scheduling appointment' });
  }
};

// @desc    Get appointments for the logged-in user
// @route   GET /api/appointments/mine
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    // If patient, find where patient matches. If doctor, where doctor matches.
    const query = req.user.role === 'Patient' ? { patient: req.user.id } : { doctor: req.user.id };
    
    // We populate the doctor/patient name. (Mongoose errors out if ref ID is our mock 1,2,3, so we lean on the catch)
    let appointments = await Appointment.find(query).populate('doctor', 'name specialty').populate('patient', 'name');
    
    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.json([]); // Return empty for mock safety
  }
};

// @desc    Cancel an appointment safely
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (Patient only)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Validate ownership strictly
    if (appointment.patient.toString() !== req.user.id) {
       return res.status(401).json({ message: 'User not authorized to cancel this particular appointment.' });
    }

    appointment.status = 'Cancelled';
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Cancellation Error", error);
    res.status(500).json({ message: 'Critical error rendering cancellation.' });
  }
};

module.exports = {
  getDoctors,
  getDoctorSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment
};
