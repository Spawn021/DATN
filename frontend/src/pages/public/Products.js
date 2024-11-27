import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Masonry from 'react-masonry-css'
import { apiProducts } from '../../redux/apis'
import { Breadcrumb, Product, FilterItem } from '../../components'

const Products = () => {
   const breakpointColumnsObj = {
      default: 4,
      1024: 3,
      768: 2,
      480: 1,
   }
   const [params] = useSearchParams()

   const [products, setProducts] = useState(null)
   const [activeFilter, setActiveFilter] = useState(null)
   const { category } = useParams()
   const getProductsByCategory = async (queries) => {
      const response = await apiProducts.getProducts(queries)
      if (response.success) {
         setProducts(response.products)
      }
   }
   useEffect(() => {
      let param = [...params.entries()]
      let queries = {}
      param.forEach((item) => {
         queries[item[0]] = item[1]
      })
      // console.log(queries)
      getProductsByCategory({ category: category, ...queries })
   }, [category, params])
   const handleActiveFilter = useCallback(
      (name) => {
         if (activeFilter === name) {
            setActiveFilter(null)
         } else setActiveFilter(name)
      },
      [activeFilter],
   )

   return (
      <div className='w-full'>
         <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
            <div className='w-main px-[10px] font-semibold text-[18px] uppercase'>{category}</div>
            <Breadcrumb category={category} />
         </div>
         <div className='w-main mx-auto pt-8 pb-4 px-[10px]'>
            <div className='w-full flex items-center justify-between border p-[10px] mb-4'>
               <div className='w-[60%]'>
                  <div className='text-[#505050] text-[14px] leading-[14px] font-semibold pb-[10px]'>Filter by</div>
                  <div className='flex gap-2'>
                     <FilterItem name='price' active={activeFilter} handleActiveFilter={handleActiveFilter} type='input' />
                     <FilterItem name='color' active={activeFilter} handleActiveFilter={handleActiveFilter} />
                  </div>
               </div>
               <div className='w-[20%]'>
                  <div className='text-[#505050] text-[14px] leading-[14px] font-semibold pb-[10px]'>Sort by</div>
                  <div className='flex'>
                     <div>Abc</div>
                  </div>
               </div>
            </div>
            <div className='w-full z-0'>
               <Masonry breakpointCols={breakpointColumnsObj} className='flex mx-[-10px]'>
                  {products?.map((product, index) => {
                     return <Product key={index} product={product} />
                  })}
               </Masonry>
            </div>
         </div>

         <div className='w-full h-[400px]'></div>
      </div>
   )
}

export default Products
