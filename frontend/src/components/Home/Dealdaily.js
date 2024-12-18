import React, { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { apiProducts } from '../../redux/apis'
import icons from '../../ultils/icons'
import { formatPrice, capitalizeFirstLetter, renderStar } from '../../ultils/helpers'
const { FaStar, IoMenu } = icons

const Dealdaily = () => {
   const [hour, setHour] = useState(0)
   const [minute, setMinute] = useState(0)
   const [second, setSecond] = useState(0)
   const [dealDaily, setDealDaily] = useState([])

   const getDealDaily = async () => {
      const response = await apiProducts.getProducts({ limit: 1, page: Math.floor(Math.random() * 1), totalRating: 5 })

      if (response.success) setDealDaily(response.products[0])
   }
   // Calculate the time remaining until the next day at 00:00:00
   useEffect(() => {
      const now = new Date()
      const nextResetTime = new Date()
      nextResetTime.setHours(24, 10, 0, 0) // In JS, the value of hours is between 0 and 23, so when set to 24, it will be the next day at 00:00:00

      //   // If want to reset the timer at a specigic time, can use this code
      //   nextResetTime.setHours(15, 35, 0, 0)

      //   if (now.getTime() >= nextResetTime.getTime()) {
      //      nextResetTime.setDate(nextResetTime.getDate() + 1)
      //   }

      const timeDiff = Math.max(0, nextResetTime - now)
      const totalSeconds = Math.floor(timeDiff / 1000)
      setHour(Math.floor(totalSeconds / 3600))
      setMinute(Math.floor((totalSeconds % 3600) / 60))
      setSecond(totalSeconds % 60)
      getDealDaily()
   }, [])
   //    Update the timer every second
   useEffect(() => {
      const idInterval = setInterval(() => {
         setSecond((prevSecond) => {
            if (prevSecond > 0) return prevSecond - 1

            setMinute((prevMinute) => {
               if (prevMinute > 0) return prevMinute - 1

               setHour((prevHour) => {
                  if (prevHour > 0) return prevHour - 1

                  // Gọi lại API và reset thời gian
                  getDealDaily()
                  const now = new Date()
                  const nextResetTime = new Date()
                  nextResetTime.setHours(24, 10, 0, 0) // In JS, the value of hours is between 0 and 23, so when set to 24, it will be the next day at 00:00:00

                  //   // If want to reset the timer at a specigic time, can use this code
                  //   nextResetTime.setHours(15, 39, 0, 0)

                  //   if (now.getTime() >= nextResetTime.getTime()) {
                  //      nextResetTime.setDate(nextResetTime.getDate() + 1)
                  //   }

                  const timeDiff = Math.max(0, nextResetTime - now)
                  const totalSeconds = Math.floor(timeDiff / 1000)
                  setHour(Math.floor(totalSeconds / 3600))
                  setMinute(Math.floor((totalSeconds % 3600) / 60))
                  setSecond(totalSeconds % 60)
                  return 0
               })
               return 59
            })
            return 59
         })
      }, 1000)

      return () => clearInterval(idInterval)
   }, [])

   let newPrice = dealDaily?.price - (dealDaily?.price * dealDaily?.discountPercentage) / 100
   newPrice = Math.round(newPrice / 1000) * 1000
   return (
      <div className='border w-full flex-auto'>
         <div className=' flex items-center justify-between mt-5'>
            <FaStar className='text-main ml-4' />
            <span className='text-[#505050] font-bold text-[20px]'> DAILY DEALS</span>
            <span></span>
         </div>
         <div className='flex flex-col justify-center items-center mt-2'>
            <img
               src={dealDaily?.thumbnail || 'https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png'}
               alt={dealDaily?.name}
               className='w-[full] object-cover'
            />
            <div className=' line-clamp-1 mb-[6px] '>{capitalizeFirstLetter(dealDaily?.title)}</div>
            <div className='flex text-[20px]'>{renderStar(dealDaily?.totalRating)}</div>
            {dealDaily?.discountPercentage > 0 ? (
               <div className=' flex flex-col justify-center items-center'>
                  <div>
                     <span className='line-through text-[#7d7c7c]'>{`${formatPrice(dealDaily?.price)} VND`}</span>
                     <span className='text-main'>{`-${dealDaily?.discountPercentage}%`}</span>
                  </div>
                  <span className='mb-[10px]'>{`${formatPrice(newPrice)} VND`}</span>
               </div>
            ) : (
               <div className=' mb-[35px]'>{`${formatPrice(dealDaily?.price)} VND`}</div>
            )}
            <div className='flex w-full justify-center items-center gap-2'>
               <div className='flex flex-col justify-center items-center w-[28%] h-[60px] border bg-[#f4f4f4]'>
                  <div className='text-[18px] text-[#151515] font-semibold'>{hour}</div>
                  <div className='text-[12px] text-[#8b8b8b] '>Hours</div>
               </div>
               <div className='flex flex-col justify-center items-center w-[28%] h-[60px] border bg-[#f4f4f4]'>
                  <div className='text-[18px] text-[#151515] font-semibold'>{minute}</div>
                  <div className='text-[12px] text-[#8b8b8b] '>Minutes</div>
               </div>
               <div className='flex flex-col justify-center items-center w-[28%] h-[60px] border bg-[#f4f4f4]'>
                  <div className='text-[18px] text-[#151515] font-semibold'>{second}</div>
                  <div className='text-[12px] text-[#8b8b8b] '>Seconds</div>
               </div>
            </div>
            <div className='mt-2'>
               <Link to={`/${dealDaily?.category}/${dealDaily?._id}/${dealDaily?.title}`}>
                  <button
                     type='button'
                     className='font-normal w-[250px] py-[11px] px-[15px] flex items-center justify-center gap-4 bg-main text-white hover:bg-[#333333]'
                  >
                     <IoMenu className=' text-[20px]' />
                     <span>OPTIONS</span>
                  </button>
               </Link>
            </div>
         </div>
      </div>
   )
}

export default memo(Dealdaily)
