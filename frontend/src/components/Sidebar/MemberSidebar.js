import React, { memo, Fragment, useState } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import avatarDefault from '../../assets/avatar-default.png'
import { useSelector } from 'react-redux'
import { memberSidebar } from '../../ultils/constants'
import icons from '../../ultils/icons'

const MemberSidebar = () => {
    const { userData } = useSelector(state => state.user)
    const { IoMdArrowDropright, IoMdArrowDropdown } = icons
    const location = useLocation()
    const [active, setActive] = useState([])

    const handleShowTabs = (id) => {
        if (active.includes(id)) {
            setActive(active.filter(item => item !== id))
        } else {
            setActive([...active, id])
        }
    }
    const isChildActive = (child) => {
        return child.some((item) => location.pathname.includes(item.path))
    }
    return (
        <div className='p-4 bg-white h-full'>
            <div className='pb-2 w-full flex flex-col justify-center items-center border-b gap-2'>
                <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-red-600 border-[1px] border-solid'>
                    <img src={userData?.avatar || avatarDefault} alt='logo' className='w-full h-full object-contain rounded-full' />
                </div>
                <span>{`${userData?.lastname} ${userData?.firstname}`}</span>
            </div>
            <div className='flex flex-col gap-2 mt-2'>
                {memberSidebar.map((item, index) => {
                    return (
                        <Fragment key={item.id}>
                            {
                                item.type === 'single' && (
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 p-2 rounded-md transition duration-150 ease-in-out ${isActive
                                                ? 'bg-teal-500 text-white text-base font-medium'
                                                : 'font-normal text-sm text-gray-700 hover:bg-teal-500 hover:text-white hover:text-base'
                                            }`
                                        }
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.value}</span>
                                    </NavLink>
                                )
                            }
                            {item.type === 'parent' && <div onClick={() => handleShowTabs(item.id)}>
                                <div
                                    className={`flex items-center text-gray-700 justify-between gap-2 p-2 hover:bg-teal-500 cursor-pointer hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out 
                                        ${isChildActive(item.children) ? 'font-medium text-base' : 'font-normal text-sm'}`}
                                >
                                    <div className='flex items-center gap-2 '>
                                        <span>{item.icon}</span>
                                        <span>{item.value}</span>
                                    </div>
                                    <div>
                                        {active.includes(item.id) ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
                                    </div>
                                </div>
                                {active.includes(item.id) && <div className='flex justify-around px-2'>
                                    <div className='w-[3px] bg-teal-200'></div>
                                    <div className='flex flex-col gap-1 mt-1' >
                                        {item.children.map((child, index) => {
                                            return (
                                                <NavLink
                                                    onClick={(e) => e.stopPropagation()}
                                                    to={child.path}
                                                    key={index}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-2 p-2 font-normal rounded-md transition duration-150 ease-in-out ${isActive
                                                            ? 'bg-teal-500 text-white text-base'
                                                            : 'text-sm text-gray-700 hover:bg-teal-500 hover:text-white hover:text-base'
                                                        }`
                                                    }
                                                >
                                                    <span>{child.value}</span>
                                                </NavLink>
                                            )
                                        })}
                                    </div>
                                </div>
                                }
                            </div>}

                        </Fragment>
                    )
                })}
            </div>
        </div >
    )
}

export default memo(MemberSidebar)
