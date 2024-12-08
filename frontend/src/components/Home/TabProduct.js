import React, { useEffect, useState, memo } from 'react'
import Slider from 'react-slick'
import { apiProducts } from '../../redux/apis'
import { Product } from '../../components'
import banner1 from '../../assets/banner1.png'
import banner2 from '../../assets/banner2.png'

const TabProduct = () => {
   const settings = {
      dots: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 2000,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
   }
   const [activeTab, setActiveTab] = useState('bestSellers')
   const [bestSellers, setBestSellers] = useState([])
   const [newArrivals, setNewArrivals] = useState([])
   const getProducts = async () => {
      const [bestSeller, newArrival] = await Promise.all([
         apiProducts.getProducts({ sort: '-sold' }),
         apiProducts.getProducts({ sort: '-createdAt' }),
      ])
      if (bestSeller.success) setBestSellers(bestSeller.products)
      if (newArrival.success) setNewArrivals(newArrival.products)
   }
   useEffect(() => {
      getProducts()
   }, [])
   return (
      <div>
         <div className='flex pb-[15px] border-main border-b-[2px]'>
            <span
               onClick={() => setActiveTab('bestSellers')}
               className={`text-[20px] ${activeTab === 'bestSellers' ? 'text-black' : 'text-[#8a8a8a]'
                  } pr-7 uppercase font-semibold border-r cursor-pointer`}
            >
               Best Sellers
            </span>
            <span
               onClick={() => setActiveTab('newArrivals')}
               className={`text-[20px] ${activeTab === 'newArrivals' ? 'text-black' : 'text-[#8a8a8a]'
                  } pl-7 uppercase font-semibold cursor-pointer`}
            >
               New Arrivals
            </span>
         </div>
         <div className='mx-[-10px] pt-[20px]'>
            <Slider {...settings}>
               {activeTab === 'bestSellers' &&
                  bestSellers.map((product, index) => {
                     return <Product key={index} product={product} />
                  })}
               {activeTab === 'newArrivals' &&
                  newArrivals.map((product, index) => {
                     return <Product key={index} product={product} />
                  })}
            </Slider>
         </div>
         <div className='flex items-center justify-between'>
            <div className='relative group w-[435px] h-[140px]'>
               <img src={banner1} alt='banner' className='w-full h-full object-cover' />
               <div className='group-hover:cursor-pointer absolute top-0 left-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
               <div className='group-hover:cursor-pointer absolute bottom-0 right-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
            </div>

            <div className='relative group w-[435px] h-[140px]'>
               <img src={banner2} alt='banner' className='w-full h-full object-cover ' />
               <div className='group-hover:cursor-pointer absolute top-0 left-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
               <div className='group-hover:cursor-pointer absolute bottom-0 right-0 w-0 h-0  group-hover:w-full group-hover:h-full group-hover:bg-[#0000001a] transition-all duration-500'></div>
            </div>
         </div>
      </div>
   )
}

export default memo(TabProduct)
