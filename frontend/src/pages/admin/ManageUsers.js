import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import moment from 'moment'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { apiUsers } from '../../redux/apis'
import { roles, userStatus } from '../../ultils/constants'
import icons from '../../ultils/icons'
import { InputField, Pagination, Select, InputForm } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { highlightText } from '../../ultils/helpers'

const ManageUsers = () => {
    const { CiEdit, MdDelete, FaSearch, IoReturnDownBackOutline } = icons
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [update, setUpdate] = useState(false)
    const [pageSize, setPageSize] = useState(10);
    const [editElm, setEditElm] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    const [params] = useSearchParams()
    const getAllUsers = async (queries) => {
        const response = await apiUsers.getAllUsers(queries)
        if (response.success) {
            setUsers(response)
        } else {
            setUsers([])
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
        getAllUsers(queries);
    }, [params, pageSize, update]);

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

    const { handleSubmit, register, setValue, formState: { errors }, reset } = useForm({
        mode: 'all',
    })
    useEffect(() => {
        if (editElm) {
            setValue('firstname', editElm.firstname);
            setValue('lastname', editElm.lastname);
            setValue('email', editElm.email);
            setValue('role', editElm.role);
            setValue('mobile', editElm.mobile);
            setValue('isBlocked', editElm.isBlocked);

        } else {
            reset()
        }
    }, [editElm, setValue, reset]);
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    const handleUpdate = async (data) => {
        console.log(data)
        const response = await apiUsers.updateUser(editElm._id, data)
        if (response.success) {
            setEditElm(null)
            render()
            toast.success('Update user successfully')
        } else {
            toast.error('Something went wrong')
        }
    };
    const handleDelete = (uid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await apiUsers.deleteUser(uid)
                if (response.success) {
                    render()
                    toast.success('Delete user successfully')
                } else {
                    toast.error('Something went wrong')
                }
            }
        })
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
                                placeholder='Search users by name, email'
                                className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded-md '
                                icon={<FaSearch size={20} />}
                            />
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        {editElm && <button type='submit' className='bg-green-600 text-white mb-4 p-2 rounded hover:bg-green-500'>Update</button>}
                        <table className='w-full mb-[10px] border-collapse border-spacing-[2px] border-gray-300'>
                            <thead className='text-start'>
                                <tr className='border-[1px] border-solid border-[#e9e9e9]'>
                                    <th className='w-[3%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>#</th>
                                    <th className='w-[10%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Firstname</th>
                                    <th className='w-[10%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Lastname</th>
                                    <th className='w-[28%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Email</th>
                                    <th className='w-[11%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Phone</th>
                                    <th className='w-[11%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Role</th>
                                    <th className='w-[11%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Status</th>
                                    <th className='w-[11%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Created At</th>
                                    <th className='w-[5%] border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.users?.map((el, index) => {
                                    const userIndex = (Math.max(params.get('page'), 1) - 1) * pageSize + 1 + index
                                    return (
                                        <tr key={index} className={`border-[1px] border-solid border-[#e9e9e9] ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{userIndex}</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                {editElm?._id === el._id ?
                                                    <InputForm
                                                        register={register}
                                                        errors={errors}
                                                        id={'firstname'}
                                                        validate={{ required: 'Firstname is required' }}
                                                    />
                                                    : highlightText(el.firstname, query)
                                                }
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                {editElm?._id === el._id ?
                                                    <InputForm
                                                        register={register}
                                                        errors={errors}
                                                        id={'lastname'}
                                                        validate={{ required: 'Lastname is required' }}
                                                    />
                                                    : highlightText(el.lastname, query)
                                                }
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                {editElm?._id === el._id ?
                                                    <InputForm
                                                        register={register}
                                                        errors={errors}
                                                        id={'email'}
                                                        validate={{
                                                            required: 'Email is required',
                                                            pattern: {
                                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                                message: 'Invalid email format. Ex: abc@gmail.com'
                                                            }
                                                        }}
                                                        defaultValue={editElm?.email}
                                                    />
                                                    : highlightText(el.email, query)
                                                }
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{editElm?._id === el._id ?
                                                <InputForm
                                                    register={register}
                                                    errors={errors}
                                                    id={'mobile'}
                                                    validate={{
                                                        required: 'Phone number is required',
                                                        pattern: {
                                                            value: /^[0-9]{9}$/,
                                                            message: 'Invalid phone number. Number must be 9 digits'
                                                        }
                                                    }}
                                                />
                                                : el.mobile
                                            }</td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                {editElm?._id === el._id ?
                                                    <Select
                                                        register={register}
                                                        errors={errors}
                                                        id={'role'}
                                                        options={roles}
                                                        validate={{
                                                            required: 'Role is required',
                                                        }} />

                                                    : roles.find(role => role.id === el.role)?.value}
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                                {editElm?._id === el._id ?
                                                    <Select
                                                        register={register}
                                                        errors={errors}
                                                        id={'isBlocked'}
                                                        options={userStatus}

                                                    />
                                                    : (el.isBlocked ? 'Blocked' : 'Active')}
                                            </td>
                                            <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(el.createdAt).format('HH:mm:ss DD-MM-YYYY')}</td>
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
                    {users?.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            No users found with the search name or email address provided above ...
                        </div>
                    )}
                    {users?.length !== 0 && (
                        <div className='w-full text-right mt-5'>
                            <Pagination
                                totalCount={users.counts}
                                pageSize={pageSize}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageUsers