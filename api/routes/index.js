const { userRouter } = require('./user.router')

const router = require('express').Router()

router
  .use('/user', userRouter)
//  .use('/auth')


exports.router = router
