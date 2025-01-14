const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
    },
    refunded: {
        type: Boolean,
        default: false,
    },
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
            },
            color: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
            },
            thumbnail: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            category: {
                type: String,
            },
        },
    ],
    status: {
        // stripe
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Processing', 'Successed', 'Cancelled'],
    },
    total: Number,
    orderedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: 'Coupon',
    },
    address: {
        type: mongoose.Types.ObjectId,
        ref: 'UserAddress',
    },
    code: {
        type: String,
    },
}, { timestamps: true })

//Export the model
module.exports = mongoose.model('Order', orderSchema)
