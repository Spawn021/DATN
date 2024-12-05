const jwt = require('jsonwebtoken')

const generateAccessToken = (userId, role) => jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, { expiresIn: '15s' })

const generateRefreshtoken = (userId) => {
   return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' }) // payload, secret, options, payload is userId
}
module.exports = {
   generateAccessToken,
   generateRefreshtoken,
}
