const jwt = require('jsonwebtoken')

const generateAccessToken = (userId, role) =>
    jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, { expiresIn: '60s' })

const generateRefreshtoken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
module.exports = {
    generateAccessToken,
    generateRefreshtoken,
}
