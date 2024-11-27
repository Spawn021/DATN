import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, inStock, handleIncrement, handleDecrement }) => {
   return (
      <div className='flex items-center gap-10 my-4'>
         <div className='text-[14px] text-[#151515] font-semibold'>Quantity</div>

         <div>
            <button
               className='w-[30px] h-[30px] border-[1px] border-solid border-[#7a7a7a] text-[16px] text-[#333] font-semibold rounded bg-gray-200 hover:bg-gray-400'
               onClick={handleDecrement}
            >
               -
            </button>
            <input
               type='text'
               className='w-[50px] h-[30px] border-[1px] border-solid border-[#7a7a7a] rounded  text-[#333] font-semibold text-center'
               value={quantity}
               onChange={(e) => handleQuantity(e.target.value)}
            />
            <button
               className='w-[30px] h-[30px] border-[1px] border-solid border-[#7a7a7a] text-[16px] text-[#333] font-semibold rounded bg-gray-200 hover:bg-gray-400'
               onClick={handleIncrement}
            >
               +
            </button>
         </div>
         <div className='text-[14px] text-[#151515] font-semibold'>In stock: {inStock}</div>
      </div>
   )
}

export default memo(SelectQuantity)
