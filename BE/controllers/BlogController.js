const Blog = require('../models/Blog')
const asyncHandler = require('express-async-handler')

class BlogController {
    createBlog = asyncHandler(async (req, res) => {
        const { title, description, category } = req.body
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields',
            })
        }
        const response = await Blog.create(req.body)
        return res.json({
            success: response ? true : false,
            createdBlog: response ? response : 'Blog not created',
        })
    })
    getBlogs = asyncHandler(async (req, res) => {
        const response = await Blog.find()
        return res.json({
            success: response ? true : false,
            getBlogs: response ? response : 'No blog found',
        })
    })
    updateBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        if (Object.keys(req.body).length === 0)
            return res.status(400).json({
                success: false,
                message: 'Missing inputs',
            })
        const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true })
        return res.json({
            success: response ? true : false,
            updatedBlog: response ? response : 'Blog not updated',
        })
    })
    deleteBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const response = await Blog.findByIdAndDelete(bid)
        return res.json({
            success: response ? true : false,
            deletedBlog: response ? response : 'Blog not deleted',
        })
    })
    // When user likes a blog
    // Check if user has disliked blog before => remove dislike
    // Check if user has liked blog before => remove like // add like

    likeBlog = asyncHandler(async (req, res) => {
        const { _id } = req.payload
        const { bid } = req.params
        if (!bid) throw new Error('Blog id is required')
        const blog = await Blog.findById(bid)
        const disliked = blog.dislikes.find((userId) => userId.toString() === _id) // Check if user has disliked blog before
        if (disliked) {
            blog.dislikes = blog.dislikes.filter((userId) => userId.toString() !== _id) // Remove dislike
            blog.likes.push(_id)
            await blog.save()
            return res.json({
                success: true,
                message: 'Blog disliked removed',
                result: blog,
            })
        }
        const isLiked = blog.likes.find((userId) => userId.toString() === _id)
        if (isLiked) {
            blog.likes = blog.likes.filter((userId) => userId.toString() !== _id)
            await blog.save()
            return res.json({
                success: true,
                message: 'Blog like removed',
                result: blog,
            })
        } else {
            blog.likes.push(_id)
            await blog.save()
            return res.json({
                success: true,
                message: 'Blog liked',
                result: blog,
            })
        }
    })
    dislikeBlog = asyncHandler(async (req, res) => {
        const { _id } = req.payload
        const { bid } = req.params
        if (!bid) throw new Error('Blog id is required')
        const blog = await Blog.findById(bid)
        const liked = blog.likes.find((userId) => userId.toString() === _id) // Check if user has liked blog before
        if (liked) {
            blog.likes = blog.likes.filter((userId) => userId.toString() !== _id) // Remove like
            blog.dislikes.push(_id)
            await blog.save()
            return res.json({
                success: true,
                message: 'Blog liked removed',
                result: blog,
            })
        }
        const isDisliked = blog.dislikes.find((userId) => userId.toString() === _id)
        if (isDisliked) {
            blog.dislikes = blog.dislikes.filter((userId) => userId.toString() !== _id)
            await blog.save()
            return res.json({
                success: true,
                message: 'Blog dislike removed',
                result: blog,
            })
        } else {
            blog.dislikes.push(_id)
            await blog.save()
            return res.json({
                success: true,
                message: 'Blog disliked',
                result: blog,
            })
        }
    })

    getBlog = asyncHandler(async (req, res) => {
        const selectFields = 'firstname lastname'
        const { bid } = req.params
        if (!bid) throw new Error('Blog id is required')
        const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
            .populate('likes', selectFields)
            .populate('dislikes', selectFields)

        return res.json({
            success: blog ? true : false,
            blog: blog ? blog : 'Blog not found',
        })
    })
}
module.exports = new BlogController()
