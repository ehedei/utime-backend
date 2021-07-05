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
    const bookingById = await BookingModel.findById(req.params.id)
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
    const updateById = await BookingModel.findById(req.params.id)
    if (updateById) {
      updateById.user = req.body.user ?? updateById.user
      updateById.appointment = req.body.appointment ?? updateById.appointment
      updateById.bookingDate = req.body.bookingDate ?? updateById.bookingDate
      updateById.status = req.body.status ?? updateById.status
      res.status(200).json(updateById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.deleteBookingById = async (req, res) => {
  try {
    const deleteById = await BookingModel.findById(req.params.id)
    if (deleteById) {
      const deleteAppointmentRef = await AppointmentModel.findById(deleteById.appointment)
      if (deleteAppointmentRef) {
        deleteAppointmentRef.booking = null
        const deleteBooking = await BookingModel.deleteById(req.params.id)
        res.status(200).json(deleteBooking)
      }
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}