import React, { useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../ultils/helpers'
import { getProdCategories } from '../../redux/features/prodCategorySlice'
import icons from '../../ultils/icons'

const Sidebar = () => {
   const { GiTablet, CiCamera, IoIosLaptop, GiSmartphone, PiTelevisionThin, BsPrinter, BsSpeaker, TfiHeadphone } = icons
   const categoryIcons = {
      tablet: <GiTablet />,
      camera: <CiCamera />,
      laptop: <IoIosLaptop />,
      smartphone: <GiSmartphone />,
      television: <PiTelevisionThin />,
      printer: <BsPrinter />,
      speaker: <BsSpeaker />,
      accessories: <TfiHeadphone />,
   }
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
                  className='flex items-center px-5 pt-[15px] pb-[14px] text-[#1c1d1d] hover:text-main hover:bg-[#f6f6f6]'
               >
                  <span className='mr-2 text-[20px]'>{categoryIcons[item.slug] || null}</span>
                  <div className='font-normal text-[16px]'>{capitalizeFirstLetter(item.title)}</div>
               </NavLink>
            )
         })}
      </div>
   )
}

export default memo(Sidebar)
