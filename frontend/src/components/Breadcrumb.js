import React from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { Link } from 'react-router-dom'
import icons from '../ultils/icons'
const { IoIosArrowForward } = icons

const Breadcrumb = ({ title, category }) => {
   const routes = [
      { path: '/:category/:pid/:title', breadcrumb: title },
      { path: '/:category', breadcrumb: category },
      { path: '/', breadcrumb: 'Home' },
   ]
   const breadcrumbs = useBreadcrumbs(routes)

   return (
      <div className='w-main px-[10px] text-[14px] flex gap-1'>
         {breadcrumbs
            .filter((el) => !el.match.route === false)
            .map(({ match, breadcrumb }, index, arr) => {
               if (index === arr.length - 1) {
                  return (
                     <span key={match.pathname} className='capitalize text-[#505050] font-normal'>
                        {breadcrumb}
                     </span>
                  )
               }
               // Các phần tử khác
               return (
                  <Link className='flex items-center justify-center gap-1 hover:text-main' key={match.pathname} to={match.pathname}>
                     <span className='capitalize'>{breadcrumb}</span>
                     <IoIosArrowForward className='mt-[1px]' />
                  </Link>
               )
            })}
      </div>
   )
}

export default Breadcrumb
