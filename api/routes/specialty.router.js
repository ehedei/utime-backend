const specialtyRouter = require('express').Router()

const { checkAuth, checkAdmin } = require('../../utils/auth')
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
specialtyRouter.post('/', checkAuth, checkAdmin, postNewSpecialty)
specialtyRouter.put('/:id', checkAuth, checkAdmin, putSpecialtyById)
specialtyRouter.delete('/:id', checkAuth, checkAdmin, deleteSpecialtyById)

exports.specialtyRouter = specialtyRouter
