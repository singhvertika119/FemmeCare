const Appointment = require('../models/Appointment');
const User = require('../models/User');

const seedDoctors = [
  { name: 'Sarah Jenkins', email: 'sarah@femmecare.com', password: 'password', specialty: 'Obstetrician/Gynecologist', bio: 'Expert in maternal-fetal medicine and high-risk pregnancies.', role: 'Doctor' },
  { name: 'Emily Chen', email: 'emily@femmecare.com', password: 'password', specialty: 'Gynecologist', bio: 'Specializes in minimally invasive surgery and preventive care.', role: 'Doctor' },
  { name: 'Aisha Patel', email: 'aisha@femmecare.com', password: 'password', specialty: 'Reproductive Endocrinologist', bio: 'Focused on fertility treatments and hormonal imbalances.', role: 'Doctor' }
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

module.exports = {
  getDoctors,
  bookAppointment,
  getMyAppointments
};
