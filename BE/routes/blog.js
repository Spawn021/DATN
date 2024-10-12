const express = require('express')
const router = express.Router()
const BlogController = require('../controllers/BlogController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', verifyAccessToken, isAdmin, BlogController.createBlog)
router.get('/get-all', BlogController.getBlogs)
router.get('/get/:bid', BlogController.getBlog)
router.put('/update/:bid', verifyAccessToken, isAdmin, BlogController.updateBlog)
router.delete('/delete/:bid', verifyAccessToken, isAdmin, BlogController.deleteBlog)
router.put('/like/:bid', verifyAccessToken, BlogController.likeBlog)
router.put('/dislike/:bid', verifyAccessToken, BlogController.dislikeBlog)

module.exports = router
