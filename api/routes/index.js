const { userRouter } = require('./user.router')

const router = require('express').Router()
const { bookingRouter } = require('./booking.router')
const { appointmentRouter } = require('./appointment.router')
const { doctorRouter } = require('./doctor.router')
<<<<<<< HEAD
const { specialtyRouter } = require('./specialty.router')
=======
const { authRouter } = require('./auth.router')
>>>>>>> c25d6ee6242bd094bb709812447493a2a05f74e5

router
  .use('/auth', authRouter)
  .use('/user', userRouter)
  .use('/booking', bookingRouter)
  .use('/appointment', appointmentRouter)
  .use('/doctor', doctorRouter)
  .use('/specialty', specialtyRouter)

exports.router = router
