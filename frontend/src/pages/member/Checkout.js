import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { formatPrice } from '../../ultils/helpers'
import { apiCoupons, apiUsers } from '../../redux/apis'
import { toast } from 'react-toastify'
import { getUserCurrent } from '../../redux/features/userSlice'
import { showModal, showChangeAddressModal } from '../../redux/features/modalSlice'
import { Address, SelectAddress, InputForm, Congrate, Paypal } from '../../components'
import icons from '../../ultils/icons'

const Checkout = () => {
    const dispatch = useDispatch()
    const { GiPositionMarker } = icons
    const { currentCart } = useSelector(state => state.user)
    const [coupon, setCoupon] = useState('')
    const [couponApplied, setCouponApplied] = useState(null)
    const [address, setAddress] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    const { register, formState: { errors }, reset } = useForm()
    const getAddress = async () => {
        const response = await apiUsers.getAddresses()

        if (response.success) {
            setAddresses(response.addresses)
            for (let i = 0; i < response.addresses.length; i++) {
                if (response.addresses[i].isDefault) {
                    setAddress(response.addresses[i])
                }

            }
        } else {
            setAddresses([])
            handleAddAddress()
        }

    }
    useEffect(() => {
        getAddress()
    }, [])
    useEffect(() => {
        if (isSuccess) dispatch(getUserCurrent())
    }, [isSuccess])
    useEffect(() => {
        if (address) {
            reset({
                name: address.name,
                phone: address.phone,
                addressLine1: address.addressLine1,
                city: address.city,
                state: address.state,
                country: address.country,
                postalCode: address.postalCode,
            })
        }
    }, [address])
    useEffect(() => {
        if (addresses.length > 0 && !isFirstLoad) {
            dispatch(showChangeAddressModal({ isShowChangeAddressModal: false, changeAddressModalContent: null }));
            dispatch(showChangeAddressModal({
                isShowChangeAddressModal: true,
                changeAddressModalContent: (
                    <SelectAddress
                        addresses={addresses}
                        onSave={getAddress}
                        handleChangeAddress={handleChangeAddress}
                    />
                )
            }));
        }
    }, [addresses]);

    const handleApplyCoupon = async () => {
        const response = await apiCoupons.checkCoupon({ code: coupon })
        if (response.success) {
            setCouponApplied(response.coupon)
            toast.success(response.message)
        }
        else {
            toast.error(response.message)

        }
    }
    const handleAddAddress = () => {
        dispatch(showModal({ isShowModal: true, modalContent: <Address addresses={addresses} onSave={getAddress} /> }))
    }
    const handleChangeAddress = (newAddress) => {
        setAddress(newAddress)
    }
    const subTotal = currentCart?.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = couponApplied ? couponApplied.discountType === 'fixed' ? couponApplied.discountValue : subTotal * couponApplied.discountValue / 100 : 0
    const total = Math.round((subTotal - discount) / 23000)
    return (
        <div className='w-main mx-auto'>
            {isSuccess && <Congrate />}
            <div className='ml-[10px]'>
                <h2 className='text-xl font-semibold uppercase mb-5 text-main text-center'>Checkout</h2>
                <div className='flex justify-between gap-4 items-start'>
                    <div className='w-[65%]'>
                        <div className='border shadow-md rounded-md bg-gray-50'>
                            <div className='flex text-main gap-2 items-center p-4 border-b-2 border-dotted'>
                                <div className='text-main'><GiPositionMarker /></div>
                                <span>Delivery Address</span>
                            </div>
                            <div className='p-4'>
                                <div className='flex justify-between items-center'>
                                    {address ? (
                                        <div className='flex gap-3'>
                                            <div className='flex font-semibold gap-1'>
                                                <div>{address.name}</div>
                                                <div>{address.phone}</div>
                                            </div>
                                            <div className='flex gap-1'>
                                                <div>{address.addressLine1},</div>
                                                <div> {address.city},</div>
                                                <div> {address.state},</div>
                                                <div> {address.country}</div>
                                            </div>
                                            {address.isDefault && <button className='text-main border-main border cursor-default px-1'>Default</button>}
                                        </div>
                                    )
                                        : <div className='text-center text-gray-400'>No address found. Please add one.</div>
                                    }
                                    <button
                                        onClick={() => {
                                            setIsFirstLoad(false)
                                            dispatch(showChangeAddressModal({
                                                isShowChangeAddressModal: true,
                                                changeAddressModalContent:
                                                    <SelectAddress
                                                        addresses={addresses}
                                                        onSave={getAddress}
                                                        handleChangeAddress={handleChangeAddress}
                                                    />
                                            }))
                                        }}
                                        className='text-main hover:text-red-700'>Change</button>
                                </div>
                                {address && (
                                    <form className='w-full flex flex-col gap-3 mt-3'>
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
                                    </form>
                                )}
                            </div>
                        </div>
                        {address &&
                            <div className='mt-4 p-4'>
                                <div className='w-1/2 flex m-auto'>
                                    <Paypal
                                        amount={total}
                                        payload={{
                                            products: currentCart,
                                            total: total,
                                            address: address,
                                            coupon: couponApplied,
                                        }}
                                        setIsSuccess={setIsSuccess}
                                    />
                                </div>

                            </div>
                        }
                    </div>
                    <div className='w-[35%] flex flex-col justify-between border shadow-md rounded-md bg-gray-50 p-4 '>
                        <div className='font-medium'>Your Order</div>
                        <div className='mt-4 pb-2 flex flex-col border-dotted border-b-2 h-[280px] overflow-y-auto'>
                            {currentCart?.map((item, index) => (
                                <div key={index} className='flex justify-around mb-2'>
                                    <div className='w-20 h-20 border-red-600 border rounded'>
                                        <img src={item.thumbnail} alt={item.title} className='w-full h-full object-cover rounded' />
                                    </div>
                                    <div className='flex flex-col text-[15px]'>
                                        <div className='text-main truncate w-[145px]'>{item.title}</div>
                                        <div className='text-sm text-gray-400'>{item.color}</div>
                                        <div className='text-xs'>{item.quantity}</div>
                                    </div>
                                    <div className='text-sm'>{`${formatPrice(item.price)} VND`}</div>
                                </div>
                            ))}
                        </div>
                        <div className='pb-4 border-b-2 border-dotted'>
                            <div className='font-medium my-2'>Discount Code</div>
                            <div className='relative'>
                                <input
                                    type='text'
                                    className='border border-gray-300 w-full p-2 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                    placeholder='Add discount code'
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                />
                                <button onClick={handleApplyCoupon} className='absolute top-[2px] right-[2px] bg-main text-white px-4 py-1 rounded-md hover:bg-red-700'>Apply</button>
                            </div>
                        </div>
                        <div className='pt-2 flex flex-col gap-2 pb-4 border-b-2 border-dotted'>
                            <div className='flex justify-between items-center'>
                                <div className='text-gray-500 text-sm'>Subtotal</div>
                                <div className='font-semibold'>{formatPrice(currentCart?.reduce((sum, item) => sum + item.price * item.quantity, 0))} VND</div>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='text-gray-500 text-sm'>Discount</div>
                                {couponApplied ? couponApplied.discountType === 'fixed' ?
                                    <div className='font-medium text-sm'>- {formatPrice(couponApplied.discountValue)} VND</div> :
                                    <div className='font-medium text-sm'>- {couponApplied?.discountValue}%</div>
                                    : <div className='font-medium text-sm'>- 0 VND</div>
                                }
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='text-gray-500 text-sm'>Shipping</div>
                                <div className='font-semibold text-green-500 text-sm'>Free</div>
                            </div>

                        </div>
                        <div className='flex justify-between items-center pt-2'>
                            <div className='font-semibold'>Total</div>
                            <div className='font-semibold text-lg'>{`
                                    ${couponApplied ?
                                    couponApplied.discountType === 'fixed' ?
                                        formatPrice(currentCart?.reduce((sum, item) => sum + item.price * item.quantity, 0) - couponApplied.discountValue)
                                        : formatPrice(currentCart?.reduce((sum, item) => sum + item.price * item.quantity, 0) - (currentCart?.reduce((sum, item) => sum + item.price * item.quantity, 0) * couponApplied.discountValue / 100))
                                    : formatPrice(currentCart?.reduce((sum, item) => sum + item.price * item.quantity, 0))} VND`
                            }
                            </div>
                        </div>
                        {/* <button className='bg-main text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700 w-full'>Continue to payment</button> */}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Checkout