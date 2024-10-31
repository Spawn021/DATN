import React, { useCallback, useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import icons from '../../ultils/icons'
import { InputField, Button } from '../../components'
import { apiUsers } from '../../redux/apis'
import { login } from '../../redux/features/userSlice'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'

export default function Login() {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   // const location = useLocation()
   // console.log(location)
   const { FaFacebook, FaTwitter, FaGoogle, FaPinterest } = icons

   const [isRegistering, setIsRegistering] = useState(false)

   const handleRegisterClick = () => {
      setIsRegistering(true)
      setPayload({ email: '', password: '', firstname: '', lastname: '' })
   }

   const handleLoginClick = () => {
      setIsRegistering(false)
      setPayload({ email: '', password: '', firstname: '', lastname: '' })
   }

   const [payload, setPayload] = useState({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
   })
   const handleSubmit = useCallback(async () => {
      const { firstname, lastname, ...rest } = payload
      if (isRegistering) {
         const response = await apiUsers.register(payload)

         if (response.success) {
            Swal.fire('Congratulation!', response.message, 'success').then(() => {
               setIsRegistering(false)
               setPayload({ email: '', password: '', firstname: '', lastname: '' })
            })
         } else {
            Swal.fire('Error!', response.message, 'error')
         }
      } else {
         const response = await apiUsers.login(rest)

         if (response.success) {
            dispatch(login({ isLoggedIn: true, userData: response.userData, token: response.accessToken }))
            navigate(`/${path.HOME}`)
         } else {
            Swal.fire('Error!', response.message, 'error')
         }
      }
   }, [payload, isRegistering, dispatch, navigate]) // if dont add payload to dependency array, it will always log the initial state
   return (
      <div className='bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center min-h-screen'>
         <div className='bg-white rounded-[30px] shadow-lg w-[768px] max-w-full min-h-[480px] flex relative overflow-hidden'>
            <div
               className={`w-1/2 px-10 flex flex-col items-center justify-center h-full absolute top-0 ${
                  isRegistering ? 'right-0 animate-moveRight' : 'left-0 animate-moveLeft'
               }`}
            >
               <form className={`w-full flex flex-col items-center justify-center ${isRegistering ? 'block' : 'hidden'}`}>
                  <h1 className='text-[32px] font-bold'>Create Account</h1>
                  <div className='flex items-center justify-center py-5 gap-3'>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaFacebook />
                     </span>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaTwitter />
                     </span>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaGoogle />
                     </span>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaPinterest />
                     </span>
                  </div>
                  <span className='text-[12px]'>or use your email for registration</span>
                  <div className='flex items-center'>
                     <InputField
                        value={payload.firstname}
                        setValue={setPayload}
                        nameKey='firstname'
                        type='text'
                        className='outline-none w-full my-2 '
                     />
                     <InputField
                        value={payload.lastname}
                        setValue={setPayload}
                        nameKey='lastname'
                        type='text'
                        className='outline-none w-full my-2 '
                     />
                  </div>
                  <InputField
                     value={payload.email}
                     setValue={setPayload}
                     nameKey='email'
                     type='email'
                     className='outline-none w-full my-2 '
                  />
                  <InputField
                     value={payload.password}
                     setValue={setPayload}
                     nameKey='password'
                     type='password'
                     className='outline-none w-full my-2 '
                  />
                  <Button
                     name='Sign Up'
                     handleOnClick={handleSubmit}
                     className='bg-main border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                  />
               </form>

               {/* Nội dung Đăng Nhập */}
               <form className={`w-full flex flex-col items-center justify-center ${isRegistering ? 'hidden' : 'block'}`}>
                  <h1 className='text-[32px] font-bold'>Sign In</h1>
                  <div className='flex items-center justify-center py-5 gap-3'>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaFacebook />
                     </span>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaTwitter />
                     </span>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaGoogle />
                     </span>
                     <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                        <FaPinterest />
                     </span>
                  </div>
                  <span className='text-[12px]'>or use your email account</span>
                  <InputField
                     value={payload.email}
                     setValue={setPayload}
                     nameKey='email'
                     type='email'
                     className='outline-none w-full my-2 '
                  />
                  <InputField
                     value={payload.password}
                     setValue={setPayload}
                     nameKey='password'
                     type='password'
                     className='outline-none w-full my-2 '
                  />
                  <Link
                     to={`/${path.FORGET_PASSWORD}`}
                     className='underline hover:cursor-pointer text-[13px] font-normal my-[15px] hover:text-blue-500 '
                  >
                     Forgot Your Password?
                  </Link>
                  <Button
                     name='Sign In'
                     handleOnClick={handleSubmit}
                     className='bg-main border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                  />
                  <div className=' w-full text-right mt-6 text-[12px] text-blue-500'>
                     <Link to={`/${path.HOME}`}>Skip Login?</Link>
                  </div>
               </form>
            </div>

            <div
               className={`w-1/2 flex items-center justify-center flex-col bg-gradient-to-r from-[#c64545] to-main h-full transition-all duration-500 absolute top-0 ${
                  isRegistering
                     ? 'left-0 rounded-tr-[100px] rounded-br-[100px] animate-moveLeft'
                     : 'right-0 rounded-bl-[100px] rounded-tl-[100px] animate-moveRight'
               }`}
            >
               <div className={`px-[30px] flex items-center justify-center flex-col ${isRegistering ? 'block' : 'hidden'}`}>
                  <h1 className='text-[32px] font-bold text-white'>Welcome Back!</h1>
                  <p className='text-[14px] my-5 text-white leading-5 tracking-[0.3px] text-center'>
                     Enter your personal details to use all of site features
                  </p>
                  <button
                     onClick={handleLoginClick}
                     className='border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                  >
                     Sign In
                  </button>
               </div>
               <div className={`px-[30px] flex items-center justify-center flex-col ${isRegistering ? 'hidden' : 'block'}`}>
                  <h1 className='text-[32px] font-bold text-white'>Hello, Friend!</h1>
                  <p className='text-[14px] my-5 text-white leading-5 tracking-[0.3px] text-center'>
                     Register with your personal details to use all of site features
                  </p>
                  <button
                     onClick={handleRegisterClick}
                     className='border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                  >
                     Sign Up
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}
