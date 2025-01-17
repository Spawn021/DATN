import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import moment from 'moment'
import { InputField, Pagination, CustomSelect } from '../../components'
import { UpdatedBlog } from '../admin'
import icons from '../../ultils/icons'
import { apiBlogs } from '../../redux/apis'
import useDebounce from '../../hooks/useDebounce'
import { highlightText } from '../../ultils/helpers'

const ManageBlogs = () => {
    const categories = useSelector((state) => state.blogCategory.categories)
    const { FaSearch, MdDelete, CiEdit } = icons
    const [query, setQuery] = useState('')
    const [counts, setCounts] = useState(0)
    const [status, setStatus] = useState(null)
    const [pageSize, setPageSize] = useState(10);
    const [blogs, setBlogs] = useState(null)
    const [update, setUpdate] = useState(false)

    const [editBlog, setEditBlog] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    const [params] = useSearchParams()

    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    const getBlogs = async (queries) => {
        const response = await apiBlogs.getBlogs(queries)
        if (response.success) {
            setBlogs(response.blogs)
            setCounts(response.counts)
        } else {
            setBlogs(null)
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
        getBlogs(queries)
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
    const handleDeleteBlog = (bid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this blog!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiBlogs.deleteBlog(bid)
                if (response.success) {
                    toast.success('Blog deleted successfully')
                    render()
                } else {
                    toast.error('Failed to delete blog')
                }
            }
        })
    }
    const handleSearchStatus = (value) => {
        setStatus(value);
        const currentParams = Object.fromEntries(params.entries());

        if (value) {
            currentParams.category = value.value;
        } else {
            delete currentParams.category;
        }

        navigate({
            pathname: location.pathname,
            search: createSearchParams(currentParams).toString(),
        })
    }
    return (
        <div className='p-4'>
            <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                {editBlog && <UpdatedBlog editBlog={editBlog} setEditBlog={setEditBlog} render={render} />}
                {!editBlog && (
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
                                    placeholder='Search blogs by title'
                                    className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md '
                                    icon={<FaSearch size={20} />}
                                />
                            </div>
                            <div className='w-1/5'>
                                <CustomSelect
                                    options={categories?.map((el) => ({ value: el.title, label: el.title }))}
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
                                        <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Thumbnail</th>
                                        <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Title</th>
                                        <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Category</th>
                                        <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>CreatedAt</th>
                                        <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Updated</th>
                                        <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs && blogs.map((el, index) => {
                                        const blogIndex = (Math.max(params.get('page'), 1) - 1) * pageSize + 1 + index
                                        return (
                                            <tr key={index} className={`border-[1px] border-solid border-[#e9e9e9] ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{blogIndex}</td>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                    <img src={el.thumbnail} alt={el.title} className='w-16 h-16 object-cover' />
                                                </td>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9] truncate max-w-[200px]'>{highlightText(el.title, query)}</td>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{el.category}</td>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.createdAt).format('DD-MM-YYYY')}</td>
                                                <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.updatedAt).format('DD-MM-YYYY')}</td>
                                                <td className='flex gap-2 items-center justify-center py-3 px-4 border-solid border-[#e9e9e9] mt-[18px]'>
                                                    <span onClick={() => setEditBlog(el)} className='text-blue-500 hover:text-blue-700 group relative cursor-pointer'>
                                                        <CiEdit size={23} />
                                                        <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                            Edit
                                                        </div>
                                                    </span>
                                                    <span onClick={() => handleDeleteBlog(el._id)} className='text-red-500 hover:text-red-700 group relative cursor-pointer'>
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
                        </div>
                        {!blogs && (
                            <div className="text-center py-4 text-gray-500">
                                No blogs found with the search title provided above ...
                            </div>
                        )}
                        {blogs && <div className='w-full text-right mt-5'>
                            <Pagination
                                totalCount={counts}
                                pageSize={pageSize}
                            />
                        </div>
                        }

                    </div>
                )}

            </div>
        </div>
    )
}

export default ManageBlogs