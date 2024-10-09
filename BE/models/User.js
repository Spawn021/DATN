const bcrypt = require('bcrypt')
const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'user',
        },
        cart: {
            type: Array,
            default: [],
        },
        address: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Address',
            },
        ],
        wishlist: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
            },
        ],
        isBlocked: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        passordChangedAt: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: String,
        },
    },
    { timestamps: true },
)

// hash password before save (pre save hook)
userSchema.pre('save', async function (next) {
    // check password có bị thay đổi không, nếu thay đổi thì mới hash
    if (!this.isModified('password')) return next()
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)

    next()
})

module.exports = mongoose.model('User', userSchema)
