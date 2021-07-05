const { UserModel } = require("../models/user.model")
const { AddressModel } = require("../models/address.model")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


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
    if(user) {
      res.status(200).json(removePassFrom(user))
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

    if(newUser.address) {
      const address = await AddressModel.create([newUser.address], { session: session })
      newUser.address = address[0]
    }

    const user = await UserModel.create([newUser], { session: session })

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
  let session
  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const address = req.body.address
    delete req.body.address

    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).session(session)

    if(user) {
      const newUser = removePassFromUser(user)

      if(address) {
        const address = await AddressModel.findByIdAndUpdate(user.address, { new: true }).session(session)
        newUser.addres = address
      }
      res.status(200).json(newUser)
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

// TODO Cascade
exports.deleteUserById = async (req, res) => {
  let session

  try {
    session = await mongoose.startSession()
    session.startTransaction()

    const user = UserModel.findByIdAndDelete(req.params.id).session(session)
    if(user) {
      if(user.address) {
        await user.address.remove().session()
      }

      res.status(200).json({ msg: "User deleted" })
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

async function prepareUserForCreation(user) {
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



function removePassFromUser (user) {
  const newUser = JSON.parse(JSON.stringify(user))
  delete newUser.password
  return newUser
}
