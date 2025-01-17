const Blog = require('../models/Blog')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

class BlogController {
    createBlog = asyncHandler(async (req, res) => {
        const { title, description, category } = req.body
        const thumbnail = req?.file?.path
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields',
            })
        }
        if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
        if (thumbnail) req.body.thumbnail = thumbnail
        const response = await Blog.create(req.body)
        return res.status(201).json({
            success: response ? true : false,
            createdBlog: response ? response : 'Blog not created',
        })
    })
    getBlogs = asyncHandler(async (req, res) => {
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
                { category: { $regex: queries.q, $options: 'i' } },
                { title: { $regex: queries.q, $options: 'i' } },
            ]
        }
        const qr = { ...formattedQuery, ...querySearch }
        let queryCommand = Blog.find(qr)
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
        const counts = await Blog.find(qr).countDocuments()
        queryCommand = queryCommand.skip(skip).limit(limit)

        // Execute query
        try {
            const blogs = await queryCommand
            return res.status(200).json({
                counts,
                success: blogs.length > 0 ? true : false,
                blogs: blogs.length > 0 ? blogs : 'No blog found',
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Query failed',
            })
        }
    })
    updateBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const { title, description, category } = req.body
        const thumbnail = req?.file?.path
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields',
            })
        }
        if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
        if (thumbnail) req.body.thumbnail = thumbnail
        const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updatedBlog: response ? response : 'Blog not updated',
        })
    })
    deleteBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const response = await Blog.findByIdAndDelete(bid)
        return res.status(200).json({
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

        return res.status(200).json({
            success: blog ? true : false,
            blog: blog ? blog : 'Blog not found',
        })
    })
    uploadImageBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' })
        const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            uploadImageBlog: response ? response : 'Cannot upload image blog',
        })
    })
}
module.exports = new BlogController()
