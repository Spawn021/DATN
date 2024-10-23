import icons from './icons'
const { FaStar, FaStarHalfAlt, FaRegStar } = icons
export const capitalizeFirstLetter = (string) => {
   return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
}

export const formatPrice = (price) => {
   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const renderStar = (rating) => {
   const stars = []
   for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
         stars.push(<FaStar key={i} className='text-[#ffa500]' />)
      } else if (i - rating < 1) {
         stars.push(<FaStarHalfAlt key={i} className='text-[#ffa500]' />)
      } else {
         stars.push(<FaRegStar key={i} className='text-[#ffa500]' />)
      }
   }
   return stars
}
