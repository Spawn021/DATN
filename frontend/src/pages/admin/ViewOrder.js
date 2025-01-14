import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { InputForm, Select, LoadSpinner } from '../../components';
import { formatPrice } from '../../ultils/helpers';
import { orderStatusAdmin } from '../../ultils/constants';
import { apiOrders } from '../../redux/apis';

const ViewOrder = ({ viewOrder, setViewOrder, render }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(viewOrder?.status);
    const { register, formState: { errors }, reset, watch, handleSubmit } = useForm()
    const selectedStatus = watch('status');

    useEffect(() => {
        const address = viewOrder?.address;

        reset({
            name: address.name,
            phone: address.phone,
            addressLine1: address.addressLine1,
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
            status: viewOrder?.status,
        });
        setCurrentStatus(viewOrder?.status);
    }, [viewOrder]);

    const getFilteredOptions = () => {
        if (currentStatus === 'Pending') {
            return orderStatusAdmin.filter((status) => status.value !== 'Completed');
        } else if (currentStatus === 'Processing') {
            return orderStatusAdmin.filter((status) => status.value !== 'Pending');
        }
        return orderStatusAdmin;
    };

    const isCanceled = currentStatus === 'Cancelled';
    const isCompleted = currentStatus === 'Completed';
    const isPending = currentStatus === 'Pending';
    const isProcessing = currentStatus === 'Processing';
    const shouldShowNoteAndSaveButton = (isPending && selectedStatus !== 'Pending') || (!isPending && !isCanceled && !isCompleted)


    const handleSave = async (data) => {
        const { status, note } = data
        if (status === 'Cancelled') {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this order!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, cancel it!',
                cancelButtonText: 'No, keep it',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoading(true);
                    const response = await apiOrders.updateStatusOrder(viewOrder?._id, { status, note });
                    setIsLoading(false);
                    if (response.success) {
                        toast.success(response.message);
                        setViewOrder(null);
                        render();
                    }
                }
            })
        } else {
            setIsLoading(true);
            const response = await apiOrders.updateStatusOrder(viewOrder?._id, { status, note });
            setIsLoading(false);
            if (response.success) {
                toast.success(response.message);
                setViewOrder(null);
                render();
            }
        }

    };

    return (
        <>
            {!isLoading ? (
                <div>
                    <div className='flex items-center justify-between'>
                        <div className='text-lg font-semibold text-gray-700'>
                            View Order Detail
                            <span className='text-sm text-gray-400'> #{viewOrder?.orderID}</span>
                        </div>
                        <button
                            onClick={() => setViewOrder(null)}
                            className='bg-main text-white mb-4 p-2 rounded hover:bg-red-700 mt-5'
                        >
                            Back
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className='flex'>
                            <div className='w-[60%] flex flex-col pr-2 gap-8'>
                                <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                    <div className='text-lg font-semibold text-gray-700 mb-3'>List Product</div>
                                    {viewOrder?.products.map((item, index) => (
                                        <div key={index} className='flex justify-between mb-2'>
                                            <div className='w-20 h-20 border-red-600 border rounded'>
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className='w-full h-full object-cover rounded'
                                                />
                                            </div>
                                            <div className='flex flex-col text-[15px] w-[30%]'>
                                                <div className='text-main'>{item.title}</div>
                                                <div className='text-sm text-gray-400'>{item.color}</div>
                                                <div className='text-xs'>{item.quantity}</div>
                                            </div>
                                            <div className='text-sm'>{`${formatPrice(item.price)} VND`}</div>
                                        </div>
                                    ))}
                                    {viewOrder?.coupon?.code && (
                                        <div className='flex justify-between mt-3'>
                                            <div className='text-sm font-semibold'>Coupon</div>
                                            <div className='text-sm font-semibold'>{`${viewOrder?.coupon?.code}`}</div>
                                        </div>
                                    )}
                                    <div className='flex justify-between mt-3'>
                                        <div className='text-sm font-semibold'>Total</div>
                                        <div className='text-sm font-semibold'>{`${viewOrder?.total} $`}</div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                    <div className='text-lg font-semibold text-gray-700'>Order Status</div>
                                    <div className='w-full flex flex-col gap-3 mt-3'>
                                        <Select
                                            label='Status'
                                            register={register}
                                            errors={errors}
                                            id={'status'}
                                            validate={{ required: 'This field is required' }}
                                            options={getFilteredOptions()}
                                            disabled={isCanceled || isCompleted}
                                        />
                                        {isCanceled && <div className='text-red-500 text-sm'>This order has been cancelled</div>}
                                        {isCompleted && <div className='text-green-500 text-sm'>This order has been completed</div>}


                                        {(shouldShowNoteAndSaveButton && selectedStatus !== 'Completed') && (
                                            <>
                                                <label className='block text-sm font-medium text-gray-700'>Note</label>
                                                <textarea
                                                    id='note'
                                                    placeholder='Enter something...'
                                                    {...register('note', { required: 'This field is required' })}
                                                    className={`mt-1 block w-full px-3 py-2 border ${errors.note ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                                />
                                                {errors.note && <span className='text-red-500 text-xs'>{errors.note.message}</span>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='w-[40%] flex flex-col pl-2 gap-8'>
                                <div className='flex flex-col gap-3 border border-gray-300 p-5 rounded-md shadow-xl'>
                                    <div className='text-lg font-semibold text-gray-700'>Address Shipping</div>
                                    <div className='w-full flex flex-col gap-3 mt-3'>
                                        <div className='flex gap-4 justify-between'>
                                            <div className='w-1/2'>
                                                <InputForm
                                                    label='Name'
                                                    register={register}
                                                    errors={errors}
                                                    id={'name'}
                                                    validate={{ required: 'This field is required' }}
                                                    placeholder={'Enter name'}
                                                    disabled={true}
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
                                                    disabled={true}
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
                                            disabled={true}
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
                                                    disabled={true}
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
                                                    disabled={true}
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
                                                    disabled={true}
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
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {shouldShowNoteAndSaveButton && (
                            <button type='submit' className='bg-green-600 text-white mb-4 p-2 rounded hover:bg-green-500 mt-5'>
                                Save
                            </button>
                        )}
                    </form>
                </div>
            ) : (
                <LoadSpinner className={'w-full min-h-screen flex items-center justify-center bg-transparent'} />
            )}
        </>
    );
};

export default ViewOrder;