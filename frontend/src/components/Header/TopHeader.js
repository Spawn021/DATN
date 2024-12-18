import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { getUserCurrent, clearMessage } from '../../redux/features/userSlice'
import path from '../../ultils/path'


const TopHeader = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { isLoggedIn, userData, message } = useSelector((state) => state.user) // user is name of reducer in store
   useEffect(() => {
      if (isLoggedIn) {
         const timeId = setTimeout(() => {
            dispatch(getUserCurrent())
         }, 200);
         return () => clearTimeout(timeId);
      }
   }, [dispatch, isLoggedIn]);

   useEffect(() => {
      if (message) {
         Swal.fire('Oops!', message, 'info').then(() => {
            dispatch(clearMessage())
            navigate(`/${path.LOGIN}`)
         })
      }
   }, [message])
   return (
      <div className='w-full h-[38px] bg-main flex items-center justify-center'>
         <div className='w-main flex items-center justify-between text-xs text-white'>
            <span className='pl-[10px]'>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
            {isLoggedIn && userData ? (
               <div className='flex gap-4'>
                  <div>{`Welcome, ${userData?.lastname} ${userData?.firstname}`} </div>
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
