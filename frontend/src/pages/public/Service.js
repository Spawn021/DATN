import React from 'react'
import { Breadcrumb } from '../../components'

const Service = () => {
   return <div className='w-full'>
      <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
         <div className='w-main px-[10px] font-semibold text-[18px] uppercase'>Our services</div>
         <Breadcrumb />
      </div>
   </div>
}

export default Service
