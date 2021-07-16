process.stdout.write('\x1Bc')

require('dotenv').config()
const { http } = require('./httpserver')
const mongoose = require('mongoose')
const socketIOjwt = require('socketio-jwt')
const { io } = require('./sockets')

mongoose.connect(
  process.env.MONGO_URL || 'mongodb://localhost:27017/',
  {
    dbName: process.env.MONGO_DB || 'UTime',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  (err) => {
    if (err) {
      console.log(`DB Error: ${err}`)
    } else {
      console.log('Connected to MongoDB')

      http.listen(process.env.PORT, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.info('\n\n' + '='.repeat(40))
          console.info('💻  UTime')
          console.info(`📡  URL: ${process.env.URL}:${process.env.PORT}`)
          console.info('='.repeat(40) + '\n\n')
        }
      })
      io.use(socketIOjwt.authorize(
        {
          secret: process.env.TOKEN_SECRET,
          handshake: true,
          timeout: 15000
        }
      ))
    }
  }
)
