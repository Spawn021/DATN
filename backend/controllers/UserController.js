const User = require('../models/User')
const UserAddress = require('../models/Address')
const cron = require('node-cron')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshtoken } = require('../middlewares/jwt')
const sendMail = require('../ultils/sendMail')
const { users } = require('../ultils/constants')
class UserController {
   constructor() {
      cron.schedule('*/5 * * * * ', async () => {
         const now = Date.now()
         await User.updateMany({ passwordResetOTPExpires: { $lt: now } }, { $unset: { passwordResetOTP: '', passwordResetOTPExpires: '' } })
      })
   }
   register = asyncHandler(async (req, res) => {
      const { firstname, lastname, email, password, mobile } = req.body
      if (!firstname || !lastname || !email || !password || !mobile) {
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
         const token = crypto.randomBytes(20).toString('hex')
         res.cookie('data-register', { ...req.body, token }, { httpOnly: true, maxAge: 1000 * 60 * 15 }) // 15 minutes
         const html = `<p>Please click <a href="http://localhost:5000/api/user/active-account/${token}">here</a> to activate your account</p>`
         const data = {
            email,
            html,
            subject: 'Activate account',
         }
         const result = await sendMail(data)
         return res.status(200).json({
            success: true,
            message: 'Activation link sent to email. Please check your email',
            result,
         })
      }
   })
   activateAccount = asyncHandler(async (req, res) => {
      const cookie = req.cookies
      const { token } = req.params
      if (!cookie['data-register'] || cookie['data-register'].token !== token) {
         res.clearCookie('data-register')
         return res.redirect(`${process.env.CLIENT_URL}/active-account/error`)
      }
      const newUser = await User.create(cookie['data-register'])
      res.clearCookie('data-register')
      if (newUser) {
         return res.redirect(`${process.env.CLIENT_URL}/active-account/success`)
      } else {
         return res.redirect(`${process.env.CLIENT_URL}/active-account/error`)
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
      const user = await User.findOne({ email }) // user is instance of User model
      if (!user) {
         return res.status(400).json({ success: false, message: 'User does not exist' })
      } else {
         if (await user.comparePassword(password)) {
            // Remove password from user object
            const { role, password, ...userData } = user.toObject() //toObject() converts mongoose document to plain js object
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
               secure: true, // Bắt buộc nếu dùng SameSite: 'None'
               sameSite: 'None',
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
      // console.log(req.payload)
      const { _id } = req.payload
      const user = await User.findById(_id).select('-password -refreshToken').populate({
         path: 'cart',
         populate: {
            path: 'product',
            select: 'title price thumbnail discountPercentage category quantity',
         }
      })
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
      // Generate new accessToken, refreshToken
      const newAccessToken = generateAccessToken(user._id, user.role)
      const newRefreshToken = generateRefreshtoken(user._id)
      // Update refreshToken in db
      await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true })

      res.cookie('refreshToken', newRefreshToken, {
         httpOnly: true,
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
         secure: true,
         sameSite: 'None',
      })
      return res.status(200).json({
         success: true,
         newAccessToken,
      })
   })
   logout = asyncHandler(async (req, res) => {
      const { refreshToken } = req.cookies
      // Check if refreshToken exists in cookie <==> user is logged in
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
      const { email } = req.body
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
      const otp = Math.floor(1000 + Math.random() * 9000)
      user.passwordResetOTP = otp
      user.passwordResetOTPExpires = Date.now() + 5 * 60 * 1000 //
      await user.save()

      const html = `<p>Your OTP to reset password is <strong>${otp}</strong></p>. <p>OTP will expire in 5 minutes</p>`
      const data = {
         email,
         html,
         subject: 'Reset password OTP',
      }
      const result = await sendMail(data)
      return res.status(200).json({
         success: true,
         message: 'OTP sent to email',
         result,
      })
   })
   verifyOTP = asyncHandler(async (req, res) => {
      const { email, otp } = req.body

      if (!email || !otp) {
         return res.status(400).json({
            success: false,
            message: 'Email and OTP are required',
         })
      }
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(400).json({
            success: false,
            message: 'User not found',
         })
      }
      if (user.passwordResetOTP !== otp) {
         return res.status(400).json({
            success: false,
            message: 'Invalid OTP',
         })
      }
      if (user.passwordResetOTPExpires < Date.now()) {
         return res.status(400).json({
            success: false,
            message: 'OTP expired',
         })
      }
      return res.status(200).json({
         success: true,
         message: 'OTP verified. OTP is valid. You can now enter a new password',
      })
   })
   resetPassword = asyncHandler(async (req, res) => {
      const { email, password } = req.body
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: 'Email and password are required',
         })
      }
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(400).json({
            success: false,
            message: 'User not found',
         })
      }
      user.password = password
      user.passwordResetOTP = ''
      user.passwordResetOTPExpires = ''
      await user.save()
      return res.status(200).json({
         success: true,
         message: 'Password reset successful',
      })
   })
   changePassword = asyncHandler(async (req, res) => {
      const { _id } = req.payload
      const { password, newPassword } = req.body
      if (!password || !newPassword) {
         return res.status(400).json({
            success: false,
            message: 'Password and new password are required',
         })
      }
      const user = await User.findByIdAndUpdate(_id, { password: newPassword }, { new: true })
      if (!user) {
         return res.status(400).json({
            success: false,
            message: 'User not found',
         })
      }
      return res.status(200).json({
         success: true,
         message: 'Password changed successfully',
      })
   })
   changePassword = asyncHandler(async (req, res) => {
      const { _id } = req.payload
      const { password, newPassword } = req.body
      if (!password || !newPassword) {
         return res.status(400).json({
            success: false,
            message: 'Password and new password are required',
         });
      }

      const user = await User.findById(_id)
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
         })
      } else if (await user.comparePassword(password)) {
         user.password = newPassword
         await user.save()
         return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
         })
      } else {
         return res.status(400).json({
            success: false,
            message: 'Invalid password',
         })
      }
   })



   getAllUsers = asyncHandler(async (req, res) => {
      const queries = { ...req.query } // Copy queries
      // Split special fields from queries
      const removeFields = ['sort', 'fields', 'page', 'limit']
      removeFields.forEach((field) => delete queries[field]) // Remove special fields from queries
      // Format queries for syntax of MongoDB operators correctly
      let queryStr = JSON.stringify(queries) // Convert queries to string
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`) // Add $ to operators
      const formattedQuery = JSON.parse(queryStr) // Convert string back to object

      // if (queries?.name) {
      //    formattedQuery.name = { $regex: queries.name, $options: 'i' } // i: case insensitive
      // }
      if (req.query.q) {
         formattedQuery.$or = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } }
         ]
         delete formattedQuery.q
      }
      let queryCommand = User.find(formattedQuery)

      if (req.query.sort) {
         const sortBy = req.query.sort.split(',').join(' ') //
         queryCommand = queryCommand.sort(sortBy)
      } else {
         queryCommand = queryCommand.sort('-createdAt')
      }

      // Field selection
      if (req.query.fields) {
         const fields = req.query.fields.split(',').join(' ')
         queryCommand = queryCommand.select(fields)
      }

      // Pagination
      // page: current page
      // limit: number of results per page
      // skip: number of results to skip before starting to return results

      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || parseInt(process.env.LIMIT, 10)
      const skip = (page - 1) * limit

      const counts = await User.find(queryCommand).countDocuments()
      queryCommand = queryCommand.skip(skip).limit(limit)
      // Execute query
      try {
         const users = await queryCommand

         return res.status(200).json({
            counts,
            success: users.length > 0 ? true : false,
            users: users.length > 0 ? users : 'No user found',
         })
      } catch (err) {
         return res.status(400).json({
            success: false,
            message: 'Query failed',
         })
      }
   })
   deleteUser = asyncHandler(async (req, res) => {
      const { uid } = req.params
      if (!uid) {
         return res.status(400).json({
            success: false,
            message: 'User id is required',
         })
      }
      const user = await User.findByIdAndDelete(uid)
      return res.status(200).json({
         success: user ? true : false,
         deletedUser: user ? `User with email ${user.email} deleted ` : 'User not found',
      })
   })
   updateUser = asyncHandler(async (req, res) => {
      const { _id } = req.payload
      console.log(_id)
      const { firstname, lastname, email, mobile } = req.body
      const data = { firstname, lastname, email, mobile }
      if (req.file) data.avatar = req.file.path

      if (!_id || Object.keys(req.body).length === 0) {
         return res.status(400).json({
            success: false,
            message: 'Missing inputs',
         })
      }
      const user = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -refreshToken -role')
      return res.status(200).json({
         success: user ? true : false,
         updatedUser: user ? user : 'Something went wrong',
      })
   })
   updateUserByAdmin = asyncHandler(async (req, res) => {
      const { uid } = req.params
      if (Object.keys(req.body).length === 0) {
         return res.status(400).json({
            success: false,
            message: 'Missing inputs',
         })
      }
      const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -refreshToken -role')
      return res.status(200).json({
         success: user ? true : false,
         updatedUser: user ? user : 'Something went wrong',
      })
   })
   addAddress = asyncHandler(async (req, res) => {
      const { name, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body
      const { _id } = req.payload
      if (!name || !phone || !addressLine1 || !city || !postalCode) {
         return res.status(400).json({
            success: false,
            message: 'Missing inputs',
         })
      }
      const address = await UserAddress.create({
         userId: _id,
         name,
         phone,
         addressLine1,
         addressLine2,
         city,
         state,
         postalCode,
         country,
         isDefault,
      })
      return res.status(200).json({
         success: address ? true : false,
         address: address ? address : 'Cannot add address',
      })
   })
   getAddresses = asyncHandler(async (req, res) => {
      const { _id } = req.payload
      const addresses = await UserAddress.find({ userId: _id })
      return res.status(200).json({
         success: addresses.length > 0 ? true : false,
         addresses: addresses.length > 0 ? addresses : 'No address found',
      })
   })
   updateAddress = asyncHandler(async (req, res) => {
      const { aid } = req.params
      if (!aid || Object.keys(req.body).length === 0) {
         return res.status(400).json({
            success: false,
            message: 'Missing inputs',
         })
      }
      const address = await UserAddress.findByIdAndUpdate(aid, req.body, { new: true })
      return res.status(200).json({
         success: address ? true : false,
         updatedAddress: address ? address : 'Something went wrong',
      })
   })
   deleteAddress = asyncHandler(async (req, res) => {
      const { aid } = req.params
      if (!aid) {
         return res.status(400).json({
            success: false,
            message: 'Address id is required',
         })
      }
      const address = await UserAddress.findByIdAndDelete(aid)
      return res.status(200).json({
         success: address ? true : false,
         deletedAddress: address ? address : 'Address not found',
      })
   })
   setDefaultAddress = asyncHandler(async (req, res) => {
      const { aid } = req.params
      const { _id } = req.payload
      if (!aid) {
         return res.status(400).json({
            success: false,
            message: 'Address id is required',
         })
      }
      await UserAddress.updateMany({ userId: _id }, { isDefault: false })
      const address = await UserAddress.findByIdAndUpdate(aid, { isDefault: true }, { new: true })
      return res.status(200).json({
         success: address ? true : false,
         updatedAddress: address ? address : 'Address not found',
      })
   })
   updateCart = asyncHandler(async (req, res) => {
      const { _id } = req.payload
      const { pid, quantity = 1, color, price, thumbnail, title } = req.body
      // if (!pid || !quantity || !color) {
      //    return res.status(400).json({
      //       success: false,
      //       message: 'Missing inputs',
      //    })
      // }
      const Cart = await User.findById(_id)
      const productInCart = Cart.cart.find((item) => item.product.toString() === pid && item.color === color)

      if (productInCart) {
         // Nếu sản phẩm cùng màu đã có, ghi đè số lượng
         productInCart.quantity = quantity // Ghi đè số lượng
         productInCart.price = price
         productInCart.thumbnail = thumbnail
         productInCart.title = title
         await Cart.save()
         return res.status(200).json({ success: true, Cart })
      } else {
         // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
         Cart.cart.push({ product: pid, quantity, color, price, thumbnail, title })
         await Cart.save()
         return res.status(200).json({ success: true, Cart })
      }
   })
   removeProductIncart = asyncHandler(async (req, res) => {
      const { _id } = req.payload
      const { pid, color } = req.params
      const Cart = await User.findById(_id).select('cart')
      if (color) {
         const productInCart = Cart.cart.find(
            (item) => item.product.toString() === pid && item.color === color
         )
         if (!productInCart) {
            return res.status(404).json({
               success: false,
               message: 'Product with specified color not found in cart',
            })
         }
         const index = Cart.cart.indexOf(productInCart);
         Cart.cart.splice(index, 1);
         await Cart.save();
         return res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            Cart,
         })
      } else {
         const productInCart = Cart.cart.find(
            (item) => item.product.toString() === pid && !item.color
         )
         if (!productInCart) {
            return res.status(404).json({
               success: false,
               message: 'Product without color not found in cart',
            })
         }
         const index = Cart.cart.indexOf(productInCart)
         Cart.cart.splice(index, 1)
         await Cart.save()
         return res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            Cart,
         })
      }
   })



   createUsers = asyncHandler(async (req, res) => {
      const response = await User.create(users)
      return res.status(200).json({
         success: response ? true : false,
         users: response ? response : 'Cannot create users',
      })
   })

}
module.exports = new UserController()
