const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email field is required'],
    unique: [true, 'Email field must be unique'],
    match: [ // TODO I don't like the regex
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Error: Wrong email format.'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  username: {
    type: String,
    required: [true, 'Username field is required'],
    unique: [true, 'User already exists in Application']
  },
  firstName: String,
  lastName: String,
  birthdate: {
    type: Date
  },
  phone: {
    type: String
    // TODO match telephone
  },
  mobile: {
    type: String
    // TODO match telephone
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'doc', 'op', 'user'],
    default: 'user',
    required: ['true', 'Every user must have a role']
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address'
  }
})

exports.UserModel = mongoose.model('user', userSchema)
