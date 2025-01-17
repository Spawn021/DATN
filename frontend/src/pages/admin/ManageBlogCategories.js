import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import moment from 'moment'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { apiBlogCategories } from '../../redux/apis'
import icons from '../../ultils/icons'
import { InputField, Pagination, Select, InputForm } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { highlightText } from '../../ultils/helpers'
import { showModal } from '../../redux/features/modalSlice'
import { CreateBlogCategories } from '../admin'

const ManageBlogCategories = () => {
    const dispatch = useDispatch()
    const { CiEdit, MdDelete, FaSearch, IoReturnDownBackOutline } = icons
    const [query, setQuery] = useState('')
    const [blogCategories, setBlogCategories] = useState([])
    const [update, setUpdate] = useState(false)
    const [pageSize, setPageSize] = useState(10);
    const [editElm, setEditElm] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [params] = useSearchParams()
    const getAllBlogCategory = async (queries) => {
        const response = await apiBlogCategories.getAllBlogCategory(queries)
        if (response.success) {
            setBlogCategories(response)
        } else {
            setBlogCategories([])
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
        queries.limit = pageSize
        if (!queries.page) {
            queries.page = 1
        }
        getAllBlogCategory(queries)
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
    const { handleSubmit, register, setValue, formState: { errors }, reset, getValues } = useForm({
        mode: 'all',
    })
    useEffect(() => {
        if (editElm) {
            setValue('title', editElm.title);
        } else {
            reset()
        }
    }, [editElm, setValue, reset]);
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    const handleUpdate = async (data) => {
        const response = await apiBlogCategories.updateBlogCategory(editElm._id, data)
        if (response.success) {
            setEditElm(null)
            render()
            toast.success('Update blog category successfully')
        } else {
            toast.error('Something went wrong')
        }
    };
    const handleDelete = (bcid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this coupon!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await apiBlogCategories.deleteBlogCategory(bcid)
                if (response.success) {
                    render()
                    toast.success('Delete blog category successfully')
                } else {
                    toast.error('Something went wrong')
                }
            }
        })
    }
    const handleCreate = () => {
        dispatch(showModal({ isShowModal: true, modalContent: <CreateBlogCategories onSave={render} /> }))
    }
    return (
        <div className='p-4'>
            <div className='w-full h-full bg-white shadow rounded-lg p-4'>
                <div className='w-full'>
                    <div className='flex py-4 items-center w-full justify-between'>
                        <div className='flex text-base gap-2 items-center'>
                            <span>Show</span>
                            <select
                                className='border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md p-1'
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
                        <div className='w-1/4'>
                            <InputField
                                type='text'
                                value={query}
                                handleChange={(e) => setQuery(e.target.value)}
                                placeholder='Search by title'
                                className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md '
                                icon={<FaSearch size={20} />}
                            />
                        </div>
                        <button onClick={handleCreate} className='bg-blue-600 text-white p-2 rounded hover:bg-blue-500'>Create</button>
                    </div>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        {editElm && <button type='submit' className='bg-green-600 text-white mb-4 p-2 rounded hover:bg-green-500'>Update</button>}
                        <table className='w-full mb-[10px] border-collapse border-spacing-[2px] border-gray-300'>
                            <thead className='text-start'>
                                <tr className='border-[1px] border-solid border-[#e9e9e9]'>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>#</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Code</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>CreatedAt</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>UpdatedAt</th>
                                    <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogCategories?.blogCategories?.map((el, index) => {
                                    const blogCategoriesIndex = (Math.max(params.get('page'), 1) - 1) * pageSize + 1 + index
                                    return (
                                        <tr key={index} className={`border-[1px] border-solid border-[#e9e9e9] ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{blogCategoriesIndex}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                {editElm?._id === el._id ?
                                                    <InputForm
                                                        register={register}
                                                        errors={errors}
                                                        id={'title'}
                                                        validate={{ required: 'The field is required' }}
                                                    />
                                                    : highlightText(el.title, query)
                                                }
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.createdAt).format('HH:mm:ss DD-MM-YYYY')}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.updatedAt).format('HH:mm:ss DD-MM-YYYY')}</td>
                                            <td className='flex gap-2 items-center justify-center  border-solid border-[#e9e9e9] h-[55px]'>
                                                {editElm?._id === el._id ?
                                                    <span onClick={() => {
                                                        setEditElm(null)
                                                        reset()
                                                    }} className='text-orange-500 hover:text-orange-700 group relative cursor-pointer'>
                                                        <IoReturnDownBackOutline size={23} />
                                                        <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                            Back
                                                        </div>
                                                    </span>
                                                    :
                                                    <span onClick={() => {
                                                        setEditElm(el)
                                                        reset()
                                                    }
                                                    } className='text-blue-500 hover:text-blue-700 group relative cursor-pointer'>
                                                        <CiEdit size={23} />
                                                        <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                            Edit
                                                        </div>
                                                    </span>

                                                }
                                                <span onClick={() => handleDelete(el._id)} className='text-red-500 hover:text-red-700 group relative cursor-pointer'>
                                                    <MdDelete size={23} />
                                                    <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                        Delete
                                                    </div>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </form>
                    {blogCategories?.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            No blog category found with the search title provided above ...
                        </div>
                    )}
                    {blogCategories?.length !== 0 && (
                        <div className='w-full text-right mt-5'>
                            <Pagination
                                totalCount={blogCategories.counts}
                                pageSize={pageSize}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageBlogCategories