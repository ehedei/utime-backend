const { getUsers, getUserById, createUser, updateUserById, deleteUserById } = require('../controllers/user.controller')

const router = require('express').Router()

router.get('/', getUsers)
router.get('/:id', getUserById)

router.post('/', createUser)

router.put('/:id', updateUserById)

router.delete('/:id', deleteUserById)

exports.userRouter = router
