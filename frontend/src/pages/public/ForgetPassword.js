import React, { useState, useEffect } from 'react'
import { InputField, Button } from '../../components'
import icons from '../../ultils/icons'
import SendEmailImage from '../../assets/send-email.png'
import OTPImage from '../../assets/otp.png'
import ResetPasswordImage from '../../assets/reset-password.png'
import DoneImage from '../../assets/done.jpg'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'
import { formatTime } from '../../ultils/helpers'
import { apiUsers } from '../../redux/apis'
import Swal from 'sweetalert2'

const ForgetPassword = () => {
   const { IoKeyOutline, FaMinus, FaArrowLeft, MdEmail, MdLockOutline, LuBadgeCheck } = icons

   const [isEnterMail, setIsEnterMail] = useState(true)
   const [isEnterOTP, setIsEnterOTP] = useState(false)
   const [isEnterNewPassword, setIsEnterNewPassword] = useState(false)
   const [isDone, setIsDone] = useState(false)
   const [payload, setPayload] = useState({
      email: '',
      password: '',
      confirmPassword: '',
   })

   const [otp, setOtp] = useState(['', '', '', ''])
   const [otpEntered, setOtpEntered] = useState(false)
   const [timer, setTimer] = useState(300)

   useEffect(() => {
      const isFilled = otp.every((value) => value !== '')
      setOtpEntered(isFilled)
   }, [otp])

   useEffect(() => {
      let interval = null
      if (timer > 0) {
         interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
      } else if (timer === 0) {
         clearInterval(interval)
      }
      return () => clearInterval(interval)
   }, [timer])

   const handleOTPInput = (value, index) => {
      if (/[^0-9]/.test(value)) return // Chỉ cho phép nhập số
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Chuyển sang ô nhập tiếp theo hoặc ô nhập trước đó
      if (value && index < 3) {
         document.getElementById(`otp-input-${index + 1}`).focus()
      }
      if (!value && index > 0) {
         document.getElementById(`otp-input-${index - 1}`).focus()
      }
   }

   const handleResend = async () => {
      setTimer(300)
      setOtp(new Array(4).fill(''))
      const response = await apiUsers.forgetPassword({ email: payload.email })
      //  setTimer(300)
      if (response.success) {
         Swal.fire('Success!', 'A new OTP has been sent to your email.', 'success')
      } else {
         Swal.fire('Error!', response.message, 'error')
      }
   }

   const handleSubmitEmail = async () => {
      const response = await apiUsers.forgetPassword({ email: payload.email })
      if (!response.success) return Swal.fire('Error!', response.message, 'error')
      setIsEnterMail(false)
      setIsEnterOTP(true)
      setTimer(300)
   }

   const handleSubmitOTP = async (e) => {
      e.preventDefault()
      const otpCode = otp.join('')
      console.log(otpCode)
      console.log(payload.email)
      const response = await apiUsers.verifyOTP({ email: payload.email, otp: otpCode })
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
      const response = await apiUsers.resetPassword({ email: payload.email, password: payload.password })
      if (response.success) {
         setIsEnterNewPassword(false)
         setIsDone(true)
         Swal.fire('Success!', 'Your password has been reset successfully!', 'success')
      } else {
         Swal.fire('Error!', response.message, 'error')
      }
   }

   return (
      <div className='bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center min-h-screen'>
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
                     <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        type='email'
                        className='outline-none w-full my-2'
                     />
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
                        <p className='font-semibold hover:underline'>{payload.email}</p> Please check your email and enter the code below.
                     </span>
                     <p className='text-blue-500 text-[14px] mb-3'>{formatTime(timer)}</p>
                     <div className='flex items-center justify-center w-full gap-2'>
                        {otp.map((value, index) => (
                           <input
                              key={index}
                              id={`otp-input-${index}`}
                              type='text'
                              maxLength='1'
                              value={value}
                              autoFocus={index === 0}
                              onChange={(e) => handleOTPInput(e.target.value, index)}
                              className='border w-10 h-10 text-center text-[20px] font-semibold rounded-md outline-blue-500'
                           />
                        ))}
                     </div>
                     <div className='text-[12px] mt-2'>
                        <span>Didn't receive the code? </span>
                        <span className='hover:underline hover:cursor-pointer text-blue-500' onClick={handleResend}>
                           Resend
                        </span>
                     </div>

                     <button
                        type='submit'
                        onClick={handleSubmitOTP}
                        className={`bg-main border w-1/2 text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold ${
                           !otpEntered ? 'disabled:opacity-30' : 'hover:bg-[#ee3131cc]'
                        }`}
                        disabled={!otpEntered}
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
                     <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        className='outline-none w-full my-2'
                     />
                     <InputField
                        value={payload.confirmPassword}
                        setValue={setPayload}
                        nameKey='confirmPassword'
                        type='password'
                        className='outline-none w-full my-2'
                     />
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
      </div>
   )
}

export default ForgetPassword
