import React, { useEffect, useState } from 'react'
import { apiProducts } from '../redux/apis'
import Product from './Product'
import Slider from 'react-slick'

const NewArrival = () => {
   const settings = {
      dots: false,
      infinite: true,
      // autoplay: true,
      autoplaySpeed: 2000,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
   }
   const [smartphone, setSmartphone] = useState([])
   const [tablet, setTablet] = useState([])
   const [laptop, setLaptop] = useState([])
   const [activeTab, setActiveTab] = useState('smartphone')
   const getProducts = async () => {
      const [Smartphone, Tablet, Laptop] = await Promise.all([
         apiProducts.getProducts({ category: 'Smartphone', sort: '-createdAt' }),
         apiProducts.getProducts({ category: 'Tablet', sort: '-createdAt' }),
         apiProducts.getProducts({ category: 'Laptop', sort: '-createdAt' }),
      ])
      if (Smartphone.success) setSmartphone(Smartphone.products)
      if (Tablet.success) setTablet(Tablet.products)
      if (Laptop.success) setLaptop(Laptop.products)
   }
   useEffect(() => {
      getProducts()
   }, [])
   return (
      <>
         <div className='flex justify-between border-main border-b-[2px] pb-4'>
            <h2 className='text-xl font-semibold text-[#151515] '>NEW ARRIVALS</h2>
            <div className='flex'>
               <span
                  onClick={() => setActiveTab('smartphone')}
                  className={`text-[14px] ${
                     activeTab === 'smartphone' ? 'text-main' : 'text-[#8a8a8a]'
                  } pr-7 uppercase font-semibold border-r cursor-pointer`}
               >
                  Smartphone
               </span>
               <span
                  onClick={() => setActiveTab('tablet')}
                  className={`text-[14px] ${
                     activeTab === 'tablet' ? 'text-main' : 'text-[#8a8a8a]'
                  } pl-7 uppercase font-semibold pr-7 border-r cursor-pointer`}
               >
                  Tablet
               </span>
               <span
                  onClick={() => setActiveTab('laptop')}
                  className={`text-[14px] ${
                     activeTab === 'laptop' ? 'text-main' : 'text-[#8a8a8a]'
                  } pl-7 uppercase font-semibold cursor-pointer`}
               >
                  Laptop
               </span>
            </div>
         </div>
         <div className='mx-[-10px] pt-[20px]'>
            <Slider {...settings}>
               {activeTab === 'smartphone' &&
                  smartphone.map((product, index) => {
                     return <Product key={index} product={product} />
                  })}
               {activeTab === 'tablet' &&
                  tablet.map((product, index) => {
                     return <Product key={index} product={product} />
                  })}
               {activeTab === 'laptop' &&
                  laptop.map((product, index) => {
                     return <Product key={index} product={product} />
                  })}
            </Slider>
         </div>
      </>
   )
}

export default NewArrival
