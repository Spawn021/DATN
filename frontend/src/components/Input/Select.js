import React, { memo } from 'react'

const Select = ({ label, options = [], register, errors, id, validate }) => {
    return (
        <div className='flex flex-col gap-2'>
            {label && <label htmlFor={id} className='block text-sm font-medium text-gray-700'>{label}</label>}
            <select
                id={id}
                {...register(id, validate)}
                className={`my-auto mt-1 block w-full px-1 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'}
                rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            >
                <option value=''>Choose</option>
                {options?.map((option, index) => (
                    <option key={index} value={option.id}>{option.value}</option>
                ))}
            </select>
            {errors[id] && <span className='text-red-500 text-xs'>{errors[id].message}</span>}
        </div>
    )
}

export default memo(Select)