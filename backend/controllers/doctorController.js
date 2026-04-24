const User = require('../models/User');

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

module.exports = {
  updateWorkingHours
};
