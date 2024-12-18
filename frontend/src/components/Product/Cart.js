import React, { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import icons from '../../ultils/icons'
import { showCart } from '../../redux/features/modalSlice'
import { getUserCurrent } from '../../redux/features/userSlice'
import { formatPrice } from '../../ultils/helpers'
import { apiUsers } from '../../redux/apis'
import path from '../../ultils/path'

const Cart = () => {
    const navigate = useNavigate()
    const { IoMdClose, FaLongArrowAltRight, MdDelete } = icons
    const dispatch = useDispatch()
    const { currentCart } = useSelector(state => state.user)
    const removeFromCart = async (pid, color) => {
        let url = `/user/remove-cart/${pid}`
        if (color) {
            url += `/${color}`
        }
        const response = await apiUsers.removeCart(url)
        if (response.success) {
            dispatch(getUserCurrent())
        }
        else {
            toast.error('Remove from cart failed')
        }

    }
    return (
        <div onClick={e => e.stopPropagation()} className='w-[400px] h-screen grid grid-rows-11 bg-gray-100 px-5'>
            <div className='row-span-1 h-full border-b-2 font-bold text-2xl flex items-center justify-between'>
                <span>Your Cart</span>
                <span onClick={() => dispatch(showCart())} className='hover:cursor-pointer hover:text-main'>
                    <IoMdClose />
                </span>
            </div>
            <div className='row-span-7 max-h-full overflow-y-auto my-5 border-b-2'>
                {!currentCart || currentCart.length === 0 ?
                    <div className='text-center text-sm italic'>
                        <span>Your cart is empty</span>
                    </div>
                    :
                    <div className='flex flex-col gap-4'>
                        {currentCart.map((item, index) => {
                            const discountedPrice = item.price - item.price * item.product?.discountPercentage / 100
                            return (
                                <div key={index} className='flex gap-2'>
                                    <img src={item.thumbnail} alt={item.title} className='w-[80px] h-[80px] object-cover' />
                                    <div className='w-full flex flex-col gap-1'>
                                        <div className='flex justify-between items-center'>
                                            <div className='flex items-center gap-3'>
                                                <Link to={`/${item.product?.category.toLowerCase()}/${item.product?._id}/${item.product?.title}`}
                                                    onClick={() => dispatch(showCart())}
                                                >
                                                    <span className='text-sm font-semibold text-main'>{item.title}</span>
                                                </Link>
                                                <div className='text-xs'>{`x${item.quantity}`}</div>
                                            </div>
                                            <div onClick={() => removeFromCart(item.product._id, item.color)} className='cursor-pointer hover:text-main'>
                                                <MdDelete />
                                            </div>
                                        </div>
                                        <div className='flex justify-between text-sm'>
                                            <div>{item.color}</div>
                                            <div className='flex flex-col'>
                                                <div className={`${item.product?.discountPercentage > 0 ? 'line-through' : 'font-medium'}`}>{`${formatPrice(item.price)} VND`}</div>
                                                {item.product?.discountPercentage > 0 && <div className='font-medium'>{`${formatPrice(discountedPrice)} VND`}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            <div className='row-span-3 h-full flex gap-4 flex-col'>
                <div className='flex justify-between'>
                    <span className='font-semibold uppercase'>Subtotal</span>
                    <span>{formatPrice(currentCart?.reduce((sum, item) => sum + item?.price * item.quantity, 0)) + ' VND'}</span>
                </div>
                <div className='italic text-center text-xs '>
                    Shipping, taxes, and discounts calculated at checkout.
                </div>
                <button onClick={() => {
                    dispatch(showCart())
                    navigate(`/${path.DETAIL_CART}`)
                }} className='w-full bg-main text-white hover:bg-red-700 py-2 rounded uppercase flex gap-2 items-center justify-center'>
                    <span>Shoping Cart</span>
                    <FaLongArrowAltRight />
                </button>
                <Link target='_blank' to={`/${path.CHECKOUT}`} onClick={() => dispatch(showCart())} className='w-full bg-main text-white hover:bg-red-700 py-2 rounded uppercase flex gap-2 items-center justify-center'>
                    Checkout
                </Link>
            </div>
        </div>
    )
}

export default memo(Cart)