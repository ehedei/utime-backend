const bookingRouter = require('express').Router()

const {
  getAllBookings,
  getBookingById,
  postNewBooking,
  putBookingById
} = require('../controllers/booking.controller')

bookingRouter.get('/', getAllBookings)
bookingRouter.get('/:id', getBookingById)
bookingRouter.post('/', postNewBooking)
bookingRouter.put('/:id', putBookingById)

exports.bookingRouter = bookingRouter
