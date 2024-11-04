const InputField = ({ value, handleChange, handleBlur, error, nameKey, type, className, placeholder, label }) => {
   return (
      <div className='w-full relative'>
         {value?.trim() !== '' && (
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
         />
         {error && <span className='text-red-500 text-xs '>{error}</span>}
      </div>
   )
}
export default InputField
