import { useEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTopHandler = ({ scrollContainerRef }) => {
   const { pathname } = useLocation()


   useEffect(() => {
      if (scrollContainerRef) {
         scrollContainerRef.current.scrollTo({
            top: 0,
         })
      }
      else {
         window.scrollTo(0, 0)
      }
   }, [pathname])

   return null
}

export default memo(ScrollToTopHandler)
