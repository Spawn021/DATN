const express = require('express')
const router = express.Router()
const BrandController = require('../controllers/BrandController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', verifyAccessToken, isAdmin, BrandController.createBrand)
router.get('/get-all', BrandController.getAllBrand)
router.put('/update/:bid', verifyAccessToken, isAdmin, BrandController.updateBrand)
router.delete('/delete/:bid', verifyAccessToken, isAdmin, BrandController.deleteBrand)

module.exports = router

//Create (POST) + PUT: body
//Get + DELETE: query
