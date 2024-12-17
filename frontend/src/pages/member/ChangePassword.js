import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import icons from '../../ultils/icons'
import { toast } from 'react-toastify'
import { logout } from '../../redux/features/userSlice'
import { apiUsers } from '../../redux/apis'

const ChangePassword = () => {
    const { FaEye, FaEyeSlash } = icons;
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const newPassword = watch('newPassword')
    // State để quản lý hiển thị của từng trường mật khẩu
    const [showPassword, setShowPassword] = useState({
        password: false,
        newPassword: false,
        confirmPassword: false,
    })

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    const handleUpdate = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to change your password?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { confirmPassword, ...rest } = data
                const response = await apiUsers.changePassword(rest)
                if (response.success) {
                    toast.success(`${response.message}. You will be logged out in 10 seconds.`);
                    setTimeout(() => {
                        dispatch(logout());
                        toast.info("Session expired. Please log in again.");
                    }, 10000);
                } else {
                    toast.error(response.message)
                }
            }
        })
    }

    return (
        <div className='w-3/4 mx-auto h-hp mt-4'>
            <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                <div className='w-full'>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
                                <div className='relative'>
                                    <input
                                        id='password'
                                        type={showPassword.password ? 'text' : 'password'}
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                            validate: {
                                                hasNumber: (value) =>
                                                    /\d/.test(value) || 'Password requires a number',
                                                hasLowercase: (value) =>
                                                    /[a-z]/.test(value) || 'Password requires a lowercase letter',
                                                hasUppercase: (value) =>
                                                    /[A-Z]/.test(value) || 'Password requires an uppercase letter',
                                                hasSymbol: (value) =>
                                                    /[^\w]/.test(value) || 'Password requires a symbol',
                                            },
                                        })}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    />
                                    <div
                                        className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
                                        onClick={() => togglePasswordVisibility('password')}
                                    >
                                        {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
                                {errors.password && <span className='text-red-500 text-xs'>{errors.password.message}</span>}
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700'>New Password</label>
                                <div className='relative'>
                                    <input
                                        id='newPassword'
                                        type={showPassword.newPassword ? 'text' : 'password'}
                                        {...register('newPassword', {
                                            required: 'New password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                            validate: {
                                                hasNumber: (value) =>
                                                    /\d/.test(value) || 'Password requires a number',
                                                hasLowercase: (value) =>
                                                    /[a-z]/.test(value) || 'Password requires a lowercase letter',
                                                hasUppercase: (value) =>
                                                    /[A-Z]/.test(value) || 'Password requires an uppercase letter',
                                                hasSymbol: (value) =>
                                                    /[^\w]/.test(value) || 'Password requires a symbol',
                                            },
                                        })}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    />
                                    <div
                                        className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
                                        onClick={() => togglePasswordVisibility('newPassword')}
                                    >
                                        {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
                                {errors.newPassword && <span className='text-red-500 text-xs'>{errors.newPassword.message}</span>}
                            </div>

                            {/* Confirm Password */}
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>Confirm Password</label>
                                <div className='relative'>
                                    <input
                                        id='confirmPassword'
                                        type={showPassword.confirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword', {
                                            required: 'Confirm password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                            validate: {
                                                hasNumber: (value) =>
                                                    /\d/.test(value) || 'Password requires a number',
                                                hasLowercase: (value) =>
                                                    /[a-z]/.test(value) || 'Password requires a lowercase letter',
                                                hasUppercase: (value) =>
                                                    /[A-Z]/.test(value) || 'Password requires an uppercase letter',
                                                hasSymbol: (value) =>
                                                    /[^\w]/.test(value) || 'Password requires a symbol',
                                                matchesNewPassword: (value) =>
                                                    value === newPassword || 'Passwords do not match',
                                            },
                                        })}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    />
                                    <div
                                        className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                    >
                                        {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
                                {errors.confirmPassword && <span className='text-red-500 text-xs'>{errors.confirmPassword.message}</span>}
                            </div>
                            <div className='flex justify-center'>
                                <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700'>Update</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
