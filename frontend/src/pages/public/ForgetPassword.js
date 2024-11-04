import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import OtpInput from 'react-otp-input'
import { Button, LoadSpinner } from '../../components'
import icons from '../../ultils/icons'
import SendEmailImage from '../../assets/send-email.png'
import OTPImage from '../../assets/otp.png'
import ResetPasswordImage from '../../assets/reset-password.png'
import DoneImage from '../../assets/done.jpg'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'
import { formatTime } from '../../ultils/helpers'
import { apiUsers } from '../../redux/apis'

const ForgetPassword = () => {
   const { IoKeyOutline, FaMinus, FaArrowLeft, MdEmail, MdLockOutline, LuBadgeCheck, FaEye, FaEyeSlash } = icons

   const [isEnterMail, setIsEnterMail] = useState(true)
   const [isEnterOTP, setIsEnterOTP] = useState(false)
   const [isEnterNewPassword, setIsEnterNewPassword] = useState(false)
   const [isDone, setIsDone] = useState(false)
   const [payload, setPayload] = useState({
      email: '',
      password: '',
      confirmPassword: '',
   })
   const [otp, setOtp] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   const [isEmailFilled, setIsEmailFilled] = useState(false)
   const [isPasswordFilled, setIsPasswordFilled] = useState(false)
   const [isConfirmPasswordFilled, setIsConfirmPasswordFilled] = useState(false)
   const [timer, setTimer] = useState(300)
   const [isLoading, setisLoading] = useState(false)

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
   }
   const isEmailValid = (email) => {
      const emailRegex = /^\S+@\S+\.\S+$/
      return emailRegex.test(email)
   }
   const isPasswordValid = (password) => {
      const minLength = 6
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumbers = /\d/.test(password)
      const hasSpecialChar = /[!@#$%^&*]/.test(password)
      const isValidLength = password.length >= minLength

      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isValidLength
   }

   useEffect(() => {
      let interval = null
      if (timer > 0) {
         interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
      } else if (timer === 0) {
         clearInterval(interval)
      }
      return () => clearInterval(interval)
   }, [timer])

   const handleResend = async () => {
      setOtp('')
      setisLoading(true)
      const response = await apiUsers.forgetPassword({ email: payload.email })
      setisLoading(false)
      setTimer(300)
      if (response.success) {
         Swal.fire('Success!', 'A new OTP has been sent to your email.', 'success')
      } else {
         Swal.fire('Error!', response.message, 'error')
      }
   }

   const handleSubmitOTP = async (e) => {
      e.preventDefault()
      const response = await apiUsers.verifyOTP({ email: payload.email, otp })
      if (response.success) {
         setIsEnterMail(false)
         setIsEnterOTP(false)
         setIsEnterNewPassword(true)
      } else {
         Swal.fire('Error!', response.message, 'error')
      }
   }

   const handleSubmitNewPassword = async () => {
      if (payload.password !== payload.confirmPassword) {
         return Swal.fire('Error!', 'Passwords do not match.', 'error')
      }
      if (!isPasswordValid(payload.password)) {
         return Swal.fire(
            'Error!',
            'Password must be at least 8 characters long and contain upper case, lower case, number, and special character.',
            'error',
         )
      }
      const response = await apiUsers.resetPassword({ email: payload.email, password: payload.password })
      if (response.success) {
         setIsEnterNewPassword(false)
         setIsDone(true)
         Swal.fire('Success!', 'Your password has been reset successfully!', 'success')
      } else {
         Swal.fire('Error!', response.message, 'error')
      }
   }

   const handleSubmitEmail = async () => {
      if (!isEmailValid(payload.email)) {
         return Swal.fire('Error!', 'Please enter a valid email address.', 'error')
      }
      setisLoading(true)
      const response = await apiUsers.forgetPassword({ email: payload.email })
      setisLoading(false)
      if (!response.success) return Swal.fire('Error!', response.message, 'error')
      setIsEnterMail(false)
      setIsEnterOTP(true)
      setTimer(300)
   }

   return (
      <div className='bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center min-h-screen'>
         {!isLoading ? (
            <div className='bg-white rounded-[30px] shadow-lg w-[768px] max-w-full min-h-[480px] flex relative overflow-hidden'>
               <div className='w-1/2 px-10 flex flex-col items-center h-full absolute top-0 left-0'>
                  <div className='flex mt-2'>
                     <FaMinus className={`text-4xl ${isEnterMail ? 'text-main' : ''}`} />
                     <FaMinus className={`text-4xl ${isEnterOTP ? 'text-main' : ''}`} />
                     <FaMinus className={`text-4xl ${isEnterNewPassword ? 'text-main' : ''}`} />
                     <FaMinus className={`text-4xl ${isDone ? 'text-main' : ''}`} />
                  </div>

                  {isEnterMail && (
                     <form className='w-full flex flex-col items-center justify-center mt-5'>
                        <IoKeyOutline className='text-[40px] text-main p-2 rounded-md border-2 border-main' />
                        <h1 className='text-[25px] font-bold mt-5'>Forgot Password</h1>
                        <span className='text-[12px] text-center mt-2 mb-5'>
                           Enter your email address and we will send you a link to reset your password.
                        </span>
                        <div className='relative w-full'>
                           {isEmailFilled && (
                              <div className='absolute text-[14px] text-blue-400 top-[-3px] font-medium left-[15px] bg-white animate-slide-top-sm'>
                                 Email
                              </div>
                           )}
                           <input
                              type='email'
                              placeholder='Email'
                              className='rounded-[8px] py-[10px] px-[15px] text-[13px] border outline-none w-full my-2'
                              onChange={(e) => {
                                 const value = e.target.value
                                 setPayload({ ...payload, email: value })
                                 setIsEmailFilled(value.length > 0)
                              }}
                           />
                        </div>
                        <Button
                           name='Send Mail'
                           handleOnClick={handleSubmitEmail}
                           className='bg-main border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                        />
                     </form>
                  )}

                  {isEnterOTP && (
                     <form className='w-full flex flex-col items-center justify-center mt-5'>
                        <MdEmail className='text-[40px] text-main p-2 rounded-md border-2 border-main' />
                        <h1 className='text-[25px] font-bold mt-5'>Password Reset</h1>
                        <span className='text-[12px] text-center mt-2 mb-2'>
                           We sent a code to
                           <p className='font-semibold hover:underline'>{payload.email}</p> Please check your email and enter the code
                           below.
                        </span>
                        <p className='text-blue-500 text-[14px] mb-3'>{formatTime(timer)}</p>

                        <OtpInput
                           value={otp}
                           onChange={setOtp}
                           numInputs={4}
                           renderInput={(props) => (
                              <input
                                 {...props}
                                 className='outline-blue-500'
                                 onInput={(e) => {
                                    if (!/^\d*$/.test(e.target.value)) {
                                       e.target.value = e.target.value.replace(/[^\d]/g, '')
                                    }
                                 }}
                              />
                           )}
                           inputStyle={{
                              width: '50px',
                              height: '50px',
                              fontSize: '20px',
                              borderRadius: '8px',
                              border: '1px solid black',
                              margin: '0 5px',
                           }}
                        />

                        <div className='text-[12px] my-4'>
                           <span>Didn't receive the code? </span>
                           <span className='hover:underline hover:cursor-pointer text-blue-500' onClick={handleResend}>
                              Resend
                           </span>
                        </div>

                        <button
                           type='submit'
                           onClick={handleSubmitOTP}
                           className='bg-main border w-1/2 text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold 
                         hover:bg-[#ee3131cc]'
                        >
                           Continue
                        </button>
                     </form>
                  )}

                  {isEnterNewPassword && (
                     <form className='w-full flex flex-col items-center justify-center mt-5'>
                        <MdLockOutline className='text-[40px] text-main p-2 rounded-md border-2 border-main' />
                        <h1 className='text-[25px] font-bold mt-5'>Set new password</h1>
                        <span className='text-[12px] text-center mt-2 mb-5'>
                           Your new password must be different from previously used passwords.
                        </span>
                        <div onClick={togglePasswordVisibility} className='cursor-pointer w-full flex justify-end'>
                           {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                        <div className='relative w-full'>
                           {isPasswordFilled && (
                              <div className='absolute text-[14px] text-blue-400 top-[-3px] font-medium left-[15px] bg-white animate-slide-top-sm'>
                                 Password
                              </div>
                           )}
                           <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder='Password, ex: Abc@123'
                              className='rounded-[8px] py-[10px] px-[15px] text-[13px] border outline-none w-full my-2'
                              onChange={(e) => {
                                 const value = e.target.value
                                 setPayload({ ...payload, password: value })
                                 setIsPasswordFilled(value.length > 0)
                              }}
                           />
                        </div>
                        <div className='relative w-full'>
                           {isConfirmPasswordFilled && (
                              <div className='absolute text-[14px] text-blue-400 top-[-3px] font-medium left-[15px] bg-white animate-slide-top-sm'>
                                 Confirm Password
                              </div>
                           )}
                           <input
                              type='password'
                              placeholder='Confirm Password'
                              className='rounded-[8px] py-[10px] px-[15px] text-[13px] border outline-none w-full my-2'
                              onChange={(e) => {
                                 const value = e.target.value
                                 setPayload({ ...payload, confirmPassword: value })
                                 setIsConfirmPasswordFilled(value.length > 0)
                              }}
                           />
                        </div>
                        <Button
                           name='Reset Password'
                           handleOnClick={handleSubmitNewPassword}
                           className='bg-main border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                        />
                     </form>
                  )}

                  {isDone && (
                     <form className='w-full flex flex-col items-center justify-center mt-5'>
                        <LuBadgeCheck className='text-[40px] text-main p-2 rounded-md border-2 border-main' />
                        <h1 className='text-[25px] font-bold mt-5'>All Done!</h1>
                        <span className='text-[12px] text-center mt-2 mb-5'>
                           Your password has been successfully reset. You can now login with your new password.
                        </span>
                     </form>
                  )}
                  <Link to={`/${path.LOGIN}`} className='flex items-center justify-center mt-4 gap-2 text-[13px] text-[#551A8B] '>
                     <FaArrowLeft />
                     <span className='hover:underline hover:text-blue-500'>Back to login</span>
                  </Link>
               </div>
               <div className='w-1/2 absolute top-0 right-0 h-full'>
                  {isEnterMail && <img src={SendEmailImage} alt='send-email' className=' h-full object-cover' />}
                  {isEnterOTP && <img src={OTPImage} alt='otp' className=' h-full object-cover' />}
                  {isEnterNewPassword && (
                     <>
                        <img src={ResetPasswordImage} alt='reset-password' className=' h-full object-cover' />
                        <div className='absolute top-0 left-0 w-full h-full bg-[#40aba5a3]'></div>
                     </>
                  )}
                  {isDone && (
                     <>
                        <img src={DoneImage} alt='done' className=' h-full object-cover relavtive' />
                        <div className='absolute top-0 left-0 w-full h-full bg-[#3d5cd6a3]'></div>
                     </>
                  )}
               </div>
            </div>
         ) : (
            <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />
         )}
      </div>
   )
}

export default ForgetPassword
