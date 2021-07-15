const bookingRouter = require('express').Router()

const { checkAuth, checkOpOrAdmin } = require('../../utils/auth')
const {
  getAllBookings,
  getBookingById,
  postNewBooking,
  putBookingById
} = require('../controllers/booking.controller')

bookingRouter.get('/', checkAuth, checkOpOrAdmin, getAllBookings)
bookingRouter.get('/:bookingId', checkAuth, checkOpOrAdmin, getBookingById)
bookingRouter.post('/', checkAuth, checkOpOrAdmin, postNewBooking)
bookingRouter.put('/:bookingId', checkAuth, checkOpOrAdmin, putBookingById)

exports.bookingRouter = bookingRouter
