const { checkAdmin, checkOwnerOpOrAdmin, checkOpOrAdmin, checkAuth } = require('../../utils/auth')
const { getUsers, getUserById, createUser, updateUserById, deleteUserById, getProfile, updateProfile, createBookingIntoUser, getBookingsFromUser, updateBookingIntoUser } = require('../controllers/user.controller')

const router = require('express').Router()

router.get('/', checkAuth, checkOpOrAdmin, getUsers)
router.get('/profile', checkAuth, getProfile)
router.get('/:id/booking', checkAuth, checkOwnerOpOrAdmin, getBookingsFromUser)
router.get('/:id', checkAuth, checkOwnerOpOrAdmin, getUserById)

router.post('/', checkAuth, checkOpOrAdmin, createUser)
router.post('/:id/booking', checkAuth, checkOwnerOpOrAdmin, createBookingIntoUser)

router.put('/profile', checkAuth, updateProfile)
router.put('/:id', checkAuth, checkAdmin, updateUserById)
router.put('/:id/booking/:bookingId', checkAuth, checkOwnerOpOrAdmin, updateBookingIntoUser)

router.delete('/:id', checkAuth, checkAdmin, deleteUserById)

exports.userRouter = router
