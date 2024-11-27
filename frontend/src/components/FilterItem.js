import React, { memo, useEffect, useState } from 'react'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import icons from '../ultils/icons'
import { colors } from '../ultils/constants'

const FilterItem = ({ name, active, handleActiveFilter, type = 'checkbox' }) => {
   const { FaChevronDown } = icons
   const { category } = useParams()
   const navigate = useNavigate()
   const [selected, setSelected] = useState([])
   const handleSelect = (e) => {
      const { value } = e.target
      if (selected.includes(value)) {
         setSelected(selected.filter((item) => item !== value))
      } else {
         setSelected([...selected, value])
      }
      handleActiveFilter()
   }
   useEffect(() => {
      navigate({
         pathname: `/${category}`,
         search: createSearchParams({
            color: selected,
         }).toString(),
      })
   }, [selected, category, navigate])
   return (
      <div
         onClick={() => handleActiveFilter(name)}
         className={`relative border-[1px] border-solid border-[#1a1b188c] h-[45px] flex items-center justify-between pl-[30px] cursor-pointer hover:shadow-variant ${
            active === name ? 'shadow-variant' : ''
         }`}
      >
         <span className='capitalize text-[12px] font-normal text-[#1A1B18]'>{name}</span>
         <FaChevronDown className='mx-5 text-[12px] font-normal text-[#1A1B18]' />
         {active === name && (
            <div
               onClick={(e) => e.stopPropagation()}
               className='absolute top-calc-100-plus-4 left-0 bg-red border-[1px] border-solid border-[#1a1b1833] z-50 bg-white w-[350px]'
            >
               {type === 'checkbox' && (
                  <div className='h-[300px] overflow-y-scroll'>
                     <div className='py-[30px] px-5 cursor-default border-b-[1px] border-solid border-[#1a1b1833]'>
                        <div className='flex justify-between text-[14px]'>
                           <span className='text-[#505050]'>{`${selected.length} selected`}</span>
                           <span
                              onClick={(e) => {
                                 e.stopPropagation()
                                 setSelected([])
                              }}
                              className='underline hover:text-main cursor-pointer'
                           >
                              Clear
                           </span>
                        </div>
                     </div>
                     <div className='flex flex-col gap-2 py-4 cursor-default '>
                        {colors.map((color, index) => {
                           return (
                              <div key={index} className='flex items-center text-[#505050] px-5 '>
                                 <div className='flex justify-center items-center gap-3 cursor-pointer'>
                                    <input
                                       type='checkbox'
                                       id={color}
                                       onChange={handleSelect}
                                       value={color}
                                       checked={selected.includes(color)}
                                       className='cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500'
                                    />
                                    <label htmlFor={color} className='cursor-pointer capitalize text-[14px]'>
                                       {color}
                                    </label>
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   )
}

export default memo(FilterItem)
