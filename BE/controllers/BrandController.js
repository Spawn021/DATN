const Brand = require('../models/Brand')
const asyncHandler = require('express-async-handler')

class BrandController {
    createBrand = asyncHandler(async (req, res) => {
        const response = await Brand.create(req.body)
        return res.json({
            success: response ? true : false,
            createdBrand: response ? response : 'Brand not created',
        })
    })
    getAllBrand = asyncHandler(async (req, res) => {
        const response = await Brand.find().select('title _id')
        return res.json({
            success: response ? true : false,
            getAllBrand: response ? response : 'No brand found',
        })
    })
    updateBrand = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true })
        return res.json({
            success: response ? true : false,
            updatedBrand: response ? response : 'Brand not updated',
        })
    })
    deleteBrand = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const response = await Brand.findByIdAndDelete(bid)
        return res.json({
            success: response ? true : false,
            deletedBrand: response ? response : 'Brand not deleted',
        })
    })
}
module.exports = new BrandController()
