const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const http = require('http').Server(app)

const { router } = require('../api/routes')

app
  .use(morgan('dev'))
  .use(cors())
  .use(express.json())
  .use('/api', router)

exports.http = http
exports.app = app
