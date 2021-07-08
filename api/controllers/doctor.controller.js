const { DoctorModel } = require('../models/doctor.model')
const { SpecialtyModel } = require('../models/specialty.model')

exports.getAllDoctors = async (req, res) => {
  try {
    const allDoctors = await DoctorModel.find().populate('specialties')
    if (allDoctors) {
      res.status(200).json(allDoctors)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getDoctorById = async (req, res) => {
  try {
    const doctorById = await DoctorModel.findById(req.params.id)
    if (doctorById) {
      res.status(200).json(doctorById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.postNewDoctor = async (req, res) => {
  try {
    let specialties = []
    if (req.body.specialties) {
      specialties = await SpecialtyModel.find({ _id: { $in: req.body.specialties } })
    }

    if (req.body.appointments || (req.body.specialties && specialties.length !== req.body.specialties.length)) {
      res.status(409).json()
    } else {
      req.body.specialties = specialties
      const newDoctor = await DoctorModel.create(req.body)

      const promises = specialties.map(el => {
        el.doctors.push(newDoctor._id)
        return el.save()
      })

      await Promise.all(promises)

      res.status(200).json(newDoctor)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.putDoctorById = async (req, res) => {
  try {
    const updateById = await DoctorModel.findById(req.params.id)
    if (updateById) {
      updateById.name = req.body.name ?? updateById.name
      updateById.available = (req.body.available === true)
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
