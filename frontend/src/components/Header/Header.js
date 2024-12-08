import React, { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import path from '../../ultils/path'


const Header = () => {
   const navigate = useNavigate()
   const { FaPhone, MdEmail, FaRegHeart, FaShoppingCart, FaUserCircle } = icons
   const { userData, isLoggedIn } = useSelector(state => state.user)

   const handleWishlist = () => {
      if (!isLoggedIn || !userData) {
         Swal.fire('Oops!', 'Please login to view your wishlist', 'info').then(() => {
            navigate(`/${path.LOGIN}`)
         })
      }
   }
   const handleCart = () => {
      if (!isLoggedIn || !userData) {
         Swal.fire('Oops!', 'Please login to view your cart', 'info').then(() => {
            navigate(`/${path.LOGIN}`)
         })

      }
   }
   const handleProfileClick = () => {
      if (!isLoggedIn || !userData) {
         Swal.fire('Oops!', 'Please login to access your profile', 'info').then(() => {
            navigate(`/${path.LOGIN}`)
         })
      } else {
         navigate(userData?.role === 'admin' ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`)
      }
   }
   return (
      <div className='w-main flex justify-between h-[110px] py-[35px] px-[10px]'>
         <Link to={`${path.HOME}`}>
            <img src={logo} alt='logo' className='w-[234px] object-contain' />
         </Link>

         <div className='flex w-[55%]'>
            <div className='flex justify-around w-full'>
               <div className='flex flex-col'>
                  <span className='flex text-[13px] items-center gap-3'>
                     <FaPhone className='fill-main gap-4' />
                     <span className='font-semibold'>(+1800) 000 8808</span>
                  </span>
                  <span className='text-[11.9px] text-[#505050] text-center'>Mon-Sat 9:00AM - 8:00PM</span>
               </div>
               <div className='flex flex-col pl-5 border-l'>
                  <span className='flex text-[13px] items-center gap-3'>
                     <MdEmail className='fill-main gap-4 ' />
                     <span className='font-semibold uppercase'>support@tadathemes.com</span>
                  </span>
                  <span className='text-[11.9px] text-[#505050] text-center'>Online Support 24/7</span>
               </div>
               <div onClick={handleWishlist} className='flex items-center  pl-5 border-l'>
                  <FaRegHeart className='fill-main text-[20px] hover:cursor-pointer' />
               </div>
               <div onClick={handleCart} className='flex items-center gap-2 pl-5 border-l'>
                  <FaShoppingCart className='fill-main text-[20px] hover:cursor-pointer' />
                  <span>0 item</span>
               </div>
               <div onClick={handleProfileClick} className='flex items-center pl-5 border-l'>
                  <FaUserCircle className='fill-main text-[20px] hover:cursor-pointer' />
               </div>
            </div>
         </div>
      </div>
   )
}

export default memo(Header)
