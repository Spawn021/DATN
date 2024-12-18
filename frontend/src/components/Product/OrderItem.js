import React, { memo, useState, useCallback, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../ultils/helpers'
import { SelectQuantity } from '../../components'
import { updateCart } from '../../redux/features/userSlice'
import { apiUsers } from '../../redux/apis'
import { getUserCurrent } from '../../redux/features/userSlice'


const OrderItem = ({ item, defaultQuantity = 1 }) => {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(defaultQuantity)
    const handleQuantity = useCallback(
        (number) => {
            if (number === '') {
                setQuantity(0)
                return
            }
            const value = parseInt(number, 10)

            if (!isNaN(value)) {
                if (value < 1) {
                    setQuantity(0)
                } else if (value > item?.product?.quantity) {
                    setQuantity(item?.product?.quantity)
                } else {
                    setQuantity(value)
                }
            }
        },
        [item?.product?.quantity],
    )
    const handleIncrement = useCallback(() => {
        setQuantity((prev) => (prev < item?.product?.quantity ? prev + 1 : item?.product?.quantity))
    }, [item?.product?.quantity])
    const handleDecrement = useCallback(() => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 0))
    }, [])
    useEffect(() => {
        dispatch(updateCart({ pid: item.product?._id, quantity, color: item.color }))
    }, [quantity])
    const removeFromCart = async (pid, color) => {
        let url = `/user/remove-cart/${pid}`
        if (color) {
            url += `/${color}`
        }
        const response = await apiUsers.removeCart(url)
        if (response.success) {
            dispatch(getUserCurrent())
        }

    }
    useEffect(() => {
        if (quantity === 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You want to remove this item from cart?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    removeFromCart(item.product?._id, item.color)
                } else {
                    setQuantity(1)
                }
            })
        }
    }, [quantity, item.product?._id, item.color, defaultQuantity])

    return (
        <div className='font-bold grid grid-cols-10 border py-3 border-t-0'>
            <div className='col-span-5 text-center uppercase flex gap-2 justify-center'>
                <img
                    src={item.thumbnail}
                    alt={item.product?.title}
                    className='w-[200px] h-[200px] object-cover'
                />
                <div className='flex flex-col gap-1 my-4'>
                    <Link
                        to={`/${item.product?.category?.toLowerCase()}/${item.product?._id}/${item.product?.title}`}
                    >
                        <span className='text-base font-semibold text-[#333] hover:text-main'>
                            {item.product?.title}
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
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleDecrement={handleDecrement}
                        handleIncrement={handleIncrement}
                    />
                    <div className='text-xs text-[#151515]'>{`In stock: ${item?.product?.quantity}`}</div>
                </div>
            </div>
            <div className='col-span-3 text-center uppercase my-3'>
                {`${formatPrice(item.price * quantity)} VND`}
            </div>
        </div>
    )
}

export default memo(OrderItem)