import { useEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTopHandler = () => {
   const { pathname } = useLocation()

   useEffect(() => {
      window.scrollTo(0, 0)
   }, [pathname])

   return null
}

export default memo(ScrollToTopHandler)
