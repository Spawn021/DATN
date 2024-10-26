import React, { useCallback, useState } from 'react'
import icons from '../../ultils/icons'
import { InputField, Button } from '../../components'

export default function Login() {
   const { FaFacebook, FaTwitter, FaGoogle, FaPinterest } = icons

   const [isRegistering, setIsRegistering] = useState(true)
   const handleRegisterClick = () => setIsRegistering(false)
   const handleLoginClick = () => setIsRegistering(true)

   const [payload, setPayload] = useState({
      email: '',
      password: '',
      name: '',
   })
   const handleSubmit = useCallback(() => {
      console.log(payload)
   }, [payload])
   return (
      <div className='bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center min-h-screen'>
         <div className='bg-white rounded-[30px] shadow-lg w-[768px] max-w-full min-h-[480px] flex relative overflow-hidden'>
            <div
               className={`w-1/2 px-10 flex flex-col items-center justify-center h-full absolute top-0 ${
                  isRegistering ? 'left-0 animate-moveLeft' : 'right-0 animate-moveRight'
               }`}
            >
               <form className={`w-full flex flex-col items-center justify-center ${isRegistering ? 'hidden' : 'block'}`}>
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
                  <InputField value={payload.name} setValue={setPayload} nameKey='name' type='text' className='outline-none w-full my-2 ' />
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
               <form className={`w-full flex flex-col items-center justify-center ${isRegistering ? 'block' : 'hidden'}`}>
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
                  <div className='underline hover:cursor-pointer text-[13px] font-normal my-[15px] hover:text-blue-500'>
                     Forgot Your Password?
                  </div>
                  <Button
                     name='Sign In'
                     handleOnClick={handleSubmit}
                     className='bg-main border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                  />
               </form>
            </div>

            <div
               className={`w-1/2 flex items-center justify-center flex-col bg-gradient-to-r from-[#c64545] to-main h-full transition-all duration-500 absolute top-0 ${
                  isRegistering
                     ? 'right-0 rounded-bl-[100px] rounded-tl-[100px] animate-moveRight'
                     : 'left-0 rounded-tr-[100px] rounded-br-[100px] animate-moveLeft'
               }`}
            >
               <div className={`px-[30px] flex items-center justify-center flex-col ${isRegistering ? 'hidden' : 'block'}`}>
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
               <div className={`px-[30px] flex items-center justify-center flex-col ${isRegistering ? 'block' : 'hidden'}`}>
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
