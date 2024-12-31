const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
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
        },
    ],
    status: {
        // stripe
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Successed', 'Cancelled'],
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
        ref: 'Address',
    },
})

//Export the model
module.exports = mongoose.model('Order', orderSchema)
