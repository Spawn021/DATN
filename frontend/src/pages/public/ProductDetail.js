import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'
import DOMPurify from 'dompurify'
import { apiProducts } from '../../redux/apis'
import { Breadcrumb, Product } from '../../components'
import { ImageMagnifier, SelectQuantity, ProductExtraInfo, ProductInformation } from '../../components'
import { formatPrice, renderStar } from '../../ultils/helpers'
import { ProductExtraInfoData } from '../../ultils/constants'

const ProductDetail = () => {
   const settings = {
      dots: false,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 2000,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
   }

   const { pid, title, category } = useParams()
   // console.log(pid, title, category)
   const [product, setProduct] = useState(null)
   const [quantity, setQuantity] = useState(1)
   const [relativeProducts, setRelativeProducts] = useState()
   const [update, setUpdate] = useState(false)

   const getProductData = useCallback(async () => {
      const response = await apiProducts.getProduct(pid)
      if (response.success) {
         setProduct(response.product)
      }
   }, [pid])

   const getProductsData = useCallback(async () => {
      const response = await apiProducts.getProducts({ category: category, limit: 8 })
      if (response.success) {
         setRelativeProducts(response.products)
      }
   }, [category])

   useEffect(() => {
      if (pid) {
         getProductData()
         getProductsData()
      }
   }, [pid, getProductData, getProductsData, update])
   const rerender = useCallback(() => {
      setUpdate((prev) => !prev)
   }, [update])
   const handleQuantity = useCallback(
      (number) => {
         if (number === '') {
            setQuantity('')
            return
         }
         const value = parseInt(number, 10)

         if (!isNaN(value)) {
            if (value < 1) {
               setQuantity(1)
            } else if (value > product?.quantity) {
               setQuantity(product?.quantity)
            } else {
               setQuantity(value)
            }
         }
      },
      [product?.quantity],
   )
   const handleIncrement = useCallback(() => {
      setQuantity((prev) => (prev < product?.quantity ? prev + 1 : product?.quantity))
   }, [product?.quantity])
   const handleDecrement = useCallback(() => {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
   }, [])

   return (
      <div className='w-full  '>
         <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
            <div className='w-main px-[10px] font-semibold text-[18px]'>{title}</div>
            <Breadcrumb title={title} category={category} />
         </div>
         <div className='w-main m-auto bg-white mt-5 flex px-[10px]'>
            <div className='w-[40%] flex flex-col gap-5'>
               <div className='w-[458px] h-[458px] border-[2px]'>
                  <ImageMagnifier width={'100%'} height={'100%'} src={product?.thumbnail} alt={product?.title} />
               </div>
               <div className='w-[458px] '>
                  <Slider {...settings}>
                     {product?.images?.map((image, index) => (
                        <div key={index} className='px-[1px] '>
                           <div className='w-[150px] h-[150px] border-[2px]'>
                              <img src={image} alt={product?.title} className='w-full h-full object-contain' />
                           </div>
                        </div>
                     ))}
                  </Slider>
               </div>
            </div>
            <div className='w-[40%] px-4'>
               <div className='flex items-center'>
                  <div className='text-[30px] font-semibold '>{formatPrice(product?.price)} VND</div>
                  <div className='text-[16px] text-[#505050] pl-10'> Sold: {product?.sold}</div>
               </div>
               <div className='flex items-center mt-1 gap-1'>
                  <div className='mt-1 text-[16px] font-medium pb-[2px] border-b-[1px] border-black '>{product?.totalRating}</div>
                  <div className='flex text-[16px] '>{renderStar(product?.totalRating)}</div>
                  <div className='text-[16px] text-[#505050] ml-3 pl-3 border-l-2 font-medium'>
                     <span className='pb-[2px] border-b-[1px] border-black'>{product?.ratings?.length}</span>
                     <span>{product?.ratings?.length > 1 ? ' reviews' : ' review'}</span>
                  </div>
               </div>
               <ul className='pl-4 mt-5 mb-[10px]'>
                  {product?.description?.length > 1 &&
                     product?.description?.map((desc, index) => {
                        return (
                           <li key={index} className='text-[#505050] list-square mb-[5px] text-[14px] font-normal pl-1'>
                              {desc}
                           </li>
                        )
                     })
                  }
               </ul>
               {product?.description?.length === 1 &&
                  <div className='text-[#505050] list-style' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}>
                  </div>
               }
               <SelectQuantity
                  quantity={quantity}
                  handleQuantity={handleQuantity}
                  inStock={product?.quantity}
                  handleDecrement={handleDecrement}
                  handleIncrement={handleIncrement}
               />
               <button className='w-full py-2 bg-main text-white text-[16px] font-semibold hover:bg-black'>Add to cart</button>
            </div>
            <div className='w-[20%]'>
               {ProductExtraInfoData.map((item, index) => {
                  return <ProductExtraInfo key={index} title={item.title} content={item.content} icon={item.icon} />
               })}
            </div>
         </div>
         <div className='w-main m-auto bg-white mt-10 px-[10px] '>
            <ProductInformation totalRating={product?.totalRating} ratings={product?.ratings} nameProduct={product?.title} pid={product?._id} rerender={rerender} />
         </div>
         <div className='w-main m-auto bg-white mt-10 px-[10px] '>
            <h2 className=' text-xl font-semibold text-[#151515] pb-4 border-main border-b-[2px] uppercase'>Other Customers also buy</h2>
            <div className='my-10 mx-[-10px]'>
               <Slider {...settings}>
                  {relativeProducts?.map((product, index) => {
                     return <Product key={index} product={product} />
                  })}
               </Slider>
            </div>
         </div>
      </div>
   )
}

export default ProductDetail
