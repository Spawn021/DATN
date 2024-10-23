import React from 'react'
import { Sidebar, Banner, TabProduct } from '../../components'

const Home = () => {
   return (
      <div className='w-main flex '>
         <div className='flex flex-col gap-4 w-[25%] flex-auto pl-5'>
            <Sidebar />
            <span>Deal daily</span>
         </div>
         <div className='flex flex-col gap-4 pl-5 w-[75%] flex-auto '>
            <Banner />
            <TabProduct />
         </div>
      </div>
   )
}

export default Home
