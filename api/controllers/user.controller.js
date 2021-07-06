const { UserModel } = require('../models/user.model')
const { AddressModel } = require('../models/address.model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { BookingModel } = require('../models/booking.model')

// TODO Filter opctions, pagination and limit
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in server' })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (user) {
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
    let session
    try {
      session = await mongoose.startSession()
      session.startTransaction()

      const updateData = Object.assign({}, req.body)
      delete updateData.address

      const user = await UserModel
        .findByIdAndUpdate(req.params.id, updateData, { new: true })
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
}

// TODO Cascade
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
