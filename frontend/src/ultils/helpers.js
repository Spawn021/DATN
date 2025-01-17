import icons from './icons'
const { FaStar, FaStarHalfAlt, FaRegStar } = icons
export const capitalizeFirstLetter = (string) => {
   return string
      ?.split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
}

export const formatPrice = (price) => {
   return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
export const formatTime = (time) => {
   const minutes = String(Math.floor(time / 60)).padStart(2, '0')
   const seconds = String(time % 60).padStart(2, '0')
   return `${minutes}:${seconds}`
}
export const generatePaginationArray = (start, end) => {
   return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
export const highlightText = (text, query) => {
   if (!query) return text
   const parts = text?.split(new RegExp(`(${query})`, 'gi'))
   return parts?.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
         <span key={index} className="font-bold text-blue-500">{part}</span>
      ) : part
   )
}
export const validateTinyMCE = (payload, setInvalidField) => {
   let invalidCount = 0;
   if (!payload.description || payload.description.trim() === '') {
      setInvalidField(prev => ({
         ...prev,
         description: { message: 'Description is required' }
      }));
      invalidCount++;
   } else {
      setInvalidField(prev => ({
         ...prev,
         description: null
      }));
   }
   return invalidCount;
};

export const fileToBase64 = (file) => {
   return new Promise((resolve, reject) => {
      if (!file) {
         reject("No file provided");
         return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
   })
}
export const limitText = (html, maxLength) => {
   const tempElement = document.createElement('div');
   tempElement.innerHTML = html;
   const plainText = tempElement.textContent || tempElement.innerText;

   if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength) + '...';
   }
   return plainText;
};