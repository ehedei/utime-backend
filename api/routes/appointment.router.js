const appointmentRouter = require('express').Router()

const { checkAuth, checkOpOrAdmin } = require('../../utils/auth')
const {
  getAllAppointments,
  getAppointmentById,
  postNewAppointment,
  putAppointmentById,
  deleteAppointmentById
} = require('../controllers/appointment.controller')

appointmentRouter.get('/', checkAuth, getAllAppointments)
appointmentRouter.get('/:id', checkAuth, checkOpOrAdmin, getAppointmentById)
appointmentRouter.post('/', checkAuth, checkOpOrAdmin, postNewAppointment)
appointmentRouter.put('/:id', checkAuth, checkOpOrAdmin, putAppointmentById)
appointmentRouter.delete('/:id', checkAuth, checkOpOrAdmin, deleteAppointmentById)

exports.appointmentRouter = appointmentRouter
