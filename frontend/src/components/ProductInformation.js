import React, { memo, useState } from 'react'
import { productDescriptionTabs } from '../ultils/constants'

const ProductInformation = () => {
   const [activeTab, setActiveTab] = useState(1)
   return (
      <div>
         <div className='flex items-center gap-2 relative bottom-[-1px] '>
            {productDescriptionTabs.map((tab) => {
               return (
                  <span
                     key={tab.id}
                     className={`py-[9px] px-5 border-[1px] border-solid border-b-0 cursor-pointer hover:bg-white ${
                        activeTab === tab.id ? 'bg-white border-b-transparent ' : 'bg-[#f1f1f1]'
                     }`}
                     onClick={() => setActiveTab(tab.id)}
                  >
                     {tab.name}
                  </span>
               )
            })}
         </div>
         <div className='border-[#ebebeb] border-[1px] border-solid '>
            <div className='p-3'>
               {productDescriptionTabs.some((tab) => tab.id === activeTab) &&
                  productDescriptionTabs.find((tab) => tab.id === activeTab)?.content}
            </div>
         </div>
      </div>
   )
}

export default memo(ProductInformation)
