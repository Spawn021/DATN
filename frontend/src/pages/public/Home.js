import React from 'react'
import { Sidebar, Banner, TabProduct, Dealdaily, FeaturedProduct, NewArrival, HotCollection, BlogPost } from '../../components'
import banner3 from '../../assets/banner3.png'
import banner4 from '../../assets/banner4.png'
import banner5 from '../../assets/banner5.png'
import banner6 from '../../assets/banner6.png'
import { useSelector } from 'react-redux'

const Home = () => {
   const user = useSelector((state) => state.user)
   console.log(user)
   return (
      <>
         <div className='w-main flex '>
            <div className='flex flex-col gap-4 w-[25%] flex-auto pl-3'>
               <Sidebar />
               <Dealdaily />
            </div>
            <div className='flex flex-col gap-4 pl-5 w-[75%] flex-auto '>
               <Banner />
               <TabProduct />
            </div>
         </div>
         <div className='mt-9 pl-3'>
            <FeaturedProduct />
         </div>
         <div className='flex mt-[20px] pl-3 justify-between '>
            <div className='relative group w-[615px] h-[655px]'>
               <img src={banner3} alt='banner3' className='w-full h-full object-cover hover:cursor-pointer'></img>
               <div className='group-hover:cursor-pointer absolute top-0 left-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
               <div className='group-hover:cursor-pointer absolute bottom-0 right-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
            </div>
            <div className='flex flex-col gap-4 '>
               <div className='relative group h-[338px]'>
                  <img src={banner4} alt='banner4' className='h-full object-contain hover:cursor-pointer' />
                  <div className='group-hover:cursor-pointer absolute top-0 left-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
                  <div className='group-hover:cursor-pointer absolute bottom-0 right-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
               </div>
               <div className='relative group w-full '>
                  <img src={banner5} alt='banner5' className=' hover:cursor-pointer h-[300px] object-contain' />
                  <div className='group-hover:cursor-pointer absolute top-0 left-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
                  <div className='group-hover:cursor-pointer absolute bottom-0 right-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
               </div>
            </div>
            <div className='relative group w-[280px] h-[655px] '>
               <img src={banner6} alt='banner6' className='w-full h-full object-contain hover:cursor-pointer' />
               <div className='group-hover:cursor-pointer absolute top-0 left-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
               <div className='group-hover:cursor-pointer absolute bottom-0 right-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
            </div>
         </div>
         <div className='mt-9 pl-3'>
            <NewArrival />
         </div>
         <div className='mt-3 pl-3'>
            <HotCollection />
         </div>
         <div className='mt-6 pl-3'>
            <BlogPost />
         </div>

         {/* <div className='h-[500px]'></div> */}
      </>
   )
}

export default Home
