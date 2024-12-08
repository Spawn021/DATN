import React, { memo } from 'react'
const InputField = ({ value, handleChange, handleBlur, error, nameKey, type, className, placeholder, label, icon }) => {
   return (
      <div className='w-full relative'>
         {value && value?.trim() !== '' && (
            <label
               htmlFor={nameKey}
               className='text-[14px] text-blue-400 absolute top-[-3px] font-medium left-[15px] bg-white animate-slide-top-sm '
            >
               {label}
            </label>
         )}
         <input
            type={type || 'text'}
            placeholder={placeholder}
            value={value}
            name={nameKey}
            onChange={handleChange}
            className={`rounded-[8px] py-[10px] px-[15px] text-[13px] border ${className} `}
         // autoComplete={type === 'password' ? 'new-password' : 'off'}
         />
         {error && <span className='text-red-500 text-xs '>{error}</span>}
         <div className='absolute top-1/4 right-0 px-3 text-gray-500'>{icon}</div>

      </div>
   )
}
export default memo(InputField)
