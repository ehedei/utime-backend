const doctorRouter = require('express').Router()

const { checkAuth, checkAdmin } = require('../../utils/auth')
const {
  getAllDoctors,
  getDoctorById,
  postNewDoctor,
  putDoctorById,
  deleteDoctorById
} = require('../controllers/doctor.controller')

doctorRouter.get('/', getAllDoctors)
doctorRouter.get('/:id', getDoctorById)
doctorRouter.post('/', checkAuth, checkAdmin, postNewDoctor)
doctorRouter.put('/:id', checkAuth, checkAdmin, putDoctorById)
doctorRouter.delete('/:id', checkAuth, checkAdmin, deleteDoctorById)

exports.doctorRouter = doctorRouter
