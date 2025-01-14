const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { verifyAccessToken, verifyRefreshToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/register', UserController.register) // POST /register
router.post('/mock', UserController.createUsers)
router.get('/active-account/:token', UserController.activateAccount) // POST /activate-account
router.post('/login', UserController.login) // POST /login
router.get('/get-current', verifyAccessToken, UserController.getCurrent)
router.post('/refresh-token', verifyRefreshToken, UserController.refreshAccessToken) // GET /refresh-token
router.post('/logout', UserController.logout)
router.post('/forgot-password', UserController.forgotPassword)
router.post('/verify-otp', UserController.verifyOTP)
router.put('/reset-password', UserController.resetPassword)
router.put('/change-password', verifyAccessToken, UserController.changePassword)
router.get('/', verifyAccessToken, isAdmin, UserController.getAllUsers)
router.delete('/:uid', verifyAccessToken, isAdmin, UserController.deleteUser)
router.put('/update-user', verifyAccessToken, uploader.single('avatar'), UserController.updateUser)
router.put('/cart', verifyAccessToken, UserController.updateCart)
router.delete('/remove-cart/:pid/:color?', verifyAccessToken, UserController.removeProductIncart)
router.post('/add-address', verifyAccessToken, UserController.addAddress)
router.get('/get-addresses', verifyAccessToken, UserController.getAddresses)
router.delete('/delete-address/:aid', verifyAccessToken, UserController.deleteAddress)
router.put('/update-address/:aid', verifyAccessToken, UserController.updateAddress)
router.patch('/set-default-address/:aid', verifyAccessToken, UserController.setDefaultAddress)
router.put('/wishlist/:pid', verifyAccessToken, UserController.updateWishlist)
router.put('/:uid', verifyAccessToken, isAdmin, UserController.updateUserByAdmin)
module.exports = router

//Create (POST) + PUT: body
//Get + DELETE: query
