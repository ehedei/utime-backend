const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment'
  },
  bookingDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['booked', 'finished', 'cancelled', 'no-show']
  }
})

const bookingModel = mongoose.model('booking', bookingSchema)
exports.BookingModel = bookingModel
