const Coupon = require('../models/Coupon')
const asyncHandler = require('express-async-handler')

class CouponController {
    createCoupon = asyncHandler(async (req, res) => {
        const { code, discountType, discountValue, expiry, usageLimit } = req.body
        const couponExists = await Coupon.findOne({ code });
        if (couponExists) {
            return res.status(400).json({
                success: false,
                message: 'Coupon already exists',
            })
        }

        const response = await Coupon.create({ ...req.body, expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000 })
        return res.json({
            success: response ? true : false,
            createdCoupon: response ? response : 'Coupon not created',
        })
    })
    getCoupons = asyncHandler(async (req, res) => {
        const queries = { ...req.query } // Copy queries
        // Split special fields from queries
        const removeFields = ['sort', 'fields', 'page', 'limit']
        removeFields.forEach((field) => delete queries[field])
        // Format queries for syntax of MongoDB operators correctly
        let queryStr = JSON.stringify(queries) // Convert queries to string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`) // Add $ to operators
        const formattedQuery = JSON.parse(queryStr) // Convert string back to object
        let querySearch = {}
        if (queries?.q) {
            delete formattedQuery.q
            querySearch.$or = [
                { code: { $regex: queries.q, $options: 'i' } },
            ]
        }
        const qr = { ...formattedQuery, ...querySearch }
        let queryCommand = Coupon.find(qr)
        // Sort products
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
        const counts = await Coupon.find(qr).countDocuments()
        queryCommand = queryCommand.skip(skip).limit(limit)

        // Execute query
        try {
            const coupons = await queryCommand
            return res.status(200).json({
                counts,
                success: coupons.length > 0 ? true : false,
                coupons: coupons.length > 0 ? coupons : 'No coupon found',
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Query failed',
            })
        }
    })


    updateCoupon = asyncHandler(async (req, res) => {
        const { cid } = req.params
        if (Object.keys(req.body).length === 0)
            return res.status(400).json({
                success: false,
                message: 'Missing inputs',
            })
        const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true })
        if (response && req.body.expiry) response.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
        return res.json({
            success: response ? true : false,
            updatedCoupon: response ? response : 'Coupon not updated',
        })
    })
    deleteCoupon = asyncHandler(async (req, res) => {
        const { cid } = req.params
        const response = await Coupon.findByIdAndDelete(cid)
        return res.json({
            success: response ? true : false,
            deletedCoupon: response ? response : 'Coupon not deleted',
        })
    })
    checkCoupon = asyncHandler(async (req, res) => {
        const { code } = req.body
        const coupon = await Coupon.findOne({ code })
        if (!coupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon not found',
            })
        }
        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Coupon is inactive',
            })
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon has reached its usage limit',
            })
        }
        if (coupon.expiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Coupon has expired',
            })
        }
        return res.status(400).json({
            success: true,
            message: 'Coupon applied successfully',
            coupon,
        })
    })

}
module.exports = new CouponController()
