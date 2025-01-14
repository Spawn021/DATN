import React, { useState, memo } from 'react'
import { createSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { getUserCurrent } from '../../redux/features/userSlice'
import { showModal, showCart } from '../../redux/features/modalSlice'
import { Options } from '../../components'
import { ProductDetail } from '../../pages/public'
import { formatPrice, capitalizeFirstLetter, renderStar } from '../../ultils/helpers'
import newLabel from '../../assets/new.png'
import trendingLabel from '../../assets/trending.png'
import dealLabel from '../../assets/deal.png'
import icons from '../../ultils/icons'
import path from '../../ultils/path'
import { apiUsers } from '../../redux/apis'

const Product = ({ product, delWishlist }) => {
   const { FaRegEye, FaRegHeart, FaShoppingCart, BsCartCheckFill, TbHeartCheck, IoMdClose } = icons
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const location = useLocation()
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

   const handleClickMenu = async (e) => {
      e.preventDefault()
      if (!isLoggedIn || !userData) {
         Swal.fire({
            title: 'Oops!',
            text: 'Please login to add to cart',
            icon: 'info',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Login',
            showCancelButton: true,
         }).then((result) => {
            if (result.isConfirmed) {
               navigate(
                  {
                     pathname: `/${path.LOGIN}`,
                     search: createSearchParams({ redirect: location.pathname }).toString()
                  }
               )
            }

         })
      } else {
         const response = await apiUsers.updateCart({ pid: product._id, color: product.color, quantity: 1, price: product.price, thumbnail: product.thumbnail, title: product.title })
         if (response.success) {
            toast.success('Add to cart successfully')
            dispatch(getUserCurrent())

         }
         else toast.error('Add to cart failed')
      }

   }
   const handleWishlist = async (e) => {
      e.preventDefault()
      if (!isLoggedIn || !userData) {
         Swal.fire({
            title: 'Oops!',
            text: 'Please login to view your wishlist',
            icon: 'info',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Login',
            showCancelButton: true,
         }).then((result) => {
            if (result.isConfirmed) {
               navigate(
                  {
                     pathname: `/${path.LOGIN}`,
                     search: createSearchParams({ redirect: location.pathname }).toString()
                  }
               )
            }

         })

      } else {

         const response = await apiUsers.updateWishlist(product._id)
         if (response.success) {
            toast.success(response.message)
            dispatch(getUserCurrent())
         } else {
            toast.error('Something went wrong')
         }
      }
   }
   const handleQuickView = (e) => {
      e.preventDefault()
      dispatch(showModal({ isShowModal: true, modalContent: <ProductDetail data={{ pid: product._id, category: product.category }} isQuickView={true} /> }))

   }
   const viewCart = (e) => {
      e.preventDefault()
      dispatch(showCart())
   }
   const viewWishlist = (e) => {
      e.preventDefault()
      navigate(`/${path.WISHLIST}`)
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
               <>
                  {delWishlist && (
                     <div className='absolute top-0 left-0 flex justify-center gap-2 animate-slide-top'>
                        <span onClick={e => handleWishlist(e)}>
                           <Options icon={<IoMdClose />} content='Delete' />
                        </span>
                     </div>
                  )}
                  <div className='absolute bottom-[120px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                     {userData?.wishlist?.some(item => item._id === product?._id.toString()) ? (
                        <span onClick={e => viewWishlist(e)}>
                           <Options icon={<TbHeartCheck />} content='View wishlist' />
                        </span>
                     ) : (
                        <span onClick={e => handleWishlist(e)}>
                           <Options icon={<FaRegHeart />} content='Add wishlist' />
                        </span>
                     )}
                     {userData?.cart?.some(item => item?.product._id === product?._id.toString()) ?
                        <span onClick={e => viewCart(e)}>
                           <Options icon={<BsCartCheckFill />} content='View cart' />
                        </span> :
                        <span onClick={e => handleClickMenu(e)}>
                           <Options icon={<FaShoppingCart />} content='Add cart' />
                        </span>
                     }
                     <span onClick={e => handleQuickView(e)}>
                        <Options icon={<FaRegEye />} content='Quick view' />
                     </span>
                  </div>
               </>
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
