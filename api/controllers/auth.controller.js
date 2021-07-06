const { UserModel } = require("../models/user.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
  const email = req.body.email
  const pass = req.body.password

  try {
    const user = await UserModel.findOne({ email: email })
    if (user) {
      const result = await bcrypt.compare(pass, user.password)
      if (result) {
        res.status(201).json(generateToken(user))
      } else {
        res.status(401).json({ msg: 'User and password does not match' })
      }
    } else {
      res.status(401).json({ msg: 'User and password does not match' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in Server' })
  }
}

function generateToken(user) {
  const userData = { email: user.email, id: user._id, username: user.username }
  const token = jwt.sign(userData,
    process.env.TOKEN_SECRET,
    { expiresIn: '1h' }
  )
  return { token: token, ...userData }
}