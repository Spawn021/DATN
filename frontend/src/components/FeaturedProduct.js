import React, { useState, useEffect } from 'react'
import { apiProducts } from '../redux/apis'
import { formatPrice, capitalizeFirstLetter, renderStar } from '../ultils/helpers'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const FeaturedProduct = () => {
   const [products, setProducts] = useState([])
   const getProduct = async () => {
      const response = await apiProducts.getProducts({ limit: 9, page: Math.floor(Math.random() * 7) })
      if (response.success) {
         const updatedProducts = response.products.map((product) => {
            let newPrice = product.price - (product.price * product.discountPercentage) / 100
            newPrice = Math.round(newPrice / 1000) * 1000
            return { ...product, newPrice }
         })
         setProducts(updatedProducts)
      }
   }
   useEffect(() => {
      getProduct()
   }, [])

   return (
      <div>
         <h2 className=' text-xl font-semibold text-[#151515] pb-4 border-main border-b-[2px] '>FEATURED PRODUCTS</h2>
         <div className='grid grid-cols-3 gap-5 mt-5'>
            {products?.map((product, index) => (
               <Link
                  to={`/${path.DETAIL_PRODUCT}/${product._id}/${product.title}`}
                  key={index}
                  className='group border flex w-full p-4 hover:cursor-pointer '
               >
                  <img
                     src={product?.thumbnail || 'https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png'}
                     alt={product.title}
                     className='w-1/3 object-contain'
                  />
                  <div>
                     <h3 className='text-[14.5px] group-hover:text-main mb-[5px]'>{capitalizeFirstLetter(product?.title)}</h3>
                     <div className='flex mb-[5px]'>{renderStar(product.totalRating)}</div>
                     {product.discountPercentage > 0 ? (
                        <div className='flex flex-col'>
                           <div>
                              <span className='line-through text-[#7d7c7c]'>{`${formatPrice(product.price)} VND`}</span>
                              <span className='text-main ml-[10px]'>{`-${product.discountPercentage}%`}</span>
                           </div>
                           <span className='mb-[10px]'>{`${formatPrice(product.newPrice)} VND`}</span>
                        </div>
                     ) : (
                        <div className='mb-[35px]'>{`${formatPrice(product.price)} VND`}</div>
                     )}
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}

export default FeaturedProduct
