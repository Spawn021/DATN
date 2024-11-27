const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

class ProductController {
   createProduct = asyncHandler(async (req, res) => {
      if (Object.keys(req.body).length === 0) {
         return res.status(400).json({
            success: false,
            message: 'Please fill in all fields',
         })
      }
      if (req.body && req.body.discountPercentage > 100) {
         return res.status(400).json({
            success: false,
            message: 'Discount percentage cannot be more than 100%',
         })
      }
      if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
      const product = await Product.create(req.body)
      return res.status(201).json({
         success: product ? true : false,
         createdProduct: product ? product : 'Product not created',
      })
   })
   updateProduct = asyncHandler(async (req, res) => {
      const { pid } = req.params
      if (req.body && req.body.discountPercentage > 100) {
         return res.status(400).json({
            success: false,
            message: 'Discount percentage cannot be more than 100%',
         })
      }
      if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
      const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
      return res.status(200).json({
         success: updatedProduct ? true : false,
         updatedProduct: updatedProduct ? updatedProduct : 'Product not updated',
      })
   })
   deletedProduct = asyncHandler(async (req, res) => {
      const { pid } = req.params

      const deletedProduct = await Product.findByIdAndDelete(pid)
      return res.status(200).json({
         success: deletedProduct ? true : false,
         deletedProduct: deletedProduct ? deletedProduct : 'Product not deleted',
      })
   })
   getProduct = asyncHandler(async (req, res) => {
      const { pid } = req.params
      const product = await Product.findByIdAndUpdate(pid, { $inc: { numberViews: 1 } }, { new: true })
      return res.status(200).json({
         success: product ? true : false,
         product: product ? product : 'No product found',
      })
   })
   // Filter products
   // Sort products
   // Pagination

   getProducts = asyncHandler(async (req, res) => {
      const queries = { ...req.query } // Copy queries
      // Split special fields from queries
      const removeFields = ['sort', 'fields', 'page', 'limit']
      removeFields.forEach((field) => delete queries[field])
      // Format queries for syntax of MongoDB operators correctly
      let queryStr = JSON.stringify(queries) // Convert queries to string
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`) // Add $ to operators
      const formattedQuery = JSON.parse(queryStr) // Convert string back to object

      // Filter products
      if (queries?.title) {
         formattedQuery.title = { $regex: queries.title, $options: 'i' } // i: case insensitive
      }
      if (queries?.category) {
         formattedQuery.category = { $regex: queries.category, $options: 'i' }
      }
      if (queries?.color) {
         formattedQuery.color = { $regex: queries.color, $options: 'i' }
      }
      // console.log(formattedQuery)
      let queryCommand = Product.find(formattedQuery)

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
      const limit = parseInt(req.query.limit, 10) || parseInt(process.env.LIMIT_PRODUCT, 10)
      const skip = (page - 1) * limit
      queryCommand = queryCommand.skip(skip).limit(limit)

      // Execute query
      try {
         const products = await queryCommand
         const counts = await Product.find(formattedQuery).countDocuments()

         return res.status(200).json({
            counts,
            success: products.length > 0 ? true : false,
            products: products.length > 0 ? products : 'No products found',
         })
      } catch (err) {
         return res.status(400).json({
            success: false,
            message: 'Query failed',
         })
      }
   })
   ratings = asyncHandler(async (req, res) => {
      const { _id } = req.payload // User id
      const { star, comment, pid } = req.body
      if (!star || !pid) {
         return res.status(400).json({
            success: false,
            message: 'Missing inputs',
         })
      }
      const product = await Product.findById(pid)
      const existingRating = product?.ratings?.find((rating) => rating.postedBy.toString() === _id.toString())

      if (existingRating) {
         existingRating.star = star
         existingRating.comment = comment
      } else {
         product.ratings.push({ star, comment, postedBy: _id })
      }
      const totalRating = product.ratings.reduce((acc, item) => acc + +item.star, 0)

      product.totalRating = Math.round((totalRating * 10) / product.ratings.length) / 10
      await product.save()
      return res.status(200).json({
         success: product ? true : false,
         product: product ? product : 'No product found',
      })
   })
   uploadImageProduct = asyncHandler(async (req, res) => {
      const { pid } = req.params
      if (!req.files) return res.status(400).json({ success: false, message: 'No image uploaded' })
      const response = await Product.findByIdAndUpdate(
         pid,
         { $push: { images: { $each: req.files.map((file) => file.path) } } },
         { new: true },
      )
      return res.status(200).json({
         success: response ? true : false,
         uploadImageProduct: response ? response : 'Cannot upload image product',
      })
   })
}
module.exports = new ProductController()
