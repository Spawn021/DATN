const express = require('express')
const router = express.Router()
const ProductCategoryController = require('../controllers/ProductCategoryController')
const { verifyAccessToken, verifyRefreshToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', verifyAccessToken, isAdmin, ProductCategoryController.createProductCategory)
router.get('/get-all', ProductCategoryController.getAllProductCategory)
router.put('/update/:pcid', verifyAccessToken, isAdmin, ProductCategoryController.updateProductCategory)
router.delete('/delete/:pcid', verifyAccessToken, isAdmin, ProductCategoryController.deleteProductCategory)

module.exports = router

//Create (POST) + PUT: body
//Get + DELETE: query
