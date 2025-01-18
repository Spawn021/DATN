import React, { memo } from 'react'

const Banner = () => {
   return (
      <div className='w-full'>
         <img
            src='https://cdn-media.sforum.vn/storage/app/media/ctvseo_15/banner%20T%E1%BA%BFt/banner-tet-thumb.jpg'
            alt='banner'
            className='h-[470px] w-full object-cover '
         ></img>
      </div>
   )
}

export default memo(Banner)
