const { BookingModel } = require('../models/booking.model')
const { AppointmentModel } = require('../models/appointment.model')

exports.getAllAppointments = async (req, res) => {
  try {
    const allAppointments = await AppointmentModel.find()
    if (allAppointments) {
      res.status(200).json(allAppointments)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentById = await AppointmentModel.findById(req.params.id)
    if (appointmentById) {
      res.status(200).json(appointmentById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.postNewAppointment = async (req, res) => {
  try {
    const newAppointment = await AppointmentModel.create(req.body)
    res.status(200).json(newAppointment)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.putAppointmentById = async (req, res) => {
  try {
    const updateById = await AppointmentModel.findById(req.params.id)
    if (updateById) {
      updateById.start = req.body.start ?? updateById.start
      updateById.end = req.body.end ?? updateById.end
      updateById.booking = req.body.booking ?? updateById.booking
      updateById.doctor = req.body.doctor ?? updateById.doctor
      res.status(200).json(updateById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.deleteAppointmentById = async (req, res) => {
  try {
    const deleteById = await AppointmentModel.findById(req.params.id)
    if (deleteById) {
      if (deleteById.booking === null) {
        const deleteAppointment = await AppointmentModel.deleteById(req.params.id)
        res.status(200).json(deleteAppointment)
      } else {
        res.status().json({ msg: 'Appointment already assign, you can not delete it' })
      }
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}