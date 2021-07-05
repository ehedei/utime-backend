const router = require('express').Router()

router.post('/login')
router.post('/signup')

exports.authRouter = router
