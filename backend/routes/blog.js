const express = require('express')
const router = express.Router()
const BlogController = require('../controllers/BlogController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/create', verifyAccessToken, isAdmin, uploader.single('thumbnail'), BlogController.createBlog)
router.get('/get-all', BlogController.getBlogs)
router.get('/get/:bid', BlogController.getBlog)
router.put('/update/:bid', verifyAccessToken, isAdmin, uploader.single('thumbnail'), BlogController.updateBlog)
router.delete('/delete/:bid', verifyAccessToken, isAdmin, BlogController.deleteBlog)
router.put('/like/:bid', verifyAccessToken, BlogController.likeBlog)
router.put('/dislike/:bid', verifyAccessToken, BlogController.dislikeBlog)
router.put('/upload-image/:bid', verifyAccessToken, isAdmin, uploader.single('image'), BlogController.uploadImageBlog)

module.exports = router
