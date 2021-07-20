const { AppointmentModel } = require('../api/models/appointment.model')
const moment = require('moment')
const { http } = require('../httpserver')
const { BookingModel } = require('../api/models/booking.model')
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const rooms = {}

io.on('connection', async (socket) => {
  console.log(`User ${socket.decoded_token.username} connected. Id: ${socket.decoded_token.id}. Role: ${socket.decoded_token.role}`)

  socket.on('subscribe', async (doctorId) => {
    socket.join(doctorId)
    if (rooms[doctorId]) {
      rooms[doctorId].push(socket)
    } else {
      rooms[doctorId] = [socket]
    }

    const appointments = await AppointmentModel.find({
      doctor: doctorId,
      booking: { $ne: null },
      status: 'pending',
      start: {
        $gte: moment().startOf('day').toDate(),
        $lte: moment().endOf('day').toDate()
      }
    }).select({ booking: 0 }).sort('start')

    const activeAppointment = await AppointmentModel.findOne({
      doctor: doctorId,
      booking: { $ne: null },
      status: { $in: ['inside', 'no-show'] },
      start: {
        $gte: moment().startOf('day').toDate(),
        $lte: moment().endOf('day').toDate()
      }
    }).select({ booking: 0 }).sort('-start')

    io.to(socket.id).emit('update', doctorId, appointments, activeAppointment)
  })

  socket.on('check-in', async (actualAppointment, nextAppointment) => {
    const doctorId = nextAppointment.doctor

    await AppointmentModel
      .findByIdAndUpdate(nextAppointment._id, { status: 'finished' })

    const updatedAppointment = await AppointmentModel
      .findByIdAndUpdate(nextAppointment._id, { inAt: new Date(), status: 'inside' }, { new: true })
      .select({ booking: 0 })

    const appointments = await AppointmentModel.find({
      doctor: doctorId,
      booking: { $ne: null },
      inAt: null,
      status: 'pending',
      start: {
        $gte: moment().startOf('day').toDate(),
        $lte: moment().endOf('day').toDate()
      }
    }).select({ booking: 0 }).sort('start')

    io.to(doctorId).emit('update', doctorId, appointments, updatedAppointment)
  })

  socket.on('no-show', async (actualAppointment, nextAppointment) => {
    const doctorId = nextAppointment.doctor

    await AppointmentModel
      .findByIdAndUpdate(nextAppointment._id, { status: 'finished' })

    const updatedAppointment = await AppointmentModel
      .findByIdAndUpdate(nextAppointment._id, { inAt: new Date(), status: 'no-show' }, { new: true })
      .select({ booking: 0 })

    await BookingModel.findByIdAndUpdate(updatedAppointment.booking, { status: 'no-show' })

    const appointments = await AppointmentModel.find({
      doctor: doctorId,
      booking: { $ne: null },
      inAt: null,
      status: 'pending',
      start: {
        $gte: moment().startOf('day').toDate(),
        $lte: moment().endOf('day').toDate()
      }
    }).select({ booking: 0 }).sort('start')

    io.to(doctorId).emit('update', doctorId, appointments, updatedAppointment)
  })
})

exports.io = io
