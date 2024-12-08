import React, { useState, useEffect } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import { apiUsers } from '../../redux/apis'
import { roles } from '../../ultils/constants'
import icons from '../../ultils/icons'
import { InputField, Pagination } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { highlightText } from '../../ultils/helpers'

const ManageUsers = () => {
    const { CiEdit, MdDelete, FaSearch } = icons
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [pageSize, setPageSize] = useState(10);
    const [edit, setEdit] = useState(false)
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
    }, [params, pageSize]);

    const handlePageSizeChange = (e) => {
        const newPageSize = Number(e.target.value);
        setPageSize(newPageSize);
    }

    console.log(edit)
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
                    <table className='w-full mb-[10px] border-collapse border-spacing-[2px] border-gray-300'>
                        <thead className='text-start'>
                            <tr className='border-[1px] border-solid border-[#e9e9e9]'>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>#</th>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Fullname</th>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Email</th>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Phone</th>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Role</th>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Created At</th>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Status</th>
                                <th className='border-b-[1px] border-t-[1px] border-solid border-[#dee2e6] py-3 px-4 text-start'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.users?.map((user, index) => {
                                const userIndex = (Math.max(params.get('page'), 1) - 1) * pageSize + 1 + index
                                return (
                                    <tr key={index} className={`border-[1px] border-solid border-[#e9e9e9] ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                        <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{userIndex}</td>
                                        <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                            {highlightText(`${user.lastname} ${user.firstname}`, query)}
                                        </td>
                                        <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>
                                            {highlightText(user.email, query)}
                                        </td>
                                        <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{user.mobile}</td>
                                        <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{roles[user.role]}</td>
                                        <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{moment(user.createdAt).format('HH:mm:ss DD-MM-YYYY')}</td>
                                        <td className='py-3 px-4 border-y-[1px] border-solid border-[#e9e9e9]'>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                                        <td className='flex gap-2 items-center justify-center  border-solid border-[#e9e9e9] h-[55px]'>
                                            <button onClick={() => setEdit(user)} className='text-blue-500 hover:text-blue-700 group relative cursor-pointer'>
                                                <CiEdit size={23} />
                                                <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                    Edit
                                                </div>
                                            </button>
                                            <button className='text-red-500 hover:text-red-700 group relative cursor-pointer'>
                                                <MdDelete size={23} />
                                                <div className='pointer-events-none text-center p-2 text-[12px] absolute top-full bg-black text-white left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 before:absolute before:content-[""] before:w-2 before:h-2 before:bg-black before:rotate-45 before:-top-1 before:left-1/2 before:transform before:-translate-x-1/2'>
                                                    Delete
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
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
