const doctorRouter = require('express').Router()

const {
  getAllDoctors,
  getDoctorById,
  postNewDoctor,
  putDoctorById,
  deleteDoctorById
} = require('../controllers/doctor.controller')

doctorRouter.get('/', getAllDoctors)
doctorRouter.get('/:id', getDoctorById)
doctorRouter.post('/', postNewDoctor)
doctorRouter.put('/:id', putDoctorById)
doctorRouter.delete('/:id', deleteDoctorById)

exports.doctorRouter = doctorRouter
