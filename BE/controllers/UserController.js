const User = require('../models/User')
const asyncHandler = require('express-async-handler')
class UserController {
    register = asyncHandler(async (req, res) => {
        const { firstname, lastname, email, password } = req.body
        if (!firstname || !lastname || !email || !password) {
            res.status(400).json({ success: false, message: 'Please fill in all fields' })
        }
        const response = await User.create(req.body)
        return res.status(201).json({ success: response ? true : false, response })
    })
}
module.exports = new UserController()
