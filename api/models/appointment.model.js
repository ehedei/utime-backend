const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: [true, 'Start date is required']
  },
  end: {
    type: Date,
    required: [true, 'End date is required']
  },
  inAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'no-show', 'finished', 'inside'],
    default: 'pending'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    default: null
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor',
    required: [true, 'Doctor is required']
  }
})

const appointmentModel = mongoose.model('appointment', appointmentSchema)
exports.AppointmentModel = appointmentModel
