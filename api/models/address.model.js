const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  direction: {
    type: String,
    required: [true, 'Direction is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: String,
  country: String
})

exports.AddressModel = mongoose.model('address', addressSchema)
