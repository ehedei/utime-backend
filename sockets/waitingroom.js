const { AppointmentModel } = require('../api/models/appointment.model')
const moment = require('moment')

const waitingRoom = {
  async checkIn(actualAppointment, nextAppointment, updatedTime) {
    const doctorId = nextAppointment.doctor

    await AppointmentModel
      .findByIdAndUpdate(nextAppointment._id, { status: 'finished' })

    const updatedAppointment = await AppointmentModel
      .findByIdAndUpdate(nextAppointment._id, {
        inAt: moment.utc(updatedTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
        status: 'inside'
      }, { new: true })
      .select({ booking: 0 })

    const appointments = await AppointmentModel.find({
      doctor: doctorId,
      booking: { $ne: null },
      inAt: null,
      status: 'pending',
      start: {
        $gte: moment.utc().startOf('day').toDate(),
        $lte: moment.utc().endOf('day').toDate()
      }
    }).select({ booking: 0 }).sort('start')

    this.io.to(doctorId).emit('update', doctorId, appointments, updatedAppointment)
  }
}

exports.waitingRoom = waitingRoom
