const Order = require('../models/Order')
const User = require('../models/User')
const Coupon = require('../models/Coupon')
const asyncHandler = require('express-async-handler')

class OrderController {
    createOrder = asyncHandler(async (req, res) => {
        const { _id } = req.payload
        const { coupon, products, total, address } = req.body
        if (!products || !total || !address) {
            return res.status(400).json({
                success: false,
                message: 'Products, total and address are required',
            })
        }
        await User.findByIdAndUpdate(_id, { cart: [] })
        const order = await Order.create({ products, total, orderedBy: _id, coupon, address })
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
