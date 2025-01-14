import React, { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import path from '../../ultils/path'
import { AdminSidebar } from '../../components'
import icons from '../../ultils/icons'

const AdminLayout = () => {
    const { IoMenu } = icons
    const location = useLocation()
    const [active, setActive] = useState(true)
    const { isLoggedIn, userData } = useSelector(state => state.user)

    const routeNames = {
        [`/${path.ADMIN}/${path.DASHBOARD}`]: 'Dashboard',
        [`/${path.ADMIN}/${path.MANAGE_USERS}`]: 'Manage Users',
        [`/${path.ADMIN}/${path.MANAGE_PRODUCTS}`]: 'Manage Products',
        [`/${path.ADMIN}/${path.MANAGE_ORDERS}`]: 'Manage Orders',
        [`/${path.ADMIN}/${path.CREATE_PRODUCT}`]: 'Create Product',
        [`/${path.ADMIN}/${path.MANAGE_COUPONS}`]: 'Manage Coupons',
        [`/${path.ADMIN}/${path.CREATE_COUPON}`]: 'Create Coupon',
    };

    const currentRoute = routeNames[location.pathname]
    if (!isLoggedIn || !userData || userData.role !== 'admin') return <Navigate to={`/${path.LOGIN}`} replace={true} />

    return (
        <div className='flex w-full min-h-screen'>
            <div className={`h-screen sticky top-0 transition-all duration-300 ${active ? 'w-[15%]' : 'w-0 overflow-hidden'}`}>
                {active && <AdminSidebar />}
            </div>
            <div className={`bg-[#f9fafb] transition-all duration-300 ${active ? 'w-[85%]' : 'w-[100%]'}`}>
                <div className='h-[52px] bg-white flex items-center gap-2 px-4 shadow-md'>
                    <IoMenu onClick={() => setActive(!active)} className='text-3xl text-gray-500 cursor-pointer' />
                    <span className='text-xl font-semibold'>{currentRoute}</span>
                </div>

                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
