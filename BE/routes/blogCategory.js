const express = require('express')
const router = express.Router()
const BlogCategoryController = require('../controllers/BlogCategoryController')
const { verifyAccessToken, verifyRefreshToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', verifyAccessToken, isAdmin, BlogCategoryController.createBlogCategory)
router.get('/get-all', BlogCategoryController.getAllBlogCategory)
router.put('/update/:bcid', verifyAccessToken, isAdmin, BlogCategoryController.updateBlogCategory)
router.delete('/delete/:bcid', verifyAccessToken, isAdmin, BlogCategoryController.deleteBlogCategory)

module.exports = router

//Create (POST) + PUT: body
//Get + DELETE: query
