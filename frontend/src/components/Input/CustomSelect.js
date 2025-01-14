import React, { memo } from 'react'
import Select from 'react-select'

const CustomSelect = ({ label, placeholder, onChange, options = [], value, className }) => {
    return (
        <div>
            {label && <label className='text-sm font-semibold text-gray-600'>{label}</label>}
            <Select
                options={options}
                onChange={onChange}
                value={value}
                isClearable
                placeholder={placeholder}
                className={className}
                isSearchable
                formatOptionLabel={(option) => (
                    <div className='flex items-center gap-2'>
                        <span>{option.label}</span>
                    </div>
                )}
            />
        </div>
    )
}

export default memo(CustomSelect)