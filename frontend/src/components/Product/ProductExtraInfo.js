import React, { memo } from 'react'

const ProductExtraInfo = ({ title, content, icon }) => {
   return (
      <div className='flex items-center mb-2 gap-4 p-[10px] border-[2px] border-solid'>
         <div className=' text-[20px]  bg-[#505050] rounded-full p-2 text-white'>{icon}</div>
         <div>
            <div className='text-[14px]'>{title}</div>
            <div className='text-[12px] text-[#999]'>{content}</div>
         </div>
      </div>
   )
}

export default memo(ProductExtraInfo)
