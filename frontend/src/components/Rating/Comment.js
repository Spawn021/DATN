import React, { memo } from 'react'
import moment from 'moment'
import avatar from '../../assets/avatar-default.png'
import { renderStar } from '../../ultils/helpers'
const Comment = ({ image = avatar, name = 'Anonymous', updatedAt, star, comment }) => {
    console.log(updatedAt)

    return (
        <div className='flex gap-5'>
            <div className='flex-none'>
                <img src={image} alt='avatar' className='w-[25px] h-[25px] object-cover rounded-full ' />
            </div>
            <div className='flex flex-col flex-auto'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-semibold'>{name}</h3>
                    <p className='text-xs italic'>{moment(updatedAt)?.fromNow()}</p>
                </div>
                <div className='flex flex-col gap-2 px-4 text-sm mt-4 border border-gray-300 py-2 bg-gray-100'>
                    <div className='flex items-center gap-1'>
                        <span className='font-semibold'>Rating:</span>
                        <span className='flex items-center gap-[2px]'>{renderStar(star)}</span>
                    </div>
                    <div className='flex gap-1'>
                        <span className='font-semibold'>Comment: </span>
                        <span>{comment}</span>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Comment)