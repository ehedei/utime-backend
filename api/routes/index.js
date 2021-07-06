const { userRouter } = require('./user.router')

const router = require('express').Router()
const { bookingRouter } = require('./booking.router')
const { appointmentRouter } = require('./appointment.router')
const { doctorRouter } = require('./doctor.router')
const { authRouter } = require('./auth.router')

router
  .use('/auth', authRouter)
  .use('/user', userRouter)
  .use('/booking', bookingRouter)
  .use('/appointment', appointmentRouter)
  .use('/doctor', doctorRouter)

exports.router = router
