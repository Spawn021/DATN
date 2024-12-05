import React, { memo, useEffect, useState } from 'react'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import icons from '../ultils/icons'
import { colors } from '../ultils/constants'
import { apiProducts } from '../redux/apis'
import { formatPrice } from '../ultils/helpers'
import useDebounce from '../hooks/useDebounce'

const FilterItem = ({ name, active, handleActiveFilter, type = 'checkbox' }) => {
   const { FaChevronDown } = icons
   const { category } = useParams()
   const navigate = useNavigate()
   const [selected, setSelected] = useState([])
   const [params] = useSearchParams()
   const [bestPrice, setBestPrice] = useState(null)
   const [price, setPrice] = useState({ from: '', to: '' })
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
      let param = [...params.entries()]
      let queries = {}
      param.forEach((item) => {
         queries[item[0]] = item[1]
      })
      if (selected.length > 0) {
         queries.color = selected.join(',')
         queries.page = 1
      } else {
         delete queries.color
      }
      navigate({
         pathname: `/${category}`,
         search: createSearchParams(queries).toString(),
      })
   }, [selected, navigate, category])
   const getBestPriceProduct = async () => {
      // const response = await apiProducts.getProducts({ sort: '-price', limit: 1, category: category })
      const response = await apiProducts.getProducts({ sort: '-price', limit: 1 })
      if (response.success) {
         setBestPrice(response.products[0].price)
      }
   }
   useEffect(() => {
      if (type === 'input') {
         getBestPriceProduct()
      }
   }, [type])
   const debouncePriceFrom = useDebounce(price.from, 500)
   const debouncePriceTo = useDebounce(price.to, 500)
   useEffect(() => {
      let param = [...params.entries()]
      let queries = {}
      param.forEach((item) => {
         queries[item[0]] = item[1]
      })
      if (Number(price.from) > 0) {
         queries.from = price.from
      } else {
         delete queries.from
      }
      if (Number(price.to) > 0) {
         queries.to = price.to
      } else {
         delete queries.to
      }
      queries.page = 1
      navigate({
         pathname: `/${category}`,
         search: createSearchParams(queries).toString(),
      })
   }, [debouncePriceFrom, debouncePriceTo])
   return (
      <div
         onClick={() => handleActiveFilter(name)}
         className={`relative border-[1px] border-solid border-[#1a1b188c] h-[45px] flex items-center justify-between pl-[30px] cursor-pointer hover:shadow-variant ${active === name ? 'shadow-variant' : ''
            }`}
      >
         <span className='capitalize text-[12px] font-normal text-[#1A1B18]'>{name}</span>
         <FaChevronDown className='mx-5 text-[12px] font-normal text-[#1A1B18]' />
         {active === name && (
            <div
               onClick={(e) => e.stopPropagation()}
               className='absolute top-calc-100-plus-4 left-0 bg-red border-[1px] border-solid border-[#1a1b1833] z-50 bg-white w-[385px]'
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
                                 handleActiveFilter()
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
               {type === 'input' && (
                  <div>
                     <div className='py-[30px] px-5 cursor-default border-b-[1px] border-solid border-[#1a1b1833]'>
                        <div className='flex justify-between text-[14px]'>
                           <span className='text-[#505050]'>{`The highest price is ${formatPrice(bestPrice)} VND`}</span>
                           <span
                              onClick={() => {
                                 setPrice({ from: '', to: '' })
                                 handleActiveFilter()
                              }}
                              className='underline hover:text-main cursor-pointer'
                           >
                              Clear
                           </span>
                        </div>
                     </div>
                     <div className='flex items-center justify-between gap-4 py-4 cursor-default px-5'>
                        <div className='flex items-center gap-2'>
                           <label htmlFor='from' className='text-[14px] text-[#505050]'>
                              From
                           </label>
                           <input
                              type='number'
                              id='from'
                              value={price.from}
                              onChange={(e) => setPrice({ ...price, from: e.target.value })}
                              className='w-[130px] h-[40px] border-[1px] border-solid border-[#1a1b1833] rounded px-2 bg-[#f6f6f6]'
                           />
                        </div>
                        <div className='flex items-center gap-2'>
                           <label htmlFor='to' className='text-[14px] text-[#505050]'>
                              To
                           </label>
                           <input
                              type='number'
                              id='to'
                              className='w-[130px] h-[40px] border-[1px] border-solid border-[#1a1b1833] rounded px-2 bg-[#f6f6f6]'
                              value={price.to}
                              onChange={(e) => setPrice({ ...price, to: e.target.value })}
                           />
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   )
}

export default memo(FilterItem)
