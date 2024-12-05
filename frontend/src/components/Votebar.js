import React, { useEffect, useRef } from 'react'
import icons from '../ultils/icons'

const Votebar = ({ number, ratingCount, totalRatingCount }) => {
    const { FaStar } = icons
    const barRef = useRef(1)
    useEffect(() => {
        const temp = Math.round(ratingCount / totalRatingCount * 100) || 0
        barRef.current.style.cssText = `right: ${100 - temp}% `
    }, [ratingCount, totalRatingCount])

    return (
        <div className='flex items-center gap-2 text-sm text-gray-500'>
            <div className='flex w-[5%] items-center text-sm'>
                <span className='w-1/2 text-center'>{number}</span>
                <FaStar className='text-yellow-400' />
            </div>
            <div className='w-[80%]'>
                <div className='h-[6px] bg-gray-200 rounded-full relative'>
                    <div ref={barRef} className='absolute h-full inset-0 rounded-full bg-red-500 '></div>
                </div>

            </div>
            <div className='pl-2 flex w-[10%] gap-1 items-center '>
                <span className='w-[10px] text-center'>{ratingCount || 0}</span>
                {ratingCount > 1 ? <span className='text-xs text-gray-400'>reviews</span> : <span className='text-xs text-gray-400'>review</span>}
            </div>
        </div>
    )
}

export default Votebar
