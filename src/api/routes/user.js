const { getAllUsers, register, login, putUserInfo, getUserByClassGroup, deleteUserById } = require('../controllers/user')

const usersRouter = require('express').Router()

usersRouter.get('/', getAllUsers)
usersRouter.get('/:id', getUserByClassGroup)
usersRouter.post('/register', register)
usersRouter.post('/login', login)
usersRouter.put('/:id', putUserInfo)
usersRouter.delete('/:id', deleteUserById)

module.exports = usersRouter