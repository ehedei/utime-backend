const { BookingModel } = require('../models/booking.model')
const { AppointmentModel } = require('../models/appointment.model')

exports.getAllBookings = async (req, res) => {
  try {
    const allBooking = await BookingModel.find()
    if (allBooking) {
      res.status(200).json(allBooking)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getBookingById = async (req, res) => {
  try {
    const bookingById = await BookingModel.findById(req.params.bookingId).populate({
      path: 'appointment',
      populate: {
        path: 'doctor',
        model: 'doctor',
        populate: {
          path: 'specialties',
          model: 'specialty'
        }
      }
    }).populate('user', '-password')
    if (bookingById) {
      res.status(200).json(bookingById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.postNewBooking = async (req, res) => {
  try {
    const newBooking = await BookingModel.create(req.body)
    res.status(200).json(newBooking)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.putBookingById = async (req, res) => {
  try {
    const updateById = await BookingModel.findById(req.params.bookingId)
    if (updateById) {
      if (req.body.appointment) {
        await AppointmentModel.findByIdAndUpdate(updateById.appointment, { booking: null })
        updateById.appointment = req.body.appointment
      }
      updateById.status = req.body.status ?? updateById.status

      updateById.save()
      res.status(200).json(updateById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}
