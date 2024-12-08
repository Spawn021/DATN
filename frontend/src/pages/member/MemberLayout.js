import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import path from '../../ultils/path'

const MemberLayout = () => {
    const { isLoggedIn, userData } = useSelector(state => state.user)
    if (!isLoggedIn || !userData) return <Navigate to={`/${path.LOGIN}`} replace={true} />

    return (
        <div>
            MemberLayout
            <Outlet />
        </div>
    )
}

export default MemberLayout