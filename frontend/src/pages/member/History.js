import React, { useState, useEffect } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation, Link } from 'react-router-dom'
import moment from 'moment'
import { Pagination, InputField, CustomSelect } from '../../components'
import { apiOrders } from '../../redux/apis'
import useDebounce from '../../hooks/useDebounce'
import { highlightText, formatPrice } from '../../ultils/helpers'
import icons from '../../ultils/icons'
import { orderStatus } from '../../ultils/constants'

const History = () => {
    const { FaSearch } = icons
    const [counts, setCounts] = useState(0)
    const [orders, setOrders] = useState(null)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [params] = useSearchParams()
    const getOrder = async (queries) => {
        const response = await apiOrders.getOrder(queries)
        console.log(response)
        if (response.success) {
            setOrders(response.orders)
            setCounts(response.counts)
        } else {
            setOrders(null)
            setCounts(0)
        }
    }
    const queryDebounce = useDebounce(query, 800)
    useEffect(() => {
        if (queryDebounce) {
            const queries = Object.fromEntries(params.entries())
            queries.page = 1
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ ...queries, q: queryDebounce }).toString(),
            })
        } else {
            navigate({
                pathname: location.pathname
            })
        }
    }, [queryDebounce])
    useEffect(() => {
        const queries = Object.fromEntries(params.entries())
        if (!queries.page) {
            queries.page = 1;
        }
        getOrder(queries)
    }, [params])
    const handleSearchStatus = (value) => {
        setStatus(value);
        const currentParams = Object.fromEntries(params.entries());

        if (value) {
            currentParams.status = value.value;
        } else {
            delete currentParams.status;
        }

        navigate({
            pathname: location.pathname,
            search: createSearchParams(currentParams).toString(),
        })
    }

    return (
        <div className='mx-auto h-hp mt-4 px-4'>
            <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                <div className='w-full'>
                    <div className='w-full flex gap-4 justify-between items-center mb-4'>
                        <div className='w-2/5'>
                            <InputField
                                type='text'
                                value={query}
                                handleChange={(e) => setQuery(e.target.value)}
                                placeholder='Search order by orderID or product name'
                                className='w-full text-sm text-gray-600 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md '
                                icon={<FaSearch size={20} />}
                            />
                        </div>
                        <div className='w-1/5'>
                            <CustomSelect
                                options={orderStatus}
                                value={status}
                                onChange={(value) => handleSearchStatus(value)}
                                className={`w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md`}
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <table className='w-full mb-[10px] border-collapse border-spacing-[2px] border-gray-300'>
                            <thead className='text-start'>
                                <tr className='border-[1px] border-solid border-[#e9e9e9] text-sm'>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>#</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-1 text-start'>orderID</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>CreatedAt</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>List products</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Coupon</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Total($)</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-2 text-start'>Address</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Status</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>UpdatedAt</th>

                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map((el, index) => {
                                    const orderIndex = (Math.max(params.get('page'), 1) - 1) * 10 + 1 + index
                                    return (
                                        <tr key={index} className={`border-[1px] text-xs border-solid border-[#e9e9e9] ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{orderIndex}</td>
                                            <td className='py-3 px-1 border-y-[1px] border-solid border-[#e9e9e9]'>{highlightText(el.orderID, query)}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.createdAt).format('DD-MM-YYYY HH:mm')}</td>
                                            <td className='py-3 px-4 border-solid border-[#e9e9e9] flex flex-col gap-2 justify-center'>{
                                                el.products.map((product, index) => {
                                                    return (
                                                        <div key={index} className='flex items-center'>
                                                            <img src={product.thumbnail} alt={product.thumbnail} className='w-10 h-10 object-cover' />
                                                            <div className='ml-3'>
                                                                <Link
                                                                    to={`/${product?.product?.category?.toLowerCase()}/${product?.product._id}/${product?.title}`}
                                                                >
                                                                    <p className='text-sm text-main hover:cursor-pointer font-medium hover:text-red-700'>{highlightText(product.title, query)}</p>
                                                                </Link>
                                                                <p className='text-xs text-gray-500'>{product?.color}</p>
                                                                <p className='text-xs text-gray-500'>{formatPrice(product.price)} x {product.quantity}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{el?.coupon && (
                                                <div className='flex flex-col gap-1 justify-center items-center'>
                                                    <div>{el?.coupon?.code}</div>
                                                    <div>({el?.coupon?.discountType === 'percentage' ? `- ${el?.coupon?.discountValue}%` : `- ${el?.coupon?.discountValue} VND`})</div>
                                                </div>
                                            )}
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9] text-sm font-semibold'>{el.total}</td>
                                            <td className='py-3 px-2 border-y-[1px] border-solid border-[#e9e9e9]'>{
                                                el?.address && (
                                                    <>
                                                        <div className='text-sm font-semibold'>{el.address.name}</div>
                                                        <div>{el.address.phone}</div>
                                                        <div className='flex gap-1'>
                                                            <span>{el.address.addressLine1},</span>
                                                            <span>{el.address.city},</span>

                                                        </div>
                                                        <div className='flex gap-1'>
                                                            <span>{el.address.state},</span>
                                                            <span>{el.address.country}</span>
                                                        </div>
                                                        <span>{el.address.postalCode}</span>
                                                    </>
                                                )
                                            }</td>
                                            <td className={`py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9] ${el.status === 'Pending' ? 'text-yellow-500' :
                                                    el.status === 'Processing' ? 'text-blue-500' :
                                                        el.status === 'Completed' ? 'text-green-500' :
                                                            el.status === 'Cancelled' ? 'text-red-500' :
                                                                'text-gray-500'
                                                }`}>{el.status}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.updatedAt).format('DD-MM-YYYY HH:mm')}</td>

                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!orders && (
                        <div className="text-center py-4 text-gray-500">
                            No orders found with the search provided above ...
                        </div>
                    )}
                    {orders && <div className='w-full text-right mt-5'>
                        <Pagination
                            totalCount={counts}
                        />
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default History