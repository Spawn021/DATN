import React from 'react'
import { Breadcrumb } from '../../components'

const Service = () => {
   return <div className='w-full'>
      <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
         <div className='w-main px-[10px] font-semibold text-[18px] uppercase'>Our services</div>
         <Breadcrumb />

      </div>
      <div className='w-main mx-auto pt-4 pb-4 px-[10px]'>
         <div className='flex gap-4'>
            <div className='w-1/2'>
               <img src='https://cdn.shopify.com/s/files/1/1636/8779/files/9069783_orig.jpg?v=1491836163' alt='service' className='w-full h-[300px] object-cover' />
            </div>
            <div className='w-1/2 flex gap-[10px] flex-col'>
               <div className='text-sm text-[#505050]'>
                  Cras magna tellus, congue vitae congue vel, facilisis id risus. Proin semper in lectus id faucibus. Aenean vitae quam eget mi aliquam viverra quis quis velit.</div>
               <div className='text-sm text-[#505050]'>Curabitur mauris diam, posuere vitae nunc eget, blandit pellentesque mi. Pellentesque placerat nulla at ultricies malesuada. Aenean mi lacus, malesuada at leo vel, blandit iaculis nisl.</div>
               <div className='text-sm text-[#505050]'>Praesent vestibulum nisl sed diam euismod, a auctor neque porta. Vestibulum varius ligula non orci tincidunt rutrum. Suspendisse placerat enim eu est egestas, aliquam venenatis elit accumsan. Donec metus quam, posuere sit amet odio et, ultricies consequat nibh.</div>
            </div>
         </div>
         <div className='text-center mt-8 mb-5 text-[24px] font-semibold text-[#505050] '>We Offer Best Services</div>
         <div className='grid grid-cols-3 gap-5 my-10 text-center'>
            <div className="flex justify-center flex-col items-center">
               <img src='https://cdn.shopify.com/s/files/1/1636/8779/files/settings.png?v=1491835711' alt='service' className='w-16 h-16 mb-5' />
               <div className='text-[#505050] mb-2'>Service 1</div>
               <div className='text-[#505050] text-xs'>Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora</div>
            </div>
            <div className="flex justify-center flex-col items-center">
               <img src='https://cdn.shopify.com/s/files/1/1636/8779/files/picture.png?v=1491835656' alt='service' className='w-16 h-16 mb-5' />
               <div className='text-[#505050] mb-2'>Service 2</div>
               <div className='text-[#505050] text-xs'>Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora</div>
            </div>
            <div className="flex justify-center flex-col items-center">
               <img src='https://cdn.shopify.com/s/files/1/1636/8779/files/layout.png?v=1491835677' alt='service' className='w-16 h-16 mb-5' />
               <div className='text-[#505050] mb-2'>Service 3</div>
               <div className='text-[#505050] text-xs'>Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora</div>
            </div>
            <div className="flex justify-center flex-col items-center">
               <img src='https://cdn.shopify.com/s/files/1/1636/8779/files/layout.png?v=1491835677' alt='service' className='w-16 h-16 mb-5' />
               <div className='text-[#505050] mb-2'>Service 4</div>
               <div className='text-[#505050] text-xs'>Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora</div>
            </div>
            <div className="flex justify-center flex-col items-center">
               <img src='https://cdn.shopify.com/s/files/1/1636/8779/files/settings.png?v=1491835711' alt='service' className='w-16 h-16 mb-5' />
               <div className='text-[#505050] mb-2'>Service 5</div>
               <div className='text-[#505050] text-xs'>Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora</div>
            </div>
            <div className="flex justify-center flex-col items-center">
               <img src='https://cdn.shopify.com/s/files/1/1636/8779/files/picture.png?v=1491835656' alt='service' className='w-16 h-16 mb-5' />
               <div className='text-[#505050] mb-2'>Service 6</div>
               <div className='text-[#505050] text-xs'>Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora</div>
            </div>
         </div>
      </div>
   </div>
}

export default Service
