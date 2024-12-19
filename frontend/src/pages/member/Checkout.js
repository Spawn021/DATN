import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatPrice } from '../../ultils/helpers'
import { apiCoupons } from '../../redux/apis'
import { toast } from 'react-toastify'
import { Paypal } from '../../components'

const Checkout = () => {
    const { currentCart } = useSelector(state => state.user)
    const [coupon, setCoupon] = useState('')
    const [couponApplied, setCouponApplied] = useState(null)
    console.log(couponApplied)
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
    return (
        <div className='w-main mx-auto py-8'>
            <div className='ml-[10px]'>
                <h2 className='text-xl font-semibold uppercase mb-8 text-main text-center'>Checkout</h2>
                <div className='flex justify-between gap-4 mb-4'>
                    <div className='w-[65%]'>
                        <div className='border shadow-md rounded-md bg-gray-50 h-[300px]'>Address</div>
                        <div className='mt-4 p-4'>
                            {/* <div className='font-medium'>Payment Method</div> */}
                            <Paypal amount={120} />
                        </div>
                    </div>
                    <div className='w-[35%] border shadow-md rounded-md bg-gray-50 p-4 '>
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