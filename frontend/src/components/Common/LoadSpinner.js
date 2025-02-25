import React, { memo } from 'react'
import { RotatingLines } from 'react-loader-spinner'

const LoadSpinner = ({ className }) => {
   return (
      <div className={className}>
         <RotatingLines
            visible={true}
            height='96'
            width='96'
            color='grey'
            strokeWidth='5'
            animationDuration='0.75'
            ariaLabel='rotating-lines-loading'
            wrapperStyle={{}}
            wrapperClass=''
         />
      </div>
   )
}

export default memo(LoadSpinner)
