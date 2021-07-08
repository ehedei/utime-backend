const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment',
    default: null
  },
  bookingDate: {
    type: Date,
    default: new Date()
  },
  status: {
    type: String,
    enum: ['booked', 'finished', 'cancelled', 'no-show'],
    default: 'booked'
  }
})

const bookingModel = mongoose.model('booking', bookingSchema)
exports.BookingModel = bookingModel
