process.stdout.write('\x1Bc')

require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const { app, http } = require('./httpserver')
const { io } = require('./sockets')
const socketIOjwt = require('socketio-jwt')

const { router } = require('./api/routes')

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

      app
        .use(morgan('dev'))
        .use(cors())
        .use(express.json())
        .use('/api', router)

      io.use(socketIOjwt.authorize(
        {
          secret: process.env.TOKEN_SECRET,
          handshake: true,
          timeout: 15000
        }
      ))

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
    }
  }
)
