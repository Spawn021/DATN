import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation, Link } from 'react-router-dom'
import moment from 'moment'
import { toast } from 'react-toastify'
import { Pagination, InputField, CustomSelect } from '../../components'
import { ViewOrder } from '../../pages/admin'
import { apiOrders } from '../../redux/apis'
import useDebounce from '../../hooks/useDebounce'
import { highlightText, formatPrice } from '../../ultils/helpers'
import icons from '../../ultils/icons'
import { orderStatus } from '../../ultils/constants'

const ManageOrders = () => {
    const { FaSearch, FaEye } = icons
    const [counts, setCounts] = useState(0)
    const [orders, setOrders] = useState(null)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState(null)
    const [update, setUpdate] = useState(false)
    const [viewOrder, setViewOrder] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [params] = useSearchParams()
    const getAllOrder = async (queries) => {
        const response = await apiOrders.getAllOrder(queries)
        if (response.success) {
            setOrders(response.orders)
            setCounts(response.counts)
        } else {
            setOrders(null)
            setCounts(0)
        }
    }
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
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
        const queries = Object.fromEntries(params.entries());
        queries.limit = pageSize;
        if (!queries.page) {
            queries.page = 1;
        }
        getAllOrder(queries)
    }, [params, pageSize, update])

    const handlePageSizeChange = (e) => {
        const newPageSize = Number(e.target.value);
        setPageSize(newPageSize);
        const queries = Object.fromEntries(params.entries());
        queries.limit = newPageSize;
        queries.page = 1;
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        });

    }
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
        <div className='p-4'>
            <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                {viewOrder ? <ViewOrder viewOrder={viewOrder} setViewOrder={setViewOrder} render={render} /> : (
                    <>
                        <div className='flex py-4 items-center w-full justify-between'>
                            <div className='flex text-base gap-2 items-center'>
                                <span>Show</span>
                                <select
                                    className='border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md p-1 '
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                >   <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                </select>
                                <span>entries</span>

                            </div>
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
                                        <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders && orders.map((el, index) => {
                                        const orderIndex = (Math.max(params.get('page'), 1) - 1) * pageSize + 1 + index
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
                                                    }`}>
                                                    {el.status}
                                                </td>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.updatedAt).format('DD-MM-YYYY HH:mm')}</td>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                    <div className='flex gap-2 justify-center'>
                                                        <span
                                                            onClick={() => setViewOrder(el)}
                                                            className='text-blue-500 hover:text-blue-700 group relative cursor-pointer'
                                                        >
                                                            <FaEye size={23} />
                                                            <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                                View
                                                            </div>
                                                        </span>
                                                    </div>
                                                </td>
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
                                pageSize={pageSize}
                            />
                        </div>
                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default ManageOrders