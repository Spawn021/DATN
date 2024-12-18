import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Breadcrumb, OrderItem } from '../../components'
import { formatPrice } from '../../ultils/helpers'
import { apiUsers } from '../../redux/apis'
import { getUserCurrent } from '../../redux/features/userSlice'
import path from '../../ultils/path'

const DetailCart = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const { currentCart } = useSelector((state) => state.user)
    if (!currentCart.length) {
        return (
            <div className='w-full flex flex-col items-center justify-center h-[300px]'>
                <p className='text-lg font-semibold'>Your cart is empty</p>
            </div>
        )
    }
    const handleUpdateCart = () => {
        updateCartHandler(currentCart)
    }
    const updateCartHandler = async (cartItems) => {
        try {
            const updatePromises = cartItems.map((item) =>
                apiUsers.updateCart({
                    pid: item.product._id,
                    color: item.color,
                    quantity: item.quantity,
                    price: item.price,
                    thumbnail: item.thumbnail,
                    title: item.title
                })
            )
            const responses = await Promise.all(updatePromises)

            const hasError = responses.some((response) => !response.success)

            if (hasError) {
                toast.error('Some items failed to update')
            } else {
                toast.success('Update cart successfully')
                dispatch(getUserCurrent())
            }
        } catch (error) {
            toast.error('Update cart failed. Please try again!')
            console.error(error)
        }
    }


    return (
        <div className='w-full flex flex-col'>
            <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
                <div className='w-main px-[10px] font-semibold text-[18px]'>Cart Detail</div>
                <Breadcrumb category={location?.pathname?.replace('/', '')?.split('-')?.join(' ')} />
            </div>
            <div className='w-main m-auto mb-5'>
                <div className='ml-[10px]'>
                    <div className='font-bold grid grid-cols-10 border py-3 mt-5 bg-main text-white'>
                        <div className='col-span-5 text-center uppercase'>Products</div>
                        <div className='col-span-2 text-center uppercase'>Quantity</div>
                        <div className='col-span-3 text-center uppercase'>Price</div>
                    </div>
                    {currentCart.map((item, index) => (
                        <OrderItem key={index} item={item} defaultQuantity={item.quantity} />
                    ))}
                    <div className='border border-t-0'>
                        <div className='flex justify-end items-center gap-5 py-3 pr-20'>
                            <div className='flex flex-col gap-2 '>
                                <div className='flex gap-10 justify-end'>
                                    <div className='text-lg font-semibold'>Subtotal:</div>
                                    <div className='text-lg font-semibold text-main'>
                                        {formatPrice(
                                            currentCart.reduce(
                                                (total, item) => total + item.price * item.quantity,
                                                0,
                                            ),
                                        )}
                                    </div>
                                </div>
                                <div className='text-sm text-[#151515] italic'>
                                    Shipping, taxes, and discounts calculated at checkout.
                                </div>
                                <div className='flex justify-end'>
                                    <div className='flex gap-5'>
                                        <button onClick={handleUpdateCart} className='bg-[#333] text-white py-2 px-5 rounded hover:bg-main'>
                                            Update Cart
                                        </button>
                                        <Link target='_blank' to={`/${path.CHECKOUT}`}>
                                            <button className='bg-main text-white py-2 px-5 rounded hover:bg-[#333]'>
                                                Checkout
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailCart
