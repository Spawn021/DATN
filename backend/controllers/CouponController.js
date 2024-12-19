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
        const response = await Coupon.find()
        return res.json({
            success: response ? true : false,
            getCoupons: response ? response : 'No coupon found',
        })
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
        return res.json({
            success: true,
            message: 'Coupon applied successfully',
            coupon,
        })
    })

}
module.exports = new CouponController()
