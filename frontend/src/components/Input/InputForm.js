import React, { memo } from 'react'

const InputForm = ({ label, disabled, register, errors, id, validate, type = 'text', placeholder, defaultValue }) => {
    return (
        <div className='flex flex-col gap-1'>
            {label && <label htmlFor={id} className='block text-sm font-medium text-gray-700'>{label}</label>}
            <input
                id={id}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                {...register(id, validate)}
                className={`mt-1 my-auto block w-full px-3 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'}
                rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                defaultValue={defaultValue}
            />
            {errors[id] && <span className='text-red-500 text-xs'>{errors[id].message}</span>}


        </div>
    )
}

export default memo(InputForm)