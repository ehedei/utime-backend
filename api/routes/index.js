const { userRouter } = require('./user.router')

const router = require('express').Router()
const { bookingRouter } = require('./booking.router')
const { appointmentRouter } = require('./appointment.router')
const { doctorRouter } = require('./doctor.router')
const { specialtyRouter } = require('./specialty.router')

router
  .use('/user', userRouter)
  .use('/booking', bookingRouter)
  .use('/appointment', appointmentRouter)
  .use('/doctor', doctorRouter)
  .use('/specialty', specialtyRouter)

exports.router = router
