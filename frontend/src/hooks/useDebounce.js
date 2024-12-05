import { useEffect, useState } from 'react'

const useDebounce = (value, ms) => {
   const [debouncedValue, setDebouncedValue] = useState('')
   useEffect(() => {
      const timeout = setTimeout(() => {
         setDebouncedValue(value)
      }, ms)
      return () => clearTimeout(timeout)
   }, [value, ms])

   return debouncedValue
}

export default useDebounce
