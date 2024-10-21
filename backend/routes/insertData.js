const express = require('express')
const router = express.Router()
const insertDataController = require('../controllers/InsertDataController')

router.post('/', insertDataController.insertProduct)
router.post('/category', insertDataController.insertProductCategory)

module.exports = router
