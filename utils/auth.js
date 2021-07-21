const jwt = require('jsonwebtoken')
const { UserModel } = require('../api/models/user.model')

exports.checkAuth = async (req, res, next) => {
  try {
    const rawToken = req.headers.authorization.replace('Bearer ', '')

    const token = await jwt.verify(rawToken, process.env.TOKEN_SECRET)
    const user = await UserModel.findById(token.id)
    if (user) {
      res.locals.user = user
      next()
    } else {
      res.status(403).json({ msg: 'Token not valid' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error in Server' })
  }
}

exports.checkAdmin = (req, res, next) => {
  const user = res.locals.user
  if (user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ msg: 'Access not allowed' })
  }
}

exports.checkOwnerOrAdmin = (req, res, next) => {
  const user = res.locals.user
  if (user.role === 'admin' || user._id.toString() === req.params.id) {
    next()
  } else {
    res.status(403).json({ msg: 'Access not allowed' })
  }
}

exports.checkOpOrAdmin = (req, res, next) => {
  const user = res.locals.user
  if (user.role === 'admin' || user.role === 'op') {
    next()
  } else {
    res.status(403).json({ msg: 'Access not allowed' })
  }
}

exports.checkOwnerOpOrAdmin = (req, res, next) => {
  const user = res.locals.user
  if (user.role === 'admin' || user.role === 'op' || user._id.toString() === req.params.id) {
    next()
  } else {
    res.status(403).json({ msg: 'Access not allowed' })
  }
}
