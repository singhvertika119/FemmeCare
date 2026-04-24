const User = require('../models/User');

const Appointment = require('../models/Appointment');

// @desc    Securely synchronize operating hours onto the centralized Doctor structure
// @route   PUT /api/doctors/working-hours
// @access  Private (Doctor only)
const updateWorkingHours = async (req, res) => {
  const { startTime, endTime, slotDuration } = req.body;

  try {
    const doctor = await User.findById(req.user.id);
    
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ message: 'Routing identity error natively blocked execution.' });
    }

    const updatedDoctor = await User.findByIdAndUpdate(
      req.user.id,
      {
        workingHours: {
          start: startTime || doctor.workingHours.start,
          end: endTime || doctor.workingHours.end,
          slotDuration: slotDuration || doctor.workingHours.slotDuration
        }
      },
      { new: true }
    );
    
    res.status(200).json(updatedDoctor.workingHours);
  } catch (error) {
    console.error("Configuration bounds error", error);
    res.status(500).json({ message: 'Internal logic configuration failed mapping hours.' });
  }
};

// @desc    Extract relational Patient histories logically nested
// @route   GET /api/doctors/my-patients
// @access  Private (Doctor only)
const getMyPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .sort({ date: -1, timeSlot: -1 });

    const patientsMap = {};

    appointments.forEach(apt => {
      if (!apt.patient) return; 
      
      const patId = apt.patient._id.toString();
      
      if (!patientsMap[patId]) {
        patientsMap[patId] = {
          _id: apt.patient._id,
          name: apt.patient.name,
          email: apt.patient.email,
          appointments: []
        };
      }
      
      patientsMap[patId].appointments.push({
        _id: apt._id,
        date: apt.date,
        timeSlot: apt.timeSlot,
        status: apt.status,
        appointmentType: apt.appointmentType
      });
    });

    res.status(200).json(Object.values(patientsMap));
  } catch (error) {
    console.error("Error evaluating relationship bounds:", error);
    res.status(500).json({ message: 'Failed structuring complex arrays internally.' });
  }
};

module.exports = {
  updateWorkingHours,
  getMyPatients
};
