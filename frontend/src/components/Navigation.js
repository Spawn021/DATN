import React from 'react'
import { navigation } from '../ultils/constants'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
   return (
      <div className='ml-[10px] w-[1210px] flex items-center h-[48px] py-2 border-y-[1px] border-solid border-[#0000001a] mb-5 '>
         {navigation.map((nav, index) => {
            return (
               <NavLink
                  key={index}
                  to={nav.path}
                  className={({ isActive }) => {
                     const activeClass = isActive ? 'text-main' : ''
                     return `text-[14px] text-[#505050] uppercase font-medium ${activeClass} hover:text-main pr-12`
                  }}
               >
                  {nav.value}
               </NavLink>
            )
         })}
      </div>
   )
}

export default Navigation
