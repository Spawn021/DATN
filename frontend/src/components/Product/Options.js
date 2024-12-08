import React, { memo } from 'react'

const Options = ({ icon, content }) => {
   return (
      <div className='group relative w-10 h-10 bg-white border rounded-full shadow-md flex items-center justify-center hover:bg-black hover:border-black hover:text-white cursor-pointer'>
         {icon}

         <div className='pointer-events-none text-center p-1 w-[85px] text-[14px] font absolute top-full bg-white text-black left-1/2 transform -translate-x-1/2 border rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            {content}
         </div>
      </div>
   )
}

export default memo(Options)
