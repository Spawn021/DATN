import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams, useNavigate } from 'react-router-dom'

const HotCollection = () => {
   const navigate = useNavigate()
   const categories = useSelector((state) => state.prodCategory.categories)

   return (
      <>
         <h2 className='text-xl font-semibold text-[#151515] border-main border-b-[2px] pb-4 mb-4 '>HOT COLLECTIONS</h2>
         <div className='grid grid-cols-3 w-full gap-5'>
            {categories
               ?.filter((el) => el.brand.length > 0)
               .map((item, index) => {
                  return (
                     <div key={index} className='flex border p-[15px] h-[227px] '>
                        <img src={item.image} alt={item.title} className='w-1/2 h-2/3 object-contain pl-5 hover:cursor-pointer' />
                        <div className='flex flex-col pl-5'>
                           <div className='font-semibold uppercase text-[14px] text-[#505050] mb-[10px]'> {item.title} </div>
                           <ul className='flex flex-col'>
                              {item.brand.map((el, index) => {
                                 return (
                                    <li
                                       key={index}
                                       className='flex text-[#808080] text-[14px] font-normal hover:text-main group mb-[5px]'
                                       onClick={() => navigate({
                                          pathname: `/${item.title}`,
                                          search: createSearchParams({ brand: el }).toString()
                                       })}
                                    >
                                       <div className='pr-2 group-hover:cursor-pointer group-hover:text-main '>{'>'}</div>
                                       <div className='group-hover:cursor-pointer group-hover:text-main'>{el}</div>
                                    </li>
                                 )
                              })}{' '}
                           </ul>
                        </div>
                     </div>
                  )
               })}
         </div>
      </>
   )
}

export default memo(HotCollection)
