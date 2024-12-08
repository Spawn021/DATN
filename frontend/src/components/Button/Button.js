import React, { memo } from 'react'

const Button = ({ name, handleOnClick, className, type }) => {
   return (
      <button
         type={type || 'button'}
         className={`${className}`}
         onClick={() => {
            handleOnClick && handleOnClick()
         }}
      >
         <span>{name}</span>
      </button>
   )
}

export default memo(Button)
