const ProductCategory = require('../models/ProductCategory')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

class ProductCategoryController {
   createProductCategory = asyncHandler(async (req, res) => {
      if (Object.keys(req.body).length === 0) {
         return res.status(400).json({
            success: false,
            message: 'Please fill in all fields',
         })
      }
      if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
      const response = await ProductCategory.create(req.body)
      return res.json({
         success: response ? true : false,
         createdProductCategory: response ? response : 'Product category not created',
      })
   })
   getAllProductCategory = asyncHandler(async (req, res) => {
      const response = await ProductCategory.find().select('-createdAt -updatedAt -__v')
      return res.json({
         success: response ? true : false,
         getAllProductCategory: response ? response : 'No product category found',
      })
   })
   updateProductCategory = asyncHandler(async (req, res) => {
      const { pcid } = req.params
      const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true })
      return res.json({
         success: response ? true : false,
         updatedProductCategory: response ? response : 'Product category not updated',
      })
   })
   deleteProductCategory = asyncHandler(async (req, res) => {
      const { pcid } = req.params
      const response = await ProductCategory.findByIdAndDelete(pcid)
      return res.json({
         success: response ? true : false,
         deletedProductCategory: response ? response : 'Product category not deleted',
      })
   })
}
module.exports = new ProductCategoryController()
