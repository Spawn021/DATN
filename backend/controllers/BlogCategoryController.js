const BlogCategory = require('../models/BlogCategory')
const asyncHandler = require('express-async-handler')

class BlogCategoryController {
    createBlogCategory = asyncHandler(async (req, res) => {
        const response = await BlogCategory.create(req.body)
        return res.json({
            success: response ? true : false,
            createdBlogCategory: response ? response : 'Blog category not created',
        })
    })
    getAllBlogCategory = asyncHandler(async (req, res) => {
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
                { title: { $regex: queries.q, $options: 'i' } },
            ]
        }
        const qr = { ...formattedQuery, ...querySearch }
        let queryCommand = BlogCategory.find(qr)
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
        const counts = await BlogCategory.find(qr).countDocuments()
        queryCommand = queryCommand.skip(skip).limit(limit)

        // Execute query
        try {
            const blogCategories = await queryCommand
            return res.status(200).json({
                counts,
                success: blogCategories.length > 0 ? true : false,
                blogCategories: blogCategories.length > 0 ? blogCategories : 'No blog category found',
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Query failed',
            })
        }
    })
    updateBlogCategory = asyncHandler(async (req, res) => {
        const { bcid } = req.params
        const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true })
        return res.json({
            success: response ? true : false,
            updatedBlogCategory: response ? response : 'Blog category not updated',
        })
    })
    deleteBlogCategory = asyncHandler(async (req, res) => {
        const { bcid } = req.params
        const response = await BlogCategory.findByIdAndDelete(bcid)
        return res.json({
            success: response ? true : false,
            deletedBlogCategory: response ? response : 'Blog category not deleted',
        })
    })
}
module.exports = new BlogCategoryController()
