import React, { useState, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { Options } from '../../components'
import { formatPrice, capitalizeFirstLetter, renderStar } from '../../ultils/helpers'
import newLabel from '../../assets/new.png'
import trendingLabel from '../../assets/trending.png'
import dealLabel from '../../assets/deal.png'
import icons from '../../ultils/icons'
import path from '../../ultils/path'
const { FaRegEye, IoMenu, FaRegHeart } = icons

const Product = ({ product }) => {
   const navigate = useNavigate()
   const { userData, isLoggedIn } = useSelector(state => state.user)
   const [isShowOptions, setIsShowOptions] = useState(false)
   const isNew = (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) <= 32
   const isTrending = product.sold >= 100 && product.numberViews >= 100
   const isDeal = product.discountPercentage > 0
   // Xác định nhãn sẽ hiển thị dựa trên ưu tiên
   let label = null
   if (isDeal) {
      label = dealLabel
   } else if (isTrending) {
      label = trendingLabel
   } else if (isNew) {
      label = newLabel
   }
   let newPrice = product.price - (product.price * product.discountPercentage) / 100
   newPrice = Math.round(newPrice / 1000) * 1000

   const handleClickMenu = (e) => {
      e.preventDefault()
      navigate(`/${product.category.toLowerCase()}/${product._id}/${product.title}`)
   }
   const handleWishlist = (e) => {
      e.preventDefault()
      if (!isLoggedIn || !userData) {
         Swal.fire('Oops!', 'Please login to view your wishlist', 'info').then(() => {
            navigate(`/${path.LOGIN}`)
         })
      } else {
         console.log('Wishlist')
      }
   }
   const handleQuickView = (e) => {
      e.preventDefault()
      console.log('Quick view')
   }
   return (
      <div className='w-full px-[10px] mb-[20px] '>
         <Link
            to={`/${product.category.toLowerCase()}/${product._id}/${product.title}`}
            onMouseEnter={(e) => {
               setIsShowOptions(true)
            }}
            onMouseLeave={(e) => setIsShowOptions(false)}
            className='w-full border flex flex-col items-center relative hover:cursor-pointer focus:outline-none'
         >
            {isShowOptions && (
               <div className='absolute bottom-[120px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                  <span onClick={e => handleWishlist(e)}><Options icon={<FaRegHeart />} content='Wishlist' /></span>
                  <span onClick={e => handleClickMenu(e)}><Options icon={<IoMenu />} content='Menu' /></span>
                  <span onClick={e => handleQuickView(e)}><Options icon={<FaRegEye />} content='Quick view' /></span>
               </div>
            )}
            <img
               src={product.thumbnail || 'https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png'}
               alt={product.name}
               className='w-[243px] h-[249px] object-cover'
            />
            {label && <img src={label} alt='label' className='absolute top-5 right-5 w-[90px] h-[30px] object-cover' />}

            <div className='self-start ml-6 line-clamp-1 mb-[6px] mr-[8px]'>{capitalizeFirstLetter(product.title)}</div>
            <div className='flex self-start ml-6 mb-[6px]'>{renderStar(product.totalRating)}</div>

            {product.discountPercentage > 0 ? (
               <div className='self-start ml-6 flex flex-col'>
                  <div>
                     <span className='line-through text-[#7d7c7c]'>{`${formatPrice(product.price)} VND`}</span>
                     <span className='text-main ml-[10px]'>{`-${product.discountPercentage}%`}</span>
                  </div>
                  <span className='mb-[10px]'>{`${formatPrice(newPrice)} VND`}</span>
               </div>
            ) : (
               <div className='self-start ml-6 mb-[35px]'>{`${formatPrice(product.price)} VND`}</div>
            )}
         </Link>
      </div>
   )
}

export default memo(Product)
