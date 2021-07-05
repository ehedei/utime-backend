const bookingRouter = require('express').Router()

const {
  getAllBookings,
  getBookingById,
  postNewBooking,
  putBookingById,
  deleteBookingById
} = require('../controllers/booking.controller')

bookingRouter.get('/', getAllBookings)
bookingRouter.get('/:id', getBookingById)
bookingRouter.post('/', postNewBooking)
bookingRouter.put('/:id', putBookingById)
bookingRouter.delete('/:id', deleteBookingById)

exports.bookingRouter = bookingRouter
