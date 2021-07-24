const waitingRoom = require('../../sockets/waitingroom')
const moment = require('moment')

const sendUpdateToDoctorQueue = async (req, res) => {
  const io = req.app.get('socketIo')
  const doctorId = res.locals.appointment.doctor.toString()
  console.log(doctorId)

  const appointments = await waitingRoom.getAppointments(doctorId)
  const activeAppointment = await waitingRoom.getActiveAppointment(doctorId)

  io.to(doctorId).emit('update', doctorId, appointments, activeAppointment)
}

exports.sendUpdateToQueue = (req, res) => {
  const today = moment.utc().format('YYYY-MM-DD')
  const start = moment.utc(res.locals.appointment.start).format('YYYY-MM-DD')
  if (today === start) {
    sendUpdateToDoctorQueue(req, res)
  }
}
