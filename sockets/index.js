const { http } = require('../httpserver')
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
})

const sockets = []

io.on('connection', async (socket) => {
  console.log(`User ${socket.decoded_token.username} connected. Id: ${socket.decoded_token.id}. Role: ${socket.decoded_token.role}`)
})

exports.io = io
