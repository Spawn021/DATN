const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        expiry: {
            type: Date,
            required: true,
        },
        usageLimit: {
            type: Number,
            default: 1,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
)

//Export the model
module.exports = mongoose.model('Coupon', couponSchema)
