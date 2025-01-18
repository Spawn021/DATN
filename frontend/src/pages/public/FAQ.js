import React, { useState } from 'react'
import { Breadcrumb } from '../../components'
import icons from '../../ultils/icons'
import { faqData } from '../../ultils/constants'

const FAQ = () => {
   const { FaPlus, FaMinus } = icons
   const [openQuestionId, setOpenQuestionId] = useState(null);

   const handleToggleQuestion = (id) => {
      setOpenQuestionId((prevId) => (prevId === id ? null : id));
   };
   return <div className='w-full'>
      <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
         <div className='w-main px-[10px] font-semibold text-[18px] uppercase'>FAQS</div>
         <Breadcrumb />
      </div>
      <div className='w-main mx-auto pt-4 pb-4 px-[10px]'>
         {faqData.map((item) => (
            <div key={item.id} className='mb-4 border border-gray-200'>
               <div
                  className={`px-5 py-[15px] flex justify-between items-center cursor-pointer ${openQuestionId === item.id ? 'text-white bg-main' : 'hover:text-main'}`}
                  onClick={() => handleToggleQuestion(item.id)}
               >
                  <h3 className='font-normal text-[16px]'>{`${item.id}. ${item.question}`}</h3>
                  <span>
                     {openQuestionId === item.id ? <FaMinus size={18} /> : <FaPlus size={18} />}
                  </span>
               </div>
               {openQuestionId === item.id && (
                  <p className='text-gray-600 text-[14px] px-5 py-[15px]'>{item.answer}</p>
               )}
            </div>

         ))}
      </div>
   </div>
}

export default FAQ
