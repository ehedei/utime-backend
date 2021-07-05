const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment'
  }],
  specialty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'specialty'
  }
})

const doctorModel = mongoose.model('doctor', doctorSchema)
exports.DoctorModel = doctorModel
