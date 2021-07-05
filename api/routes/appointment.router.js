const appointmentRouter = require('express').Router()

const {
  getAllAppointments,
  getAppointmentById,
  postNewAppointment,
  putAppointmentById,
  deleteAppointmentById
} = require('../controllers/appointment.controller')

appointmentRouter.get('/', getAllAppointments)
appointmentRouter.get('/:id', getAppointmentById)
appointmentRouter.post('/', postNewAppointment)
appointmentRouter.put('/:id', putAppointmentById)
appointmentRouter.delete('/:id', deleteAppointmentById)

exports.appointmentRouter = appointmentRouter
