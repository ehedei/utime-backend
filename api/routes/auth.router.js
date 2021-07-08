const { login } = require('../controllers/auth.controller')
const { createUser } = require('../controllers/user.controller')

const router = require('express').Router()

router.post('/login', login)
router.post('/signup', createUser)

exports.authRouter = router
