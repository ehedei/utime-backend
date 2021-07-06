const mongoose = require('mongoose')

const specialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor'
  }]
})

const specialtyModel = mongoose.model('specialty', specialtySchema)
exports.SpecialtyModel = specialtyModel
