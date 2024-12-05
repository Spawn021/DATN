import React, { memo } from 'react'

const InputSelect = ({ value, changeValue, options }) => {
   return (
      <select
         className='w-full border-[1px] border-solid border-[#1a1b188c] h-[43px] flex items-center justify-between py-2.5 px-4 focus:outline-none cursor-pointer hover:shadow-variant text-[12px] form-select appearance-none pr-8 pl-2 bg-no-repeat'
         value={value || ''}
         onChange={(e) => changeValue(e.target.value)}
      >
         <option value=''>Choose</option>
         {options?.map((option, index) => {
            return (
               <option key={index} value={option.value}>
                  {option.label}
               </option>
            )
         })}
      </select>
   )
}

export default memo(InputSelect)
