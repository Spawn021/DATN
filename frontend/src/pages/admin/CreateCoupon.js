import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { showModal } from '../../redux/features/modalSlice'
import { InputForm, Select } from '../../components'
import { apiCoupons } from '../../redux/apis'
import { couponType } from '../../ultils/constants'

const CreateCoupon = ({ onSave }) => {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm()
    const handleSave = async (data) => {
        const response = await apiCoupons.createCoupon(data)
        if (response.success) {
            toast.success('Create coupon successfully')
            dispatch(showModal({ isShowModal: false, modalContent: null }))
            onSave()
        }
    }
    return (
        <div onClick={e => e.stopPropagation()} className='bg-white rounded shadow-lg w-[564px] gap-5 max-w-full h-[556px] p-4 '>
            <form onSubmit={handleSubmit(handleSave)} className='flex flex-col h-full'>
                <h2 className='text-lg font-medium'>Add New Coupon</h2>
                <div className='w-full flex flex-col gap-3 mt-3 justify-between h-full'>
                    <div className='flex flex-col gap-4'>
                        <InputForm
                            label='Code'
                            register={register}
                            errors={errors}
                            id={'code'}
                            validate={{ required: 'This field is required' }}
                            placeholder={'Enter code'}
                        />
                        <div className='flex gap-4 justify-between'>
                            <div className='w-1/2'>
                                <Select
                                    label={'Discount Type'}
                                    register={register}
                                    errors={errors}
                                    id={'discountType'}
                                    options={couponType}
                                    validate={{ required: 'Discount type is required' }}
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputForm
                                    label='Discount Value'
                                    register={register}
                                    errors={errors}
                                    id={'discountValue'}
                                    validate={{
                                        required: 'Discount value is required',
                                        validate: (value) => {
                                            const discountType = getValues('discountType'); // Lấy giá trị của discountType
                                            if (discountType === 'percentage' && value >= 100) {
                                                return 'Discount value must be less than 100 for percentage type';
                                            }
                                            return true;
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <InputForm
                            label='Expiry'
                            type='number'
                            register={register}
                            errors={errors}
                            id={'expiry'}
                            validate={{
                                required: 'Expiry is required',
                                min: {
                                    value: 1,
                                    message: 'Expiry must be greater than 0',
                                },
                            }}
                        />
                        <InputForm
                            label='Usage Limit'
                            type='number'
                            register={register}
                            errors={errors}
                            id={'usageLimit'}
                            validate={{
                                required: 'Usage limit is required',
                                min: {
                                    value: 1,
                                    message: 'Usage limit must be greater than 0',
                                }

                            }}
                        />
                    </div>
                    <div className='flex justify-end'>
                        <div>
                            <button onClick={() => dispatch(showModal({ isShowModal: false, modalContent: null }))} type='button' className='border border-gray-300 px-4 py-2 rounded-md mr-2 hover:bg-gray-50'>Cancel</button>
                            <button
                                type='submit'
                                className='bg-main text-white px-4 py-2 rounded-md hover:bg-red-700'

                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateCoupon