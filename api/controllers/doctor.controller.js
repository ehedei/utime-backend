const { AppointmentModel } = require('../models/appointment.model')
const { DoctorModel } = require('../models/doctor.model')

exports.getAllDoctors = async (req, res) => {
  try {
    const allDoctors = await DoctorModel.find()
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
    const newDoctor = await DoctorModel.create(req.body)
    res.status(200).json(newDoctor)
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

exports.deleteDoctorById = async (req, res) => {
  try {
    const deleteById = await DoctorModel.findByIdAndDelete(req.params.id)
    if (deleteById) {
      const deleteAppointmentRef = await AppointmentModel.findById(deleteById.appointment)
      if (deleteAppointmentRef) {
        deleteAppointmentRef.doctor = null
        await deleteAppointmentRef.save()
        res.status(200).json(deleteById)
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}
