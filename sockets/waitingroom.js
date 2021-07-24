const { AppointmentModel } = require('../api/models/appointment.model')
const { BookingModel } = require('../api/models/booking.model')
const moment = require('moment')

exports.changeStatus = async (io, socket, { doctorId, actualAppointment, nextAppointment, updatedTime, status }) => {
  try {
    if (actualAppointment) {
      if (actualAppointment.status === 'no-show') {
        await BookingModel.findByIdAndUpdate(actualAppointment.booking, { status: 'no-show' })
      } else {
        await AppointmentModel
          .findByIdAndUpdate(actualAppointment._id, { status: 'finished' })
        await BookingModel.findByIdAndUpdate(actualAppointment.booking, { status: 'finished' })
      }
    }

    const updatedAppointment = await AppointmentModel
      .findByIdAndUpdate(nextAppointment._id, {
        inAt: moment.utc(updatedTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
        status
      }, { new: true })
      .select({ booking: 0 })

    const appointments = await getAppointments(doctorId)

    io.to(doctorId).emit('update', doctorId, appointments, updatedAppointment)
  } catch (error) {
    console.log(error)
    io.to(socket.id).emit('error-on-update', doctorId)
  }
}

exports.connectToDoctorRoom = async (io, socket, doctorId) => {
  try {
    socket.join(doctorId)

    const appointments = await getAppointments(doctorId)

    const activeAppointment = await getActiveAppointment(doctorId)

    io.to(socket.id).emit('update', doctorId, appointments, activeAppointment)
  } catch (error) {
    console.log(error)
    io.to(socket.id).emit('error-on-connect')
  }
}

const getAppointments = async (doctorId) => {
  return await AppointmentModel.find({
    doctor: doctorId,
    booking: { $ne: null },
    inAt: null,
    status: 'pending',
    start: {
      $gte: moment.utc().startOf('day').toDate(),
      $lte: moment.utc().endOf('day').toDate()
    }
  }).select({ booking: 0 }).sort('start')
}

const getActiveAppointment = async (doctorId) => {
  return await AppointmentModel.findOne({
    doctor: doctorId,
    booking: { $ne: null },
    status: { $in: ['inside', 'no-show'] },
    start: {
      $gte: moment.utc().startOf('day').toDate(),
      $lte: moment.utc().endOf('day').toDate()
    }
  }).select({ booking: 0 }).sort('-start')
}

exports.getActiveAppointment = getActiveAppointment
exports.getAppointments = getAppointments
