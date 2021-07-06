const { UserModel } = require('../models/user.model')
const { AddressModel } = require('../models/address.model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { BookingModel } = require('../models/booking.model')
const { AppointmentModel } = require('../models/appointment.model')

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
    const user = await UserModel.findById(req.params.id, { password: 0 })
    if (user) {
      console.log(user)
      res.status(200).json(removePassFromUser(user))
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

    res.status(201).json(removePassFromUser(user))
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  } finally {
    session?.endSession()
  }
}

exports.updateUserById = async (req, res) => {
  if (req.body.bookings) {
    res.status(409).json({ msg: 'Bad request' })
  } else {
    updateUser(req, res, req.params.id)
  }
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
          _id: {
            $in: user.bookings
          }
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
  if (res.body.bookings || res.body.role || res.body._id) {
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
        user.address.save({ session })
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

// TODO Test when auth ready
exports.getProfile = async (req, res) => {
  const user = await UserModel.findById(res.locals.user.id).populate('address')

  delete user.password
  delete user.bookings

  res.status.json(user)
}

exports.getBookingsFromUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate('bookings')
    if (user) {
      res.status(200).json(user.bookings)
    } else {
      res.status(404).json({ msg: 'Resource not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.createBookingIntoUser = async (req, res) => {
  let session
  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const user = await UserModel
      .findById(req.params.id)
      .session(session)

    if (user) {
      const booking = await BookingModel.create(req.body, { session })
      user.bookings.push(booking)
      user.save({ session })

      session.commitTransaction()
      res.status(201).json(booking)
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

exports.updateBookingIntoUser = async (req, res) => {
  let session
  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const booking = await BookingModel
      .findById(req.params.bookingId)
      .session(session)

    if (booking) {
      if (req.params.id === booking.user.toString()) {
        if (req.body.status === 'cancelled') {
          booking.status = 'cancelled'
          await AppointmentModel
            .findByIdAndUpdate(booking.appointment, { booking: null }, { new: true })
            .session(session)
          booking.save({ session })
        }
        session.commitTransaction()
        res.status(200).json(booking)
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

exports.prepareUserForCreation = prepareUserForCreation
exports.removePassFromUser = removePassFromUser
