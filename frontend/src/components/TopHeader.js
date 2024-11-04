import React, { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getUserCurrent, logout } from '../redux/features/userSlice'

import path from '../ultils/path'

const TopHeader = () => {
   const dispatch = useDispatch()
   const { isLoggedIn, userData } = useSelector((state) => state.user) // user is name of reducer in store
   console.log(isLoggedIn, userData)
   useEffect(() => {
      dispatch(getUserCurrent())
   }, [dispatch])

   return (
      <div className='h-[38px] w-full bg-main flex items-center justify-center'>
         <div className='w-main flex items-center justify-between text-xs text-white'>
            <span className='pl-[10px]'>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
            {isLoggedIn ? (
               <div className='flex gap-4'>
                  <div>{`Welcome, ${userData?.lastname} ${userData?.firstname}`} </div>
                  <div
                     className='hover:cursor-pointer'
                     onClick={() => {
                        dispatch(logout())
                     }}
                  >
                     Logout
                  </div>
               </div>
            ) : (
               <Link to={`/${path.LOGIN}`} className='hover:text-black'>
                  Sign In or Create Account
               </Link>
            )}
         </div>
      </div>
   )
}

export default memo(TopHeader)
