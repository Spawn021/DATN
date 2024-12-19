const express = require('express')
const router = express.Router()
const CouponController = require('../controllers/CouponController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', verifyAccessToken, isAdmin, CouponController.createCoupon)
router.get('/get-all', CouponController.getCoupons)
router.put('/update/:cid', verifyAccessToken, isAdmin, CouponController.updateCoupon)
router.delete('/delete/:cid', verifyAccessToken, isAdmin, CouponController.deleteCoupon)
router.post('/check', verifyAccessToken, CouponController.checkCoupon)

module.exports = router
