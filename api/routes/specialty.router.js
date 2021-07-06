const specialtyRouter = require('express').Router()

const {
  getAllSpecialties,
  getSpecialtyById,
  getAllDoctorsInSpecialty,
  postNewSpecialty,
  putSpecialtyById,
  deleteSpecialtyById
} = require('../controllers/specialty.controller')

specialtyRouter.get('/', getAllSpecialties)
specialtyRouter.get('/:id', getSpecialtyById)
specialtyRouter.get('/:id/doctor', getAllDoctorsInSpecialty)
specialtyRouter.post('/', postNewSpecialty)
specialtyRouter.put('/:id', putSpecialtyById)
specialtyRouter.delete('/:id', deleteSpecialtyById)

exports.specialtyRouter = specialtyRouter