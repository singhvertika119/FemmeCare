const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Stored strictly as YYYY-MM-DD
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  appointmentType: {
    type: String,
    enum: ['In-Person', 'Video Call'],
    default: 'In-Person'
  },
  videoLink: {
    type: String
  },
  reason: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
