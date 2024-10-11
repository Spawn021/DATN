const userRouter = require('./user')
const productRouter = require('./product')
const ProductCategoryRouter = require('./productCategory')
const BlogCategoryRouter = require('./blogCategory')
const { notFound, errorHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/product-category', ProductCategoryRouter)
    app.use('/api/blog-category', BlogCategoryRouter)

    app.use(notFound)
    app.use(errorHandler)
}

module.exports = initRoutes
