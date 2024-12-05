import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import Masonry from 'react-masonry-css'
import { apiProducts } from '../../redux/apis'
import { Breadcrumb, Product, FilterItem, InputSelect, Pagination } from '../../components'
import { options } from '../../ultils/constants'

const Products = () => {
   const breakpointColumnsObj = {
      default: 4,
      1024: 3,
      768: 2,
      480: 1,
   }
   const [params] = useSearchParams()
   const navigate = useNavigate()

   const [products, setProducts] = useState([])
   const [activeFilter, setActiveFilter] = useState(null)
   const [sort, setSort] = useState(null)
   const { category } = useParams()

   const getProductsByCategory = async (queries) => {
      const response = await apiProducts.getProducts(queries)
      if (response.success) {
         setProducts(response)
      } else {
         setProducts([])
      }
   }

   useEffect(() => {
      let param = [...params.entries()]
      let queries = {}
      param.forEach((item) => {
         queries[item[0]] = item[1]
      })
      if (queries.from) {
         queries.price = { gte: queries.from }
         delete queries.from
      }
      if (queries.to) {
         queries.price = { ...queries.price, lte: queries.to }
         delete queries.to
      }
      // console.log(queries)

      // getProductsByCategory({ category: category, ...queries })
      getProductsByCategory({ ...queries })
      window.scrollTo(0, 0)
   }, [params, category])
   const handleActiveFilter = useCallback(
      (name) => {
         if (activeFilter === name) {
            setActiveFilter(null)
         } else setActiveFilter(name)
      },
      [activeFilter],
   )
   const changeValue = useCallback(
      (value) => {
         setSort(value)
      },
      [sort],
   )
   useEffect(() => {
      if (sort !== null) {
         navigate({
            pathname: `/${category}`,
            search: createSearchParams({ sort: sort }).toString(),
         })
      } else {
         navigate({
            pathname: `/${category}`,
            search: '', // Không có tham số sort
         })
      }
   }, [sort])
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
                  <div className='w-full'>
                     <InputSelect value={sort} options={options} changeValue={changeValue} />
                  </div>
               </div>
            </div>
            <div className='w-full z-0'>
               {products?.products?.length > 0 ? (
                  <Masonry breakpointCols={breakpointColumnsObj} className='flex mx-[-10px]'>
                     {products?.products?.map((product, index) => (
                        <Product key={index} product={product} />
                     ))}
                  </Masonry>
               ) : (
                  <div className='text-center text-gray-500 py-10'>No products available for this category.</div>
               )}
            </div>
         </div>
         {products?.products?.length > 0 && <div className='w-main mx-auto px-[10px]'>
            <Pagination totalCount={products?.counts} />
         </div>}


         <div className='w-full h-[400px]'></div>
      </div>
   )
}

export default Products
