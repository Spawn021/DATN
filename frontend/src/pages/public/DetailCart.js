import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumb, SelectQuantity } from '../../components'
import { formatPrice } from '../../ultils/helpers'
import { apiUsers } from '../../redux/apis'
import { getUserCurrent } from '../../redux/features/userSlice'

const DetailCart = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { userData } = useSelector((state) => state.user)
    const [quantities, setQuantities] = useState(
        userData?.cart?.map((item) => item.quantity) || []
    )
    useEffect(() => {
        setQuantities(userData?.cart?.map((item) => item.quantity) || []);
    }, [userData?.cart]);
    const handleQuantity = useCallback(
        (index, number) => {
            setQuantities((prev) => {
                const updated = [...prev]

                if (number === '') {
                    // Người dùng đang xóa số, giữ giá trị là rỗng để cho phép nhập lại
                    updated[index] = ''
                } else {
                    const value = parseInt(number, 10)
                    if (!isNaN(value)) {
                        updated[index] = Math.max(
                            1,
                            Math.min(value, userData?.cart?.[index]?.product?.quantity)
                        )
                    }
                }

                return updated
            })
        },
        [userData?.cart]
    )


    const handleIncrement = useCallback(
        (index) => {
            const productId = userData.cart[index]
            console.log(productId)
            setQuantities((prev) => {
                const updated = [...prev]
                updated[index] = Math.min(
                    (updated[index] || 1) + 1,
                    userData?.cart?.[index]?.product?.quantity
                )
                return updated
            })
        },
        [userData?.cart]
    )

    const handleDecrement = useCallback(
        (index) => {
            setQuantities((prev) => {
                const updated = [...prev]
                if ((updated[index] || 1) - 1 < 1) {
                    const product = userData.cart[index]
                    console.log(product)
                    Swal.fire({
                        title: 'Do you want to remove this item?',
                        text: 'This item will be removed from your cart!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, remove it!',
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const response = await apiUsers.removeCart(product.product._id, product.color)
                            if (response.success) {
                                dispatch(getUserCurrent())
                            }
                            else {
                                toast.error('Remove from cart failed')
                            }
                        }
                    })
                } else {
                    updated[index] = Math.max((updated[index] || 1) - 1, 1)
                }
                return updated
            })
        },
        [userData?.cart]
    )

    if (!userData?.cart?.length) {
        return (
            <div className='w-full flex flex-col items-center justify-center h-[300px]'>
                <p className='text-lg font-semibold'>Your cart is empty</p>
            </div>
        )
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
                    {userData.cart.map((item, index) => (
                        <div
                            key={index}
                            className='font-bold grid grid-cols-10 border py-3 border-t-0'
                        >
                            <div className='col-span-5 text-center uppercase flex gap-2 justify-center'>
                                <img
                                    src={item.thumbnail}
                                    alt={item.product.title}
                                    className='w-[200px] h-[200px] object-cover'
                                />
                                <div className='flex flex-col gap-1 my-4'>
                                    <Link
                                        to={`/${item.product.category.toLowerCase()}/${item.product._id}/${item.product.title}`}
                                    >
                                        <span className='text-base font-semibold text-main'>
                                            {item.product.title}
                                        </span>
                                    </Link>
                                    <div className='text-sm text-start font-normal'>
                                        {item.color}
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-2 text-center uppercase'>
                                <div className='flex items-center justify-center mt-4 gap-2'>
                                    <SelectQuantity
                                        quantity={quantities[index]}
                                        handleQuantity={(number) =>
                                            handleQuantity(index, number)
                                        }
                                        handleDecrement={() => handleDecrement(index)}
                                        handleIncrement={() => handleIncrement(index)}
                                    />
                                    <div className='text-xs text-[#151515]'>{`In stock: ${item?.product?.quantity}`}</div>
                                </div>
                            </div>
                            <div className='col-span-3 text-center uppercase my-3'>
                                {`${formatPrice(item.price * (quantities[index] || 1))} VND`}
                            </div>
                        </div>
                    ))}
                    <div className='border border-t-0'>
                        <div className='flex justify-end items-center gap-5 py-3 pr-20'>
                            <div className='flex flex-col gap-2 '>
                                <div className='flex gap-10 justify-end'>
                                    <div className='text-lg font-semibold'>Subtotal:</div>
                                    <div className='text-lg font-semibold text-main'>
                                        {`${formatPrice(
                                            userData.cart.reduce(
                                                (total, item, index) =>
                                                    total + item.price * (quantities[index] || 1),
                                                0
                                            )
                                        )} VND`}
                                    </div>
                                </div>
                                <div className='text-sm text-[#151515] italic'>
                                    Shipping, taxes, and discounts calculated at checkout.
                                </div>
                                <div className='flex justify-end'>
                                    <div className='flex gap-5'>
                                        <button className='bg-main text-white py-2 px-5 rounded hover:bg-[#333]'>
                                            Checkout
                                        </button>
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
