import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import moment from 'moment'
import { InputField, Pagination } from '../../components'
import { UpdatedProduct } from '../admin'
import icons from '../../ultils/icons'
import { apiProducts } from '../../redux/apis'
import useDebounce from '../../hooks/useDebounce'
import { highlightText, formatPrice, capitalizeFirstLetter } from '../../ultils/helpers'

const ManageProducts = () => {
    const { FaSearch, MdDelete, CiEdit } = icons
    const [query, setQuery] = useState('')
    const [counts, setCounts] = useState(0)
    const [pageSize, setPageSize] = useState(10);
    const [products, setProducts] = useState(null)
    const [update, setUpdate] = useState(false)

    const [editProduct, setEditProduct] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    const [params] = useSearchParams()

    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    const getProducts = async (queries) => {
        const response = await apiProducts.getProducts(queries)
        if (response.success) {
            setProducts(response.products)
            setCounts(response.counts)
        } else {
            setProducts(null)
            setCounts(0)
        }
    }
    const queryDebounce = useDebounce(query, 800)
    useEffect(() => {
        if (queryDebounce) {
            const queries = Object.fromEntries(params.entries());
            queries.page = 1;
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
        getProducts(queries)
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
    const handleDeleteProduct = (pid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this product!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiProducts.deleteProduct(pid)
                if (response.success) {
                    toast.success('Product deleted successfully')
                    render()
                } else {
                    toast.error('Failed to delete product')
                }
            }
        })
    }

    return (
        <div className='p-4'>
            <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                {editProduct ? <UpdatedProduct editProduct={editProduct} setEditProduct={setEditProduct} render={render} /> :
                    <div className='w-full'>

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
                            <div className='w-1/3'>
                                <InputField
                                    type='text'
                                    value={query}
                                    handleChange={(e) => setQuery(e.target.value)}
                                    placeholder='Search products by title, color, category, brand'
                                    className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md '
                                    icon={<FaSearch size={20} />}
                                />
                            </div>
                        </div>
                        <table className='w-full mb-[10px] border-collapse border-spacing-[2px] border-gray-300 '>
                            <thead className='text-start'>
                                <tr className='border-[1px] border-solid border-[#e9e9e9]'>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>#</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Thumb</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Title</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Brand</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Category</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Color</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Price</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Discount</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Quantity</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Sold</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Ratings</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>CreatedAt</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products && products.map((el, index) => {
                                    const productIndex = (Math.max(params.get('page'), 1) - 1) * pageSize + 1 + index
                                    return (
                                        <tr key={index} className={`border-[1px] text-sm border-solid border-[#e9e9e9] ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{productIndex}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                <img src={el.thumbnail} alt={el.title} className='w-16 h-16 object-cover' />
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{highlightText(el.title, query)}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{highlightText(capitalizeFirstLetter(el.brand), query)}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{highlightText(capitalizeFirstLetter(el.category), query)}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{highlightText(el.color, query)}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{formatPrice(el.price)}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{el.discount}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{el.quantity}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{el.sold}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{el.totalRating}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.createdAt).format('DD-MM-YYYY')}</td>
                                            <td className='flex gap-2 items-center justify-center py-3 px-4 border-solid border-[#e9e9e9] mt-[18px]'>
                                                <span onClick={() => setEditProduct(el)} className='text-blue-500 hover:text-blue-700 group relative cursor-pointer'>
                                                    <CiEdit size={23} />
                                                    <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                        Edit
                                                    </div>
                                                </span>
                                                <span onClick={() => handleDeleteProduct(el._id)} className='text-red-500 hover:text-red-700 group relative cursor-pointer'>
                                                    <MdDelete size={23} />
                                                    <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                        Delete
                                                    </div>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                        {!products && (
                            <div className="text-center py-4 text-gray-500">
                                No products found with the search title provided above ...
                            </div>
                        )}
                        {products && <div className='w-full text-right mt-5'>
                            <Pagination
                                totalCount={counts}
                                pageSize={pageSize}
                            />
                        </div>
                        }

                    </div>
                }
            </div>
        </div>
    )
}

export default ManageProducts