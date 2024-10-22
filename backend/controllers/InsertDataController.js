const Product = require('../models/Product')
const ProductCategory = require('../models/ProductCategory')
const asyncHandler = require('express-async-handler')
const dataProduct = require('../../Scrape/data.json')
const dataCategory = require('../../Scrape/category.json')
const slugify = require('slugify')

const insertP = async (product) => {
   await Product.create({
      title: product?.name,
      slug: slugify(product?.name) + Math.round(Math.random() * 1000),
      description: product?.description,
      brand: product?.brand,
      price: Math.round(Number(product?.price.match(/\d/g).join('')) / 100),
      category: product?.category[1],
      quantity: Math.round(Math.random() * 1000),
      sold: Math.round(Math.random() * 100),
      images: product?.images,
      color: product?.variants?.find((el) => el.label === 'Color')?.variants[0],
   })
}
const insertC = async (category) => {
   await ProductCategory.create({
      title: category?.cate,
      brand: category?.brand,
      slug: slugify(category?.cate),
   })
}

const insertProduct = asyncHandler(async (req, res) => {
   const promises = []
   for (let product of dataProduct) {
      promises.push(insertP(product))
   }
   await Promise.all(promises)
   return res.json({ message: 'Data product inserted successfully' })
})
const insertProductCategory = asyncHandler(async (req, res) => {
   const promises = []
   for (let category of dataCategory) {
      promises.push(insertC(category))
   }
   await Promise.all(promises)
   return res.json({ message: 'Data product category inserted successfully' })
})

module.exports = { insertProduct, insertProductCategory }
