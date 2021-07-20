const { AppointmentModel } = require('../models/appointment.model')
const moment = require('moment')

exports.getAllAppointments = async (req, res) => {
  const query = prepareSearchQuery(req.query)
  try {
    const allAppointments = await AppointmentModel.find(query).sort({ start: 'asc' })
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
      if (updateById.booking === null) {
        updateById.start = req.body.start ?? updateById.start
        updateById.end = req.body.end ?? updateById.end
      }
      updateById.doctor = req.body.doctor ?? updateById.doctor
      await updateById.save()

      res.status(200).json(updateById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

// TODO ln 71 probar $pull
exports.deleteAppointmentById = async (req, res) => {
  try {
    const findAppointmentById = await AppointmentModel.findById(req.params.id)
    if (findAppointmentById) {
      if (findAppointmentById.booking === null) {
        const deleteAppointment = await AppointmentModel.findByIdAndDelete(req.params.id)
        // await DoctorModel.findByIdAndUpdate(findAppointmentById.doctor, { $pull: { appointments: req.params.id } })
        res.status(200).json(deleteAppointment)
      } else {
        res.status(403).json({ msg: 'Appointment already assign, you can not delete it' })
      }
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

function prepareSearchQuery(query) {
  const newQuery = {}

  if (query.booking === 'null') {
    newQuery.booking = null
  }

  if (query.doctor) {
    newQuery.doctor = query.doctor
  }

  if (query.start) {
    const startDate = moment(query.start, 'YYYY-MM-DD hh:mm:ss').toDate()
    if (!newQuery.start) {
      newQuery.start = {}
    }
    newQuery.start.$gte = startDate
  }

  if (query.end) {
    const endDate = moment(query.end, 'YYYY-MM-DD hh:mm:ss').toDate()
    if (!newQuery.start) {
      newQuery.start = {}
    }
    newQuery.start.$lte = endDate
  }

  return newQuery
}
