const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { verifyAccessToken, verifyRefreshToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/register', UserController.register) // POST /register
router.post('/login', UserController.login) // POST /login
router.get('/get-current', verifyAccessToken, UserController.getCurrent)
router.post('/refresh-token', verifyRefreshToken, UserController.refreshAccessToken) // GET /refresh-token
router.post('/logout', UserController.logout)
router.get('/forgot-password', UserController.forgotPassword)
router.put('/reset-password', UserController.resetPassword)
router.get('/', verifyAccessToken, isAdmin, UserController.getAllUsers)
router.delete('/', verifyAccessToken, isAdmin, UserController.deleteUser)
router.put('/update-user', verifyAccessToken, UserController.updateUser)
router.put('/:_id', verifyAccessToken, isAdmin, UserController.updateUserByAdmin)

module.exports = router

//Create (POST) + PUT: body
//Get + DELETE: query
