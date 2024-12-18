import React, { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Navigation, TopHeader, Footer, ScrollToTopButton, ScrollToTopHandler } from '../../components'

const PublicLayout = () => {
   const scrollContainerRef = useRef(null)
   return (
      <div ref={scrollContainerRef} className='w-full h-screen overflow-y-auto flex flex-col items-center'>
         <div className='w-full flex flex-col items-center justify-center'>
            <TopHeader />
            <Header />
            <Navigation />
            <Outlet />
            <Footer />
         </div>
         <ScrollToTopButton scrollContainerRef={scrollContainerRef} />
         <ScrollToTopHandler scrollContainerRef={scrollContainerRef} />
      </div>
   )
}

export default PublicLayout
