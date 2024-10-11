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
        const response = await BlogCategory.find().select('title _id')
        return res.json({
            success: response ? true : false,
            getAllBlogCategory: response ? response : 'No blog category found',
        })
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
