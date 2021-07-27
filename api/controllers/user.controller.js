const { UserModel } = require('../models/user.model')
const { AddressModel } = require('../models/address.model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { BookingModel } = require('../models/booking.model')
const { AppointmentModel } = require('../models/appointment.model')
const moment = require('moment')

// TODO Filter options, pagination and limit
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 })
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select({ password: 0 }).populate('address')
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.createUser = async (req, res) => {
  let session

  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const newUser = await prepareUserForCreation(req.body)

    if (newUser.address) {
      const address = await AddressModel.create([newUser.address], { session })
      newUser.address = address[0]
    }

    const user = await UserModel.create([newUser], { session })

    await session.commitTransaction()

    res.status(201).json(removePassFromUser(user[0]))
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  } finally {
    session?.endSession()
  }
}

exports.updateUserById = async (req, res) => {
  updateUser(req, res, req.params.id)
}

// TODO Test Bookings
exports.deleteUserById = async (req, res) => {
  let session

  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const user = await UserModel
      .findByIdAndDelete(req.params.id)
      .populate('address')
      .session(session)

    if (user) {
      if (user.address) {
        await user.address.remove({ session })
      }

      await BookingModel
        .updateMany({
          user: user._id
        }, { user: null }).session(session)

      await session.commitTransaction()
      res.status(200).json({ msg: 'User deleted' })
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  } finally {
    session?.endSession()
  }
}

exports.updateProfile = async (req, res) => {
  if (req.body.role || req.body._id) {
    res.status(403).json({ msg: 'Access not allowed ' })
  } else {
    updateUser(req, res, res.locals.user._id)
  }
}

const updateUser = async (req, res, id) => {
  let session
  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const updateData = Object.assign({}, req.body)
    delete updateData.address

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }

    const user = await UserModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('address')
      .session(session)

    if (user) {
      if (req.body.address) {
        for (const prop in req.body.address) {
          user.address[prop] = req.body.address[prop]
        }
        await user.address.save({ session })
      }
      await session.commitTransaction()
      res.status(200).json(removePassFromUser(user))
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  } finally {
    session?.endSession()
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.user.id).populate('address').select('-password')
    res.status(200).json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getBookingsFromUser = async (req, res) => {
  let match = {}

  if (req.query.start) {
    match = { start: { $gte: moment.utc(req.query.start, 'YYYY-MM-DD HH:mm:ss').toDate() } }
  }

  const query = {}

  query.user = req.params.id
  query.status = req.query.status

  try {
    const bookings = await BookingModel
      .find(query)
      .populate({
        path: 'appointment',
        match,
        populate: {
          path: 'doctor',
          model: 'doctor',
          populate: {
            path: 'specialties',
            model: 'specialty'
          }
        }
      })

    res.status(200).json(bookings.filter(el => el.appointment))
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getBookingFromUserById = async (req, res) => {
  const query = { _id: req.params.bookingId }

  if (res.locals.user.role === 'user') { query.user = req.params.id }

  try {
    const booking = await BookingModel
      .findOne(query)
      .populate({
        path: 'appointment',
        populate: {
          path: 'doctor',
          model: 'doctor',
          populate: {
            path: 'specialties',
            model: 'specialty'
          }
        }
      })
    if (booking) {
      res.status(200).json(booking)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.createBookingIntoUser = async (req, res, next) => {
  let session
  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const user = await UserModel
      .findById(req.params.id)
      .session(session)

    const appointment = await AppointmentModel.findById(req.body.appointment).session(session)

    if (user && appointment && appointment.booking === null && checkDates(req.body.date, appointment.start)) {
      req.body.user = user._id
      const booking = await BookingModel.create([req.body], { session })
      appointment.booking = booking[0]._id
      await appointment.save({ session })
      res.locals.appointment = appointment
      await session.commitTransaction()

      res.status(201).json(booking[0])
      next()
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  } finally {
    session?.endSession()
  }
}

exports.updateBookingIntoUser = async (req, res, next) => {
  let session
  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const booking = await BookingModel
      .findById(req.params.bookingId)
      .session(session)

    if (booking) {
      if (req.params.id === booking.user.toString() && req.body.status === 'cancelled' && booking.status === 'booked') {
        const appointment = await AppointmentModel
          .findByIdAndUpdate(booking.appointment, { booking: null }, { new: true })
          .session(session)

        booking.status = 'cancelled'
        booking.appointment = null
        await booking.save({ session })
        res.locals.appointment = appointment

        await session.commitTransaction()
        res.status(200).json(booking)
        next()
      } else {
        res.status(403).json({ msg: 'Access not allowed' })
      }
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  } finally {
    session?.endSession()
  }
}

const prepareUserForCreation = async (user) => {
  const newUser = {}
  newUser.email = user.email
  newUser.password = await bcrypt.hash(user.password, 10)
  newUser.username = user.username
  newUser.firstName = user.firstName
  newUser.lastName = user.lastName
  newUser.birthdate = user.birthdate
  newUser.phone = user.phone
  newUser.mobile = user.mobile
  newUser.address = user.address

  return newUser
}

const removePassFromUser = (user) => {
  const newUser = JSON.parse(JSON.stringify(user))
  delete newUser.password

  return newUser
}

function checkDates (todayString, startString) {
  const now = moment.utc(todayString, 'YYYY-MM-DD HH:mm:ss')
  const start = moment.utc(startString)

  return start.isAfter(now)
}

exports.prepareUserForCreation = prepareUserForCreation
exports.removePassFromUser = removePassFromUser
