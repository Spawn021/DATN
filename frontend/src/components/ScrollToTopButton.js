import React, { useState, useEffect } from 'react'
import icons from '../ultils/icons'

const ScrollToTopButton = () => {
   const { FaCaretUp } = icons
   const [isVisible, setIsVisible] = useState(false)

   useEffect(() => {
      const toggleVisibility = () => {
         setIsVisible(window.scrollY > window.innerHeight)
      }

      window.addEventListener('scroll', toggleVisibility)
      return () => window.removeEventListener('scroll', toggleVisibility)
   }, [])

   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      })
   }

   return (
      isVisible && (
         <button
            onClick={scrollToTop}
            className='fixed bottom-5 right-5 p-3 w-10 h-10 bg-[#a0a0a0] text-white rounded-[5px] text-[22px] flex justify-center items-center shadow-lg hover:bg-main transition duration-300'
         >
            <FaCaretUp />
         </button>
      )
   )
}

export default ScrollToTopButton
