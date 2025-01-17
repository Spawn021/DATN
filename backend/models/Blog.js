const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        numberViews: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        thumbnail: {
            type: String,
            default: 'https://c0.wallpaperflare.com/preview/639/306/330/aerial-background-blog-cafe.jpg',
        },
        author: {
            type: String,
            default: 'Admin',
        },
    },
    { timestamps: true },
)

//Export the model
module.exports = mongoose.model('Blog', blogSchema)
