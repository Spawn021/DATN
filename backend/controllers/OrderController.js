const Order = require('../models/Order')
const User = require('../models/User')
const Coupon = require('../models/Coupon')
const asyncHandler = require('express-async-handler')

class OrderController {
    createOrder = asyncHandler(async (req, res) => {
        const { _id } = req.payload
        const { coupon } = req.body
        const Cart = await User.findById(_id).select('cart').populate({ path: 'cart.product', select: 'price title' })
        if (!Cart || !Cart.cart || Cart.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No products in cart',
            })
        }
        const products = Cart.cart.map((item) => ({
            product: item.product._id,
            price: item.product.price,
            quantity: item.quantity,
            color: item.color,
        }))
        let total = Cart?.cart?.reduce((acc, item) => acc + item.quantity * item.product.price, 0)
        if (coupon) {
            const validCoupon = await Coupon.findById(coupon)
            if (validCoupon) {
                total = total - (total * validCoupon.discount) / 100
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid coupon',
                })
            }
        }
        const order = await Order.create({ products, total, orderedBy: _id, coupon })
        return res.json({
            success: order ? true : false,
            order: order ? order : 'Order not created',
        })
    })
    updateStatus = asyncHandler(async (req, res) => {
        const { oid } = req.params
        const { status } = req.body
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required',
            })
        }
        const response = await Order.findByIdAndUpdate(oid, { status: status }, { new: true })
        return res.json({
            success: response ? true : false,
            response: response ? response : 'Status not updated',
        })
    })
    getOrder = asyncHandler(async (req, res) => {
        const { _id } = req.payload
        const orders = await Order.find({ orderedBy: _id })
        return res.json({
            success: orders ? true : false,
            orders: orders ? orders : 'No orders found',
        })
    })
    getAllOrders = asyncHandler(async (req, res) => {
        const orders = await Order.find()
        return res.json({
            success: orders ? true : false,
            orders: orders ? orders : 'No orders found',
        })
    })
}
module.exports = new OrderController()
