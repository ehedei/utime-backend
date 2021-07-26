const { http, app } = require('../httpserver')

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

app.set('socketIo', io)

const waitingRoom = require('./waitingroom')

io.on('connection', async (socket) => {
  socket.on('subscribe', async (doctorId) => await waitingRoom.connectToDoctorRoom(io, socket, doctorId))

  socket.on('change-status', async data => {
    if (socket.decoded_token.role !== 'user') {
      await waitingRoom.changeStatus(io, socket, data)
    } else {
      io.to(socket.id).emit('not-allowed')
    }
  })
})

exports.io = io
