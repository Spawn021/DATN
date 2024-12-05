const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

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
      avatar: {
         type: String,
      },
      mobile: {
         type: String,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         default: 'user',
      },
      cart: [
         {
            product: { type: mongoose.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            color: { type: String },
         },
      ],
      address: {
         type: Array,
         default: [],
      },
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
      // registerToken: {
      //    type: String,
      // },
      passwordChangedAt: {
         type: String,
      },
      passwordResetOTP: {
         type: String,
      },
      passwordResetOTPExpires: {
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
   this.password = await bcrypt.hash(this.password, salt)

   next()
})
userSchema.methods = {
   comparePassword: async function (password) {
      return await bcrypt.compare(password, this.password)
   },
}
module.exports = mongoose.model('User', userSchema)
