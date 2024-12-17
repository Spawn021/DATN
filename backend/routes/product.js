const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/create', verifyAccessToken, isAdmin, uploader.fields([{ name: 'images', maxCount: 10 }, { name: 'thumbnail', maxCount: 1 }]), ProductController.createProduct)
router.get('/get-all', ProductController.getProducts)
router.put('/ratings', verifyAccessToken, ProductController.ratings)

router.put('/upload-image/:pid', verifyAccessToken, isAdmin, uploader.array('images', 10), ProductController.uploadImageProduct)
router.put('/update/:pid', verifyAccessToken, isAdmin, uploader.fields([{ name: 'images', maxCount: 10 }, { name: 'thumbnail', maxCount: 1 }]), ProductController.updateProduct)
router.put('/variant/:pid', verifyAccessToken, isAdmin, uploader.fields([{ name: 'images', maxCount: 10 }, { name: 'thumbnail', maxCount: 1 }]), ProductController.addVariants)
router.delete('/delete/:pid', verifyAccessToken, isAdmin, ProductController.deletedProduct)
router.get('/get/:pid', ProductController.getProduct)

module.exports = router

//Create (POST) + PUT: body
//Get + DELETE: query
