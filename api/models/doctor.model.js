const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  /*
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment'
  }],
  */
  specialties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'specialty'
  }],
  available: {
    type: Boolean,
    required: [true, 'Available is required'],
    default: true

  }
})

const doctorModel = mongoose.model('doctor', doctorSchema)
exports.DoctorModel = doctorModel
