const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')

router.post('/register', UserController.register) // POST /register

module.exports = router
