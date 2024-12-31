const mongoose = require('mongoose');

// Schema cho địa chỉ
const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: 'Vietnam',
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('UserAddress', addressSchema);
