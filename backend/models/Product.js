const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
      },
      slug: {
         type: String,
         unique: true,
         lowercase: true,
      },
      description: {
         type: Array,
         required: true,
      },
      brand: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      discountPercentage: {
         type: Number,
         default: 0,
      },
      warranty: {
         type: String,
         required: true,
      },
      detailDescription: {
         type: Array,
         required: true,
      },
      category: {
         type: String,
         required: true,
      },
      quantity: {
         type: Number,
         default: 0,
      },
      sold: {
         type: Number,
         default: 0,
      },
      numberViews: {
         type: Number,
         default: 0,
      },
      images: {
         type: Array,
      },
      thumbnail: {
         type: String,
      },
      color: {
         type: String,
         // required: true,
      },
      ratings: [
         {
            star: Number,
            postedBy: {
               type: mongoose.Types.ObjectId,
               ref: 'User',
            },
            comment: String,
            updatedAt: {
               type: Date,
            },
         },
      ],
      totalRating: {
         type: Number,
         default: 0,
      },
      variants: [
         {
            title: String,
            color: String,
            quantity: Number,
            price: Number,
            thumbnail: String,
            images: Array,
            sold: Number,
            quantity: Number,
            sku: String,

         }
      ]
   },
   { timestamps: true }, // createdAt, updatedAt fields are automatically added into the schema
)

//Export the model
module.exports = mongoose.model('Product', productSchema)
