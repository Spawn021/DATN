const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAccessToken = asyncHandler(async (req, res, next) => {
   //console.log(req.headers.authorization)
   if (req?.headers?.authorization?.startsWith('Bearer')) {
      //header: {authorization: 'Bearer token'}
      const token = req.headers.authorization.split(' ')[1]
      //   console.log(token)
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
         if (err) {
            return res.status(401).json({
               success: false,
               message: 'Token expired or invalid',
            })
         } else {
            req.payload = payload
            next()
         }
      })
   } else {
      return res.status(401).json({
         success: false,
         message: 'Request unauthorized',
      })
   }
})
const verifyRefreshToken = asyncHandler(async (req, res, next) => {
   // Get refreshToken from cookie
   const { refreshToken } = req.cookies
   //Check if refreshToken exists
   if (!refreshToken) {
      return res.status(400).json({
         success: false,
         message: 'No refresh token provided',
      })
   }
   // Verify refreshToken
   jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
         return res.status(403).json({
            success: false,
            message: 'Invalid refresh token',
         })
      }
      req.payload = payload

      next()
   })
})
const isAdmin = asyncHandler(async (req, res, next) => {
   const { role } = req.payload
   if (role !== 'admin') {
      return res.status(403).json({
         success: false,
         message: 'Permission denied',
      })
   }

   next()
})

module.exports = { verifyAccessToken, verifyRefreshToken, isAdmin }
