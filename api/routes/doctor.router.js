const doctorRouter = require('express').Router()

const { checkAuth, checkAdmin, checkOpOrAdmin } = require('../../utils/auth')
const {
  getAllDoctors,
  getDoctorById,
  postNewDoctor,
  putDoctorById,
  createAppointmentsIntoDoctor
} = require('../controllers/doctor.controller')

doctorRouter.get('/', getAllDoctors)
doctorRouter.get('/:id', getDoctorById)
doctorRouter.post('/', checkAuth, checkAdmin, postNewDoctor)
doctorRouter.post('/:id/appointment', checkAuth, checkOpOrAdmin, createAppointmentsIntoDoctor)
doctorRouter.put('/:id', checkAuth, checkAdmin, putDoctorById)

exports.doctorRouter = doctorRouter
