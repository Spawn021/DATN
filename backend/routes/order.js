const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', verifyAccessToken, OrderController.createOrder)
router.put('/update-status/:oid', verifyAccessToken, isAdmin, OrderController.updateStatus)
router.get('/get', verifyAccessToken, OrderController.getOrder)
router.get('/get-all', verifyAccessToken, isAdmin, OrderController.getAllOrders)

module.exports = router
