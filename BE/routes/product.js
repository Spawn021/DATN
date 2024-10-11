const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const { verifyAccessToken, verifyRefreshToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', verifyAccessToken, isAdmin, ProductController.createProduct)
router.get('/get-all', ProductController.getProducts)
router.put('/ratings', verifyAccessToken, ProductController.ratings)

router.put('/update/:pid', verifyAccessToken, isAdmin, ProductController.updateProduct)
router.delete('/delete/:pid', verifyAccessToken, isAdmin, ProductController.deletedProduct)
router.get('/get/:pid', ProductController.getProduct)

module.exports = router

//Create (POST) + PUT: body
//Get + DELETE: query
