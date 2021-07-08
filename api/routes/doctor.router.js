const doctorRouter = require('express').Router()

const { checkAuth, checkAdmin } = require('../../utils/auth')
const {
  getAllDoctors,
  getDoctorById,
  postNewDoctor,
  putDoctorById,
} = require('../controllers/doctor.controller')

doctorRouter.get('/', getAllDoctors)
doctorRouter.get('/:id', getDoctorById)
doctorRouter.post('/', checkAuth, checkAdmin, postNewDoctor)
doctorRouter.put('/:id', checkAuth, checkAdmin, putDoctorById)

exports.doctorRouter = doctorRouter
