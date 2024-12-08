import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Navigation, TopHeader, Footer, ScrollToTopButton } from '../../components'

const PublicLayout = () => {
   return (
      <div className='w-full flex flex-col items-center'>
         <ScrollToTopButton />
         <TopHeader />
         <Header />
         <Navigation />
         <div className='w-full flex flex-col items-center justify-center'>
            <Outlet />
         </div>
         <Footer />
      </div>
   )
}

export default PublicLayout
