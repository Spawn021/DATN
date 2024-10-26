import React, { memo } from 'react'
import icons from '../ultils/icons'

const {
   MdEmail,
   GiPositionMarker,
   FaPhoneAlt,
   FaFacebook,
   FaTwitter,
   FaPinterest,
   FaGoogle,
   FaLinkedin,
   FaFlickr,
   FaCcVisa,
   FaCcMastercard,
   FaCcPaypal,
   FaCcDiscover,
   FaCcDinersClub,
   SiAmericanexpress,
} = icons

const Footer = () => {
   return (
      <div className='w-full'>
         <div className='h-[103px] w-full bg-main flex items-center justify-center '>
            <div className='w-main pl-3 flex justify-between '>
               <div>
                  <div className='text-white font-normal uppercase text-xl tracking-[2px]'>Sign up to Newsletter</div>
                  <span className='text-white opacity-60 text-[13px]'>Subscribe now and receive weekly newsletter</span>
               </div>
               <div className='w-1/2 flex items-center'>
                  <input
                     type='text'
                     id=''
                     placeholder='Email address'
                     className='outline-none w-full h-full px-5 rounded-l-full bg-[#f04646] text-gray-100 placeholder:text-[14px] placeholder:font-normal placeholder:text-[#f9b5b5]'
                  />
                  <div className='w-[40px] bg-[#f04646] rounded-r-full h-full text-white text-[20px] flex items-center'>
                     <MdEmail />
                  </div>
               </div>
            </div>
         </div>
         <div className='h-[270px] w-full bg-[#191919] flex justify-center text-[#b7b7b7] text-[13px] '>
            <div className='w-main pl-3 flex items-start pt-[50px]'>
               <div className='flex flex-2 flex-col'>
                  <h3 className='text-white uppercase font-semibold mb-5 text-[15px] pl-[15px] border-l-4 border-l-main'>About us</h3>
                  <div className='flex items-center mb-[10px]'>
                     <span className=' text-white font-normal pr-1'>
                        <GiPositionMarker />
                     </span>
                     <span className='text-white font-normal pr-[2px]'>Address:</span>
                     <span>474 Ontario St Toronto, ON M4X 1M7 Canada</span>
                  </div>
                  <div className='flex items-center mb-[10px]'>
                     <span className=' text-white font-normal pr-1'>
                        <FaPhoneAlt />
                     </span>
                     <span className=' text-white font-normal pr-[2px]'>Phone:</span>
                     <span>(+1234)56789xxx</span>
                  </div>
                  <div className='flex items-center mb-[10px]'>
                     <span className=' text-white font-normal pr-1'>
                        <MdEmail />
                     </span>
                     <span className=' text-white font-normal pr-[2px]'>Mail:</span>
                     <span>tadathemes@gmail.com</span>
                  </div>
                  <div className='flex gap-x-2 mt-[10px]'>
                     <span className='bg-[#303030] p-3 text-[15px] text-white hover:cursor-pointer rounded-[4px]'>
                        <FaFacebook />
                     </span>
                     <span className='bg-[#303030] p-3 text-[15px] text-white hover:cursor-pointer rounded-[4px]'>
                        <FaTwitter />
                     </span>
                     <span className='bg-[#303030] p-3 text-[15px] text-white hover:cursor-pointer rounded-[4px]'>
                        <FaPinterest />
                     </span>
                     <span className='bg-[#303030] p-3 text-[15px] text-white hover:cursor-pointer rounded-[4px]'>
                        <FaGoogle />
                     </span>
                     <span className='bg-[#303030] p-3 text-[15px] text-white hover:cursor-pointer rounded-[4px]'>
                        <FaLinkedin />
                     </span>
                     <span className='bg-[#303030] p-3 text-[15px] text-white hover:cursor-pointer rounded-[4px]'>
                        <FaFlickr />
                     </span>
                  </div>
               </div>
               <div className='flex flex-1 flex-col'>
                  <h3 className='text-white uppercase font-semibold mb-5 text-[15px] pl-[15px] border-l-4 border-l-main '>Information</h3>
                  <div className='flex flex-col'>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Typography</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Gallery</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Store Location</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Today's Deals</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Contact</span>
                  </div>
               </div>
               <div className='flex flex-1 flex-col'>
                  <h3 className='text-white uppercase font-semibold mb-5 text-[15px] pl-[15px] border-l-4 border-l-main '>Who we are</h3>
                  <div className='flex flex-col'>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Help</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Free Shipping</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>FAQs</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Return & Exchange</span>
                     <span className='font-normal mb-[10px] hover:text-white hover:cursor-pointer'>Testimonials</span>
                  </div>
               </div>
               <div className='flex flex-1'>
                  <h3 className='text-white uppercase font-semibold mb-5 text-[15px] pl-[15px] border-l-4 border-l-main '>
                     #DigitalWorldStore
                  </h3>
               </div>
            </div>
         </div>
         <div className='h-[50px] w-full bg-[#0f0f0f] flex justify-center items-center text-[#b7b7b7] text-[13px]'>
            <div className='w-main pl-3 flex justify-between items-center'>
               <div>© 2021 Digital World Store. All Rights Reserved.</div>
               <div className='flex gap-x-4 items-center text-[35px]'>
                  <span>
                     <FaCcPaypal />
                  </span>
                  <span>
                     <FaCcVisa />
                  </span>
                  <span>
                     <FaCcMastercard />
                  </span>
                  <span>
                     <FaCcDiscover />
                  </span>
                  <span>
                     <SiAmericanexpress />
                  </span>
                  <span>
                     <FaCcDinersClub />
                  </span>
               </div>
            </div>
         </div>
      </div>
   )
}

export default memo(Footer)
