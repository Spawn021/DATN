import React, { useState, useEffect, memo } from 'react'
import icons from '../../ultils/icons'

const ScrollToTopButton = ({ scrollContainerRef }) => {
   const { FaCaretUp } = icons
   const [isVisible, setIsVisible] = useState(false)

   useEffect(() => {
      const toggleVisibility = () => {
         if (scrollContainerRef) {
            setIsVisible(scrollContainerRef.current.scrollTop > window.innerHeight)
         } else {
            setIsVisible(window.scrollY > window.innerHeight)
         }
      }

      const target = scrollContainerRef ? scrollContainerRef.current : window
      target.addEventListener('scroll', toggleVisibility)

      return () => target.removeEventListener('scroll', toggleVisibility)
   }, [scrollContainerRef])

   const scrollToTop = () => {
      if (scrollContainerRef) {
         scrollContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
         })
      } else {
         window.scrollTo({
            top: 0,
            behavior: 'smooth',
         })
      }
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

export default memo(ScrollToTopButton)
