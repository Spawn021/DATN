import React, { memo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { InputForm } from '../../components'
import { showModal } from '../../redux/features/modalSlice'
import { apiUsers } from '../../redux/apis'

const Address = ({ addressData, onSave, addresses }) => {

    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors, isDirty }, reset, setValue } = useForm()
    useEffect(() => {
        if (addressData) {
            reset({
                name: addressData.name,
                phone: addressData.phone,
                addressLine1: addressData.addressLine1,
                city: addressData.city,
                state: addressData.state,
                country: addressData.country,
                postalCode: addressData.postalCode,
                isDefault: addressData.isDefault
            })
        }
        else if (addresses?.length === 0) {
            setValue('isDefault', true);
        }
    }, [addressData])
    const handleSave = async (data) => {
        if (addressData) {
            const response = await apiUsers.updateAddress(addressData._id, data)
            if (response.success) {
                toast.success('Update address successfully')
                dispatch(showModal({ isShowModal: false, modalContent: null }))
                onSave()
            }
        } else {
            const response = await apiUsers.addAddress(data)
            if (response.success) {
                toast.success('Add address successfully')
                dispatch(showModal({ isShowModal: false, modalContent: null }))
                onSave()
            }
        }
    }
    const isFirstAddress = addresses?.length === 0
    const isEditingSingleAddress = addresses?.length === 1 && addressData
    const isCurrentAddressDefault = addressData?.isDefault
    return (
        <div onClick={e => e.stopPropagation()} className='bg-white rounded shadow-lg w-[564px] gap-5 max-w-full h-[556px] p-4 '>
            <form onSubmit={handleSubmit(handleSave)} className='flex flex-col h-full'>
                <h2 className='text-lg font-medium'>{addressData ? 'Edit Address' : 'Add New Address'}</h2>
                <div className='w-full flex flex-col gap-3 mt-3 justify-between h-full'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-4 justify-between'>
                            <div className='w-1/2'>
                                <InputForm
                                    label='Name'
                                    register={register}
                                    errors={errors}
                                    id={'name'}
                                    validate={{ required: 'This field is required' }}
                                    placeholder={'Enter name'}
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputForm
                                    label='Phone'
                                    register={register}
                                    errors={errors}
                                    id={'phone'}
                                    validate={{ required: 'This field is required' }}
                                    placeholder={'Enter phone'}
                                />
                            </div>

                        </div>
                        <InputForm
                            label='Address'
                            register={register}
                            errors={errors}
                            id={'addressLine1'}
                            validate={{ required: 'This field is required' }}
                            placeholder={'Enter address'}
                        />
                        <div className='flex gap-4 justify-between'>
                            <div className='w-1/2'>
                                <InputForm
                                    label='City'
                                    register={register}
                                    errors={errors}
                                    id={'city'}
                                    validate={{ required: 'This field is required' }}
                                    placeholder={'Enter city'}
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputForm
                                    label='State'
                                    register={register}
                                    errors={errors}
                                    id={'state'}
                                    validate={{ required: 'This field is required' }}
                                    placeholder={'Enter state'}
                                />
                            </div>
                        </div>
                        <div className='flex gap-4 justify-between'>
                            <div className='w-1/2'>
                                <InputForm
                                    label='Country'
                                    register={register}
                                    errors={errors}
                                    id={'country'}
                                    validate={{ required: 'This field is required' }}
                                    placeholder={'Enter country'}
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputForm
                                    label='Postal Code'
                                    register={register}
                                    errors={errors}
                                    id={'postalCode'}
                                    validate={{ required: 'This field is required' }}
                                    placeholder={'Enter postal code'}
                                />
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-4 group relative'>
                                <input
                                    id='isDefault'
                                    type='checkbox'
                                    {...register('isDefault')}
                                    disabled={isCurrentAddressDefault || isEditingSingleAddress || isFirstAddress}

                                />
                                <label htmlFor='isDefault' className='text-sm font-medium text-gray-700 hover:cursor-pointer'>
                                    Set as default
                                </label>
                                {(isFirstAddress || isEditingSingleAddress) && (<div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2 w-40'>
                                    The first address is set as the default. Please add a second address to change this setting.
                                </div>)}
                                {isCurrentAddressDefault && (
                                    <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2 w-40'>
                                        This address is already set as the default. Please select another address as the default.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div>
                            <button onClick={() => dispatch(showModal({ isShowModal: false, modalContent: null }))} type='button' className='border border-gray-300 px-4 py-2 rounded-md mr-2 hover:bg-gray-50'>Cancel</button>
                            <button
                                type='submit'
                                className={`bg-main text-white px-4 py-2 rounded-md ${!isDirty ? 'cursor-not-allowed' : 'hover:bg-red-700 '}`}
                                disabled={!isDirty}
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

export default memo(Address)