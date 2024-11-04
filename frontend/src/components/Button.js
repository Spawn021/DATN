import React, { memo } from 'react'

const Button = ({ name, handleOnClick, className, iconBefore, iconAfter, type }) => {
   return (
      <button
         type={type || 'button'}
         className={`${className}`}
         onClick={() => {
            handleOnClick && handleOnClick()
         }}
      >
         {iconBefore}
         <span>{name}</span>
         {iconAfter}
      </button>
   )
}

export default memo(Button)
