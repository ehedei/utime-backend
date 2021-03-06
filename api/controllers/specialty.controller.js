const { SpecialtyModel } = require('../models/specialty.model')
const { DoctorModel } = require('../models/doctor.model')

exports.getAllSpecialties = async (req, res) => {
  try {
    const allSpecialties = await SpecialtyModel.find(req.query)
    if (allSpecialties) {
      res.status(200).json(allSpecialties)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getSpecialtyById = async (req, res) => {
  try {
    const specialtyById = await SpecialtyModel.findById(req.params.id).populate('doctors')
    if (specialtyById) {
      res.status(200).json(specialtyById)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getAllDoctorsInSpecialty = async (req, res) => {
  try {
    const specialtyById = await SpecialtyModel.findById(req.params.id).populate('doctors')
    if (specialtyById) {
      res.status(200).json(specialtyById.doctors)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.postNewSpecialty = async (req, res) => {
  try {
    const newSpecialty = await SpecialtyModel.create(req.body)
    res.status(200).json(newSpecialty)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.putSpecialtyById = async (req, res) => {
  try {
    const updateById = await SpecialtyModel.findById(req.params.id)
    if (updateById) {
      updateById.name = req.body.name ?? updateById.name
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

exports.deleteSpecialtyById = async (req, res) => {
  try {
    const deleteById = await SpecialtyModel.findByIdAndDelete(req.params.id)
    if (deleteById) {
      DoctorModel.updateMany({
        _id: {
          $in: deleteById.doctors
        }
      }, { $pull: { specialties: req.params.id } })

      res.status(200).json({ msg: 'Specialty deleted' })
    } else {
      res.status(404).json({ msg: 'Resource not founded ' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}
