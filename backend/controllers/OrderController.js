const Order = require('../models/Order')
const User = require('../models/User')
const Coupon = require('../models/Coupon')
const asyncHandler = require('express-async-handler')
const axios = require('axios')
const generateOrderId = require('../ultils/helpers').generateOrderId
const sendMail = require('../ultils/sendMail')


const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com'
class OrderController {
    getPayPalAccessToken = async () => {
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(
            `${PAYPAL_API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        return response.data.access_token;
    }
    updateStatusOrder = asyncHandler(async (req, res) => {
        const { oid } = req.params
        const { status, note } = req.body
        const order = await Order.findById(oid).populate('orderedBy')
        if (!order) {
            return res.status(400).json({
                success: false,
                message: 'Order not found',
            })
        }
        if (status === 'Cancelled') {
            const accessToken = await this.getPayPalAccessToken()
            const response = await axios.post(
                `${PAYPAL_API_URL}/v2/payments/captures/${order.paymentId}/refund`,
                {
                    amount: {
                        value: order.total,
                        currency_code: 'USD',
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            if (response.status === 201) {
                await Order.findByIdAndUpdate(oid, { status: 'Cancelled', refunded: true }, { new: true })

                const html = `
                <p>Your order with ID <strong>${order.orderID}</strong> has been cancelled.</p>
                <p>Note: ${note}</p>
                <p>If you have any questions, please contact us.</p>`;
                const data = {
                    email: order.orderedBy.email,
                    html,
                    subject: 'Order Cancellation Notification',
                }
                await sendMail(data)
                return res.json({
                    success: true,
                    message: 'Order cancelled successfully',
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Order not cancelled',
                })
            }
        } else if (status === 'Processing') {
            await Order.findByIdAndUpdate(oid, { status: 'Processing' }, { new: true })

            const html = `
                <p>Your order with ID <strong>${order.orderID}</strong> is now being processed.</p>
                <p>Note: ${note}</p>
                <p>If you have any questions, please contact us.</p>`;
            const data = {
                email: order.orderedBy.email,
                html,
                subject: 'Order Processing Notification',
            }
            await sendMail(data)
            return res.status(400).json({
                success: true,
                message: 'Order processing successfully',
            })
        } else if (status === 'Completed') {
            await Order.findByIdAndUpdate(oid, { status: 'Completed' }, { new: true })

            return res.status(400).json({
                success: true,
                message: 'Order completed successfully',
            })
        }

    })
    createOrder = asyncHandler(async (req, res) => {
        const { _id } = req.payload;
        const { coupon, products, total, address, paymentId } = req.body;

        if (!products || !total || !address) {
            return res.status(400).json({
                success: false,
                message: 'Products, total, and address are required',
            });
        }
        await User.findByIdAndUpdate(_id, { cart: [] });

        const order = await Order.create({
            products,
            total,
            orderedBy: _id,
            coupon,
            address,
            orderID: generateOrderId(),
            paymentId,
        });

        if (coupon) {
            const updatedCoupon = await Coupon.findOneAndUpdate(
                {
                    _id: coupon,
                    isActive: true,
                    usedCount: { $lt: '$usageLimit' },
                    expiry: { $gt: Date.now() }
                },
                {
                    $inc: { usedCount: 1 },
                },
                { new: true }
            );

            if (!updatedCoupon) {
                return res.status(400).json({
                    success: false,
                    message: 'Coupon cannot be used (invalid, expired, or reached usage limit)',
                });
            }
        }

        return res.json({
            success: order ? true : false,
            order: order ? order : 'Order not created',
        });
    });
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
                { orderID: { $regex: queries.q, $options: 'i' } },
                { products: { $elemMatch: { title: { $regex: queries.q, $options: 'i' } } } },
            ]
        }
        const qr = { ...formattedQuery, orderedBy: _id, ...querySearch }
        let queryCommand = Order.find(qr)
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
        const counts = await Order.find(qr).countDocuments()
        queryCommand = queryCommand.skip(skip).limit(limit)

        // Execute query
        try {
            const orders = await queryCommand.populate('orderedBy').populate('coupon').populate('address').populate('products.product')
            return res.status(200).json({
                counts,
                success: orders.length > 0 ? true : false,
                orders: orders.length > 0 ? orders : 'No order found',
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Query failed',
            })
        }
    })
    getAllOrders = asyncHandler(async (req, res) => {
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
                { orderID: { $regex: queries.q, $options: 'i' } },
                { products: { $elemMatch: { title: { $regex: queries.q, $options: 'i' } } } },
            ]
        }
        const qr = { ...formattedQuery, ...querySearch }
        let queryCommand = Order.find(qr)
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
        const counts = await Order.find(qr).countDocuments()
        queryCommand = queryCommand.skip(skip).limit(limit)

        // Execute query
        try {
            const orders = await queryCommand.populate('orderedBy').populate('coupon').populate('address').populate('products.product')
            return res.status(200).json({
                counts,
                success: orders.length > 0 ? true : false,
                orders: orders.length > 0 ? orders : 'No order found',
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Query failed',
            })
        }
    })
}
module.exports = new OrderController()
