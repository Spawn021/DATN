const userRouter = require('./user')
const productRouter = require('./product')
const ProductCategoryRouter = require('./productCategory')
const BlogCategoryRouter = require('./blogCategory')
const BlogRouter = require('./blog')
const BrandRouter = require('./brand')
const CouponRouter = require('./coupon')
const OrderRouter = require('./order')
const InsertDataRouter = require('./insertData')
const { notFound, errorHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/product-category', ProductCategoryRouter)
    app.use('/api/blog-category', BlogCategoryRouter)
    app.use('/api/blog', BlogRouter)
    app.use('/api/brand', BrandRouter)
    app.use('/api/coupon', CouponRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/insert-data', InsertDataRouter)

    app.use(notFound)
    app.use(errorHandler)
}

module.exports = initRoutes
