const { DoctorModel } = require('../models/doctor.model')
const { SpecialtyModel } = require('../models/specialty.model')
const { AppointmentModel } = require('../models/appointment.model')
const moment = require('moment')
const moongose = require('mongoose')

exports.getAllDoctors = async (req, res) => {
  try {
    const allDoctors = await DoctorModel.find().populate('specialties').sort('name')
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

    if (req.body.specialties && specialties.length !== req.body.specialties.length) {
      req.status(409).json({ msg: 'Incorrect format request' })
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

exports.createAppointmentsIntoDoctor = async (req, res) => {
  const query = req.body
  query.doctor = req.params.id

  if (query.start && query.end && query.minutes && query.dates) {
    let session

    try {
      session = await moongose.startSession()
      session.startTransaction()

      const doctor = await DoctorModel.findById(query.doctor).session(session)

      if (doctor) {
        const dates = prepareDatesComprobation(query.dates, query.start, query.end)
        const finalQuery = { $and: [{ doctor: query.doctor }, dates] }
        const appointments = await AppointmentModel.find(finalQuery).session(session)

        if (appointments.length > 0) {
          res.status(409).json({ msg: 'Appointments already exist' })
        } else {
          const insertions = prepareMasiveInsertions(query)
          const newAppointments = await AppointmentModel.create(insertions, { session })
          await session.commitTransaction()
          res.status(201).json(newAppointments)
        }
      } else {
        res.status(404).json({ msg: 'Resource not found' })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: 'Error in server' })
    } finally {
      session?.endSession()
    }
  }
}

function prepareMasiveInsertions (query) {
  const insertions = []

  query.dates.forEach(date => {
    const startDate = moment(`${date} ${query.start}`, 'YYYY-MM-DD hh:mm:ss')
    const endDate = moment(`${date} ${query.end}`, 'YYYY-MM-DD hh:mm:ss')

    const index = moment.utc(startDate).add(query.minutes, 'minutes')

    while (endDate.isSameOrAfter(index)) {
      insertions.push({
        doctor: query.doctor,
        start: startDate.utc().toDate(),
        end: index.utc().toDate()
      })

      index.add(query.minutes, 'minutes')
      startDate.add(query.minutes, 'minutes')
    }
  })

  return insertions
}

function prepareDatesComprobation (dates, start, end) {
  const query = {}
  query.$or = dates.map(date => {
    const startDate = moment(`${date}T${start}Z`)
    const endDate = moment(`${date}T${end}Z`)

    return {
      $and: [
        { start: { $gte: startDate.format('YYYY-MM-DDTHH:mm:ss') } },
        { end: { $lte: endDate.format('YYYY-MM-DDTHH:mm:ss') } }
      ]
    }
  })

  return query
}
