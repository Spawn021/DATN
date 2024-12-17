import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { LoadSpinner } from '../../components'
import icons from '../../ultils/icons'
import { InputField, Button } from '../../components'
import { apiUsers } from '../../redux/apis'
import { login } from '../../redux/features/userSlice'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'

export default function Login() {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const { FaFacebook, FaGoogle, FaEye, FaEyeSlash } = icons
   const [isLoading, setIsLoading] = useState(false)

   const [isRegistering, setIsRegistering] = useState(false)
   const handleRegisterClick = () => {
      setIsRegistering(true)
   }
   const handleLoginClick = () => {
      setIsRegistering(false)
   }
   const validationSchemaLogin = Yup.object({
      email: Yup.string().email('Invalid email format. Ex: abc@gmail.com').required('Email is required'),
      password: Yup.string()
         .min(6, 'Password must be at least 6 characters')
         .matches(/[0-9]/, 'Password requires a number')
         .matches(/[a-z]/, 'Password requires a lowercase letter')
         .matches(/[A-Z]/, 'Password requires an uppercase letter')
         .matches(/[^\w]/, 'Password requires a symbol')
         .required('Password is required'),
   })
   const validationSchemaRegister = Yup.object({
      firstname: Yup.string().required('First name is required'),
      lastname: Yup.string().required('Last name is required'),
      mobile: Yup.string().
         required('Phone number is required')
         .matches(/^[0-9]+$/, 'Phone number must be a number')
         .min(10, 'Phone number must be at least 10 characters'),
      email: Yup.string().email('Invalid email format. Ex: abc@gmail.com').required('Email is required'),
      password: Yup.string()
         .min(6, 'Password must be at least 6 characters')
         .matches(/[0-9]/, 'Password requires a number')
         .matches(/[a-z]/, 'Password requires a lowercase letter')
         .matches(/[A-Z]/, 'Password requires an uppercase letter')
         .matches(/[^\w]/, 'Password requires a symbol')
         .required('Password is required'),
      confirmPassword: Yup.string()
         .oneOf([Yup.ref('password'), null], 'Passwords must match')
         .required('Confirm password is required'),
   })
   const formikLogin = useFormik({
      initialValues: {
         email: '',
         password: '',
      },
      validationSchema: validationSchemaLogin,
      onSubmit: async (values) => {
         const response = await apiUsers.login(values)
         if (response.success) {
            dispatch(login({ isLoggedIn: true, userData: response.userData, token: response.accessToken })) // save user data to redux
            navigate(`/${path.HOME}`)
         } else {
            Swal.fire('Error!', response.message, 'error')
         }
      },
   })

   const formikRegister = useFormik({
      initialValues: {
         firstname: '',
         lastname: '',
         mobile: '',
         email: '',
         password: '',
         confirmPassword: '',
      },
      validationSchema: validationSchemaRegister,
      onSubmit: async (values) => {
         const { confirmPassword, ...data } = values
         console.log(data)
         setIsLoading(true)
         const response = await apiUsers.register(data)
         setIsLoading(false)
         if (response.success) {
            Swal.fire('Congratulation!', response.message, 'success').then(() => {
               setIsRegistering(false)
               formikRegister.resetForm()
            })
         } else {
            Swal.fire('Error!', response.message, 'error')
         }
      },
   })
   const [showPasswordLogin, setShowPasswordLogin] = useState(false)
   const [showPasswordRegister, setShowPasswordRegister] = useState(false)
   const togglePasswordLoginVisibility = () => {
      setShowPasswordLogin(!showPasswordLogin)
   }
   const togglePasswordRegisterVisibility = () => {
      setShowPasswordRegister(!showPasswordRegister)
   }
   return (
      <div className='bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center min-h-screen'>
         {!isLoading ? (
            <div className='bg-white rounded-[30px] shadow-lg w-[768px] max-w-full min-h-[600px] flex relative overflow-hidden'>
               <div
                  className={`w-1/2 px-10 flex flex-col items-center justify-center h-full absolute top-0 ${isRegistering ? 'right-0 animate-moveRight' : 'left-0 animate-moveLeft'
                     }`}
               >
                  <form
                     onSubmit={formikRegister.handleSubmit}
                     className={`w-full flex flex-col items-center justify-center ${isRegistering ? 'block' : 'hidden'}`}
                  >
                     <h1 className='text-[32px] font-bold mb-2'>Create Account</h1>

                     <div className='flex items-center gap-2'>
                        <InputField
                           nameKey='firstname'
                           placeholder={'First Name'}
                           label={'First Name'}
                           value={formikRegister.values.firstname}
                           handleChange={formikRegister.handleChange}
                           error={formikRegister.touched.firstname && formikRegister.errors.firstname}
                           className='outline-none w-full my-2  '
                        />
                        <InputField
                           nameKey='lastname'
                           placeholder={'Last Name'}
                           label={'Last Name'}
                           value={formikRegister.values.lastname}
                           handleChange={formikRegister.handleChange}
                           error={formikRegister.touched.lastname && formikRegister.errors.lastname}
                           className='outline-none w-full my-2 '
                        />
                     </div>
                     <InputField
                        nameKey='mobile'
                        placeholder={'Phone Number'}
                        label={'Phone Number'}
                        value={formikRegister.values.mobile}
                        handleChange={formikRegister.handleChange}
                        error={formikRegister.touched.mobile && formikRegister.errors.mobile}
                        className='outline-none w-full my-2 '
                     />
                     <InputField
                        nameKey='email'
                        placeholder={'Email'}
                        label={'Email'}
                        value={formikRegister.values.email}
                        handleChange={formikRegister.handleChange}
                        error={formikRegister.touched.email && formikRegister.errors.email}
                        className='outline-none w-full mt-2 '
                     />
                     <div onClick={togglePasswordRegisterVisibility} className='cursor-pointer w-full flex justify-end'>
                        {showPasswordRegister ? <FaEye /> : <FaEyeSlash />}
                     </div>
                     <InputField
                        nameKey='password'
                        type={showPasswordRegister ? 'text' : 'password'}
                        placeholder={'Password, ex: Abc@123'}
                        label={'Password'}
                        value={formikRegister.values.password}
                        handleChange={formikRegister.handleChange}
                        error={formikRegister.touched.password && formikRegister.errors.password}
                        className='outline-none w-full my-2 '
                     />
                     <InputField
                        nameKey='confirmPassword'
                        placeholder={'Confirm Password'}
                        label={'Confirm Password'}
                        type='password'
                        value={formikRegister.values.confirmPassword}
                        handleChange={formikRegister.handleChange}
                        error={formikRegister.touched.confirmPassword && formikRegister.errors.confirmPassword}
                        className='outline-none w-full my-2'
                     />
                     <Button
                        name='Sign Up'
                        type='submit'
                        className='bg-main border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                     />
                  </form>

                  <form
                     onSubmit={formikLogin.handleSubmit}
                     className={`w-full flex flex-col items-center justify-center ${isRegistering ? 'hidden' : 'block'}`}
                  >
                     <h1 className='text-[32px] font-bold'>Sign In</h1>
                     <div className='flex items-center justify-center py-5 gap-3'>
                        <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                           <FaFacebook />
                        </span>
                        <span className='border rounded-[20%] p-3 hover:cursor-pointer'>
                           <FaGoogle />
                        </span>
                     </div>
                     <span className='text-[12px]'>or use your email account</span>
                     <InputField
                        nameKey='email'
                        placeholder={'Email'}
                        label={'Email'}
                        value={formikLogin.values.email}
                        handleChange={formikLogin.handleChange}
                        error={formikLogin.touched.email && formikLogin.errors.email}
                        className='outline-none w-full mt-2 '
                     />
                     <div onClick={togglePasswordLoginVisibility} className='cursor-pointer w-full flex justify-end'>
                        {showPasswordLogin ? <FaEye /> : <FaEyeSlash />}
                     </div>
                     <InputField
                        nameKey='password'
                        placeholder={'Password, ex: Abc@123'}
                        label={'Password'}
                        type={showPasswordLogin ? 'text' : 'password'}
                        value={formikLogin.values.password}
                        handleChange={formikLogin.handleChange}
                        error={formikLogin.touched.password && formikLogin.errors.password}
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
                        type='submit'
                        className='bg-main border text-white uppercase text-[13px] px-[45px] py-[10px] rounded-[8px] mt-[10px] font-semibold hover:bg-[#ee3131cc]'
                     />
                     <div className=' w-full text-right mt-6 text-[12px] text-blue-500'>
                        <Link to={`/${path.HOME}`}>Skip Login?</Link>
                     </div>
                  </form>
               </div>

               <div
                  className={`w-1/2 flex items-center justify-center flex-col bg-gradient-to-r from-[#c64545] to-main h-full transition-all duration-500 absolute top-0 ${isRegistering
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
         ) : (
            <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />
         )}
      </div>
   )
}
