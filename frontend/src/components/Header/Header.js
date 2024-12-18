import React, { memo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { apiUsers } from '../../redux/apis'
import { logout } from '../../redux/features/userSlice'
import { showCart } from '../../redux/features/modalSlice'
import Swal from 'sweetalert2'
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import path from '../../ultils/path'


const Header = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { FaPhone, MdEmail, FaRegHeart, FaShoppingCart, FaUserCircle, RiAdminLine, ImProfile, BiLogOutCircle, } = icons
   const { userData, isLoggedIn } = useSelector(state => state.user)
   const [isShowOption, setIsShowOption] = useState(false)

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

      } else dispatch(showCart())
   }
   const handleLogout = async () => {
      Swal.fire({
         title: 'Are you sure?',
         text: 'You want to logout?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes',
         cancelButtonText: 'No',
      }).then(async (result) => {
         if (result.isConfirmed) {
            await apiUsers.logout()
            dispatch(logout())
            setIsShowOption(false)

         }
      })
   }
   const handleProfileClick = () => {
      if (!isLoggedIn || !userData) {
         Swal.fire('Oops!', 'Please login to access your profile', 'info').then(() => {
            navigate(`/${path.LOGIN}`)
         })
      } else setIsShowOption(!isShowOption)
   }
   useEffect(() => {
      const handleClickOutside = (e) => {

         const profile = document.getElementById('profile')
         if (!profile.contains(e.target)) setIsShowOption(false)
      }
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
   }, [])
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
               <div onClick={handleWishlist} className='flex items-center pl-5 border-l'>
                  <FaRegHeart className='fill-main text-[20px] hover:cursor-pointer' />
               </div>
               <div onClick={handleCart} className='flex items-center gap-2 pl-5 border-l relative z-0'>
                  <FaShoppingCart className='fill-main text-[20px] hover:cursor-pointer' />
                  {userData?.cart?.length > 0 &&
                     <span className='absolute top-1 -right-2 border rounded-full bg-red-500 w-4 h-4 flex items-center justify-center'>
                        <span className='text-xs text-white'>
                           {userData?.cart?.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                     </span>
                  }
               </div>
               <div onClick={handleProfileClick} id='profile' className='flex items-center pl-5 border-l relative z-0'>
                  <FaUserCircle className='fill-main text-[20px] hover:cursor-pointer' />
                  {isShowOption && (
                     <div className='absolute top-full left-[-100%] bg-white shadow-custom min-w-[150px] p-3 flex flex-col gap-2 rounded'>
                        <div className='flex flex-col gap-2 border-b'>
                           <Link to={`/${path.MEMBER}/${path.PERSONAL}`} className='p-2 flex gap-4 items-center cursor-pointer hover:text-[#ee3131] hover:bg-[#f6f6f6] '>
                              <ImProfile />
                              <div className='text-sm' >Personal</div>
                           </Link>

                           {userData?.role === 'admin' &&
                              <Link to={`/${path.ADMIN}/${path.DASHBOARD}`} className='p-2 flex gap-4 items-center cursor-pointer hover:text-[#ee3131] hover:bg-[#f6f6f6] '>
                                 <RiAdminLine />
                                 <div className='text-sm' >Admin</div>
                              </Link>
                           }
                        </div>
                        <div onClick={handleLogout} className='p-2 flex gap-4 items-center cursor-pointer hover:text-[#ee3131] hover:bg-[#f6f6f6] text-gray-400 '>
                           <BiLogOutCircle />
                           <span className='text-sm'>Logout</span>
                        </div>

                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default memo(Header)
