import React, { memo } from 'react'

const InputField = ({ value, setValue, nameKey, type, invalidField, setInvalidField, className }) => {
   return (
      <div className='w-full relative'>
         {value?.trim() !== '' && (
            <label htmlFor={nameKey} className='text-[13px] absolute top-[-3px] font-normal left-[15px] bg-white animate-slide-top-sm '>
               {nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
            </label>
         )}
         <input
            type={type || 'text'}
            placeholder={nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
            value={value}
            className={`rounded-[8px] py-[10px] px-[15px] text-[13px] border ${className} `}
            onChange={(e) => setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))}
            autoComplete={type === 'password' ? 'current-password' : 'on'}
         />
      </div>
   )
}
export default memo(InputField)
