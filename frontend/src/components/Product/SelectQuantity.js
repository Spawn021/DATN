import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleIncrement, handleDecrement }) => {
   return (

      <div className='flex'>
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

   )
}

export default memo(SelectQuantity)
