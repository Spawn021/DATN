import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { capitalizeFirstLetter } from '../ultils/helpers'
import { getProdCategories } from '../redux/features/prodCategorySlice'

const Sidebar = () => {
   const dispatch = useDispatch()
   const categories = useSelector((state) => state.prodCategory.categories)

   useEffect(() => {
      dispatch(getProdCategories())
   }, [dispatch])

   return (
      <div className='flex flex-col border'>
         <div className='text-[#fff] uppercase text-base font-semibold py-[10px] px-5 bg-main'>ALL COLLECTIONS</div>
         {categories?.map((item, index) => {
            return (
               <NavLink
                  key={index}
                  to={`${item.slug}`}
                  className='font-normal px-5 pt-[15px] pb-[14px] text-[14px] text-[#1c1d1d] hover:text-main'
               >
                  {capitalizeFirstLetter(item.title)}
               </NavLink>
            )
         })}
      </div>
   )
}

export default Sidebar
