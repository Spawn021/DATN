import React from 'react'
import logo from '../assets/logo.png'
import icons from '../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const Header = () => {
   const { FaPhone, MdEmail, FaRegHeart, FaShoppingCart, FaUserCircle } = icons
   return (
      <div className='w-main flex justify-between h-[110px] py-[35px] px-3'>
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
               <div className='flex items-center  pl-5 border-l'>
                  <FaRegHeart className='fill-main text-[20px] hover:cursor-pointer' />
               </div>
               <div className='flex items-center gap-2 pl-5 border-l'>
                  <FaShoppingCart className='fill-main text-[20px] hover:cursor-pointer' />
                  <span>0 item</span>
               </div>
               <div className='flex items-center pl-5 border-l '>
                  <FaUserCircle className='fill-main text-[20px] hover:cursor-pointer' />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Header
