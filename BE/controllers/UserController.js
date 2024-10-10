const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshtoken } = require('../middlewares/jwt')
const sendMail = require('../ultils/sendMail')
class UserController {
    register = asyncHandler(async (req, res) => {
        const { firstname, lastname, email, password } = req.body
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields',
            })
        }
        const UserExists = await User.findOne({ email })
        if (UserExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            })
        } else {
            const newUser = await User.create(req.body)
            return res.status(201).json({
                success: true,
                newUser,
            })
        }
    })
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields',
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'User does not exist' })
        } else {
            if (await user.comparePassword(password)) {
                // Remove password from user object
                const { role, password, ...userData } = user.toObject()
                // Generate accessToken
                const accessToken = generateAccessToken(user._id, role)
                // Generate refreshToken
                const refreshToken = generateRefreshtoken(user._id)
                // Save refreshToken to database
                await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true }) //new: true returns the updated document
                // Save refreshToken to cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                })

                return res.status(200).json({
                    success: true,
                    accessToken,
                    message: 'Login successful',
                    userData,
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials',
                })
            }
        }
    })
    // Get current user
    getCurrent = asyncHandler(async (req, res) => {
        const { _id } = req.payload
        const user = await User.findById(_id).select('-password -refreshToken -role')
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        } else {
            return res.status(200).json({
                success: true,
                user,
            })
        }
    })
    refreshAccessToken = asyncHandler(async (req, res) => {
        const { _id } = req.payload
        const { refreshToken } = req.cookies
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }
        if (refreshToken !== user.refreshToken) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token',
            })
        }
        // Generate new accessToken
        const newAccessToken = generateAccessToken(user._id, user.role)
        return res.status(200).json({
            success: true,
            newAccessToken,
        })
    })
    logout = asyncHandler(async (req, res) => {
        const { refreshToken } = req.cookies
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'No refresh token in cookie',
            })
        }
        // Remove refreshToken from db
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' }, { new: true })
        // Remove refreshToken from cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        })
        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        })
    })
    // Client sends email
    // Server check if email exists and valid then sends reset password link to email (token change password)
    // Client check mail and click on the link
    // Client sends api include token, new password
    // Server check token valid and not expired
    // Server update new password
    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.query
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            })
        }
        const resetToken = user.createPasswordResetToken()
        await user.save()

        const html = `<p>Please click <a href="http://localhost:5000/api/user/reset-password/${resetToken}">here</a> to reset your password. This link will expire after 10 minutes </p>`
        const data = {
            email,
            html,
        }
        const result = await sendMail(data)
        return res.status(200).json({
            success: true,
            message: 'Reset password link sent to email',
            result,
        })
    })
    resetPassword = asyncHandler(async (req, res) => {
        const { password, token } = req.body
        if (!password || !token) {
            return res.status(400).json({
                success: false,
                message: 'Password and token are required',
            })
        }
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token is invalid or expired',
            })
        }
        user.password = password
        user.passwordResetToken = undefined
        user.passwordChangedAt = Date.now()
        user.passwordResetExpires = undefined
        await user.save()
        return res.status(200).json({
            success: user ? true : false,
            message: user ? 'Password reset successful' : 'Password reset failed',
        })
    })
}
module.exports = new UserController()
