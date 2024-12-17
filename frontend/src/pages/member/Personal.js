import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { toast } from 'react-toastify'
import { getUserCurrent } from '../../redux/features/userSlice'
import avatarDefault from '../../assets/avatar-default.png'
import { fileToBase64 } from '../../ultils/helpers'
import { InputForm, LoadSpinner } from '../../components'
import { apiUsers } from '../../redux/apis'
import { capitalizeFirstLetter } from '../../ultils/helpers'

const Personal = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm()
    const [preview, setPreview] = useState({
        avatar: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const avatar = watch('avatar')
        if (avatar && avatar.length > 0) {
            const allowedTypes = ['image/png', 'image/jpeg']
            const file = avatar[0]

            if (allowedTypes.includes(file.type)) {
                fileToBase64(file)
                    .then((result) => {
                        setPreview((prev) => ({ ...prev, avatar: result }))
                    })
                    .catch((error) => {
                    })
            } else {
                toast.error('File is not a valid PNG or JPG.')
            }
        }
    }, [watch('avatar')])

    useEffect(() => {
        reset({
            firstname: userData?.firstname,
            lastname: userData?.lastname,
            email: userData?.email,
            mobile: userData?.mobile,
        })
        setPreview((prev) => ({ ...prev, avatar: userData?.avatar || avatarDefault }))
    }, [userData])
    const handleUpdate = async (data) => {
        const formData = new FormData()
        if (data.avatar.length > 0) formData.append('avatar', data.avatar[0])
        else formData.append('avatar', '')
        delete data.avatar
        for (let i of Object.entries(data)) {
            formData.append(i[0], i[1])
        }
        setIsLoading(true)
        const response = await apiUsers.updateCurrent(formData)
        setIsLoading(false)
        if (response.success) {
            dispatch(getUserCurrent())
            toast.success('Update successfully')
        } else {
            toast.error('Update failed')
        }

    }

    return (
        <>
            {!isLoading ?
                <div className='w-3/4 mx-auto h-hp mt-4'>
                    <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                        <div className='w-full'>
                            <form onSubmit={handleSubmit(handleUpdate)}>
                                <div className='flex flex-col gap-3'>
                                    <div>
                                        <div className='text-sm font-medium text-gray-700'>Avatar</div>
                                        <div className='flex gap-3 flex-col justify-center items-center'>
                                            {preview.avatar && (
                                                <div className='w-[100px] h-[100px] bg-gray-200 flex items-center justify-center border-red-600 border-[1px] border-solid'>
                                                    <img
                                                        src={preview.avatar}
                                                        alt="avatar"
                                                        className="object-contain w-full h-full "
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <label htmlFor="avatar"
                                                    className="flex items-center bg-gray-800 hover:bg-gray-700 text-white text-sm px-2 py-1 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2 fill-white inline" viewBox="0 0 32 32">
                                                        <path
                                                            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                                            data-original="#000000" />
                                                        <path
                                                            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                                            data-original="#000000" />
                                                    </svg>
                                                    Upload
                                                    <input type="file" id='avatar' {...register('avatar')} className="hidden" />
                                                </label>
                                            </div>
                                        </div>

                                    </div>
                                    <InputForm
                                        label='Email'
                                        register={register}
                                        errors={errors}
                                        id={'email'}
                                        disabled={true}
                                    />
                                    <div className='flex items-center justify-between'>
                                        <div className='w-[49%]'>
                                            <InputForm
                                                label='Firstname'
                                                register={register}
                                                errors={errors}
                                                id={'firstname'}
                                                validate={{
                                                    required: 'This field is required',
                                                }}
                                            />
                                        </div>
                                        <div className='w-[49%]'>
                                            <InputForm
                                                label='Lastname'
                                                register={register}
                                                errors={errors}
                                                id={'lastname'}
                                                validate={{
                                                    required: 'This field is required',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <InputForm
                                        label='Phone'
                                        register={register}
                                        errors={errors}
                                        id={'mobile'}
                                        validate={{
                                            required: 'This field is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Invalid phone number. Number must be 9 digits'
                                            }
                                        }}
                                    />

                                    <div>
                                        <span className='text-sm font-medium text-gray-700'>Account status:</span>
                                        <span className='ml-2 text-sm'>{userData?.isBlocked ? 'Blocked' : 'Active'}</span>
                                    </div>
                                    <div>
                                        <span className='text-sm font-medium text-gray-700'>Role:</span>
                                        <span className='ml-2 text-sm'>{capitalizeFirstLetter(userData?.role)}</span>
                                    </div>
                                    <div>
                                        <span className='text-sm font-medium text-gray-700'>Created At:</span>
                                        <span className='ml-2 text-sm'>{moment(userData?.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                                <div className='text-end'>
                                    {isDirty && <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700'>Save</button>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                : <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />}
        </>
    )
}

export default Personal