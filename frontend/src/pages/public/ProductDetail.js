import React, { useEffect, useCallback, useState } from 'react'
import { useParams, useNavigate, useLocation, createSearchParams } from 'react-router-dom'
import Slider from 'react-slick'
import DOMPurify from 'dompurify'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { getUserCurrent } from '../../redux/features/userSlice'
import path from '../../ultils/path'
import { apiProducts, apiUsers } from '../../redux/apis'
import { Breadcrumb, Product } from '../../components'
import { ImageMagnifier, SelectQuantity, ProductExtraInfo, ProductInformation } from '../../components'
import { formatPrice, renderStar } from '../../ultils/helpers'
import { ProductExtraInfoData } from '../../ultils/constants'

const ProductDetail = ({ isQuickView, data }) => {
   const { isLoggedIn, userData } = useSelector(state => state.user)
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const location = useLocation()
   const settings = {
      dots: false,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 2000,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
   }

   const params = useParams()
   // console.log(pid, title, category)
   const [product, setProduct] = useState(null)
   const [quantity, setQuantity] = useState(1)
   const [relativeProducts, setRelativeProducts] = useState()
   const [update, setUpdate] = useState(false)
   const [variant, setVariant] = useState(null)
   const [pid, setPid] = useState(null)
   const [category, setCategory] = useState(null)
   const [currentProduct, setCurrentProduct] = useState({
      title: '',
      thumbnail: '',
      price: 0,
      images: [],
      color: '',
   })
   useEffect(() => {
      if (data) {
         setPid(data.pid)
         setCategory(data.category)
      } else if (params && params.pid) {
         setPid(params.pid)
         setCategory(params.category)
      }
   }, [data, params])
   useEffect(() => {
      if (variant) {
         const selectedVariant = product?.variants?.find(item => item.sku === variant);
         if (selectedVariant) {
            setCurrentProduct({
               title: selectedVariant?.title,
               color: selectedVariant?.color,
               price: selectedVariant?.price,
               thumbnail: selectedVariant?.thumbnail,
               images: selectedVariant?.images,
            });
         }
      } else {
         setCurrentProduct({
            title: product?.title,
            color: product?.color,
            price: product?.price,
            thumbnail: product?.thumbnail,
            images: product?.images,
         });
      }
   }, [variant, product]);
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
   }, [pid, update])
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
   const handleAddToCart = async () => {
      if (!isLoggedIn || !userData) {
         Swal.fire({
            title: 'Oops!',
            text: 'Please login to add to cart',
            icon: 'info',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Login',
            showCancelButton: true,
         }).then((result) => {
            if (result.isConfirmed) {
               navigate(
                  {
                     pathname: `/${path.LOGIN}`,
                     search: createSearchParams({ redirect: location.pathname }).toString()
                  }
               )
            }

         })
      } else {
         const productInCart = userData?.cart?.find(item => item?.product._id === pid && item?.color === currentProduct.color)
         const updatedQuantity = productInCart ? productInCart.quantity + quantity : quantity
         console.log(updatedQuantity)
         const response = await apiUsers.updateCart({ pid: pid, color: currentProduct.color, quantity: updatedQuantity, price: currentProduct.price, thumbnail: currentProduct.thumbnail, title: currentProduct.title })
         if (response.success) {
            toast.success('Add to cart successfully')
            dispatch(getUserCurrent())

         }
         else toast.error('Add to cart failed')
      }

   }

   return (
      <div className='w-full'>
         {!isQuickView &&
            <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
               <div className='w-main px-[10px] font-semibold text-[18px]'>{currentProduct?.title}</div>
               <Breadcrumb title={currentProduct?.title} category={category} />
            </div>
         }
         <div onClick={(e) => e.stopPropagation()} className={`m-auto bg-white flex ${isQuickView ? 'w-[950px] rounded max-h-[95vh] overflow-y-auto ' : 'w-main mt-5 px-[10px]'}`}>
            <div className={`flex flex-col gap-5 ${isQuickView ? 'w-[50%] p-3' : 'w-[40%]'}`}>
               <div className='w-[458px] h-[458px] border-[2px]'>
                  <ImageMagnifier width={'100%'} height={'100%'} src={currentProduct?.thumbnail} alt={currentProduct?.title} />
               </div>
               <div className='w-[458px] '>
                  <Slider {...settings}>
                     {currentProduct.images?.map((image, index) => (
                        <div key={index} className='px-[1px] '>
                           <div className='w-[150px] h-[150px] border-[2px]'>
                              <img src={image} alt={currentProduct?.title} className='w-full h-full object-contain' />
                           </div>
                        </div>
                     ))}
                  </Slider>
               </div>
            </div>
            <div className={`px-4 ${isQuickView ? 'w-[50%] pt-2' : 'w-[40%]'}`}>
               {isQuickView && <h1 className='text-[24px] font-semibold pb-3'>{currentProduct?.title}</h1>}
               <div className='flex items-center'>
                  <div className={`font-semibold ${isQuickView ? 'text-[20px]' : 'text-[30px]'} `}>{formatPrice(currentProduct?.price)} VND</div>
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
               <div className='my-4 flex items-center gap-16'>
                  <div className='text-[14px] font-semibold'>Color</div>
                  <div className='flex flex-wrap gap-4 items-center'>
                     <div
                        onClick={() => setVariant(null)}
                        className={`flex items-center justify-center gap-2 border cursor-pointer w-[100px] ${variant === null ? 'border-main' : ''}`}
                     >
                        <img src={product?.thumbnail} alt={product?.title} className='w-[30px] h-[30px] object-contain' />
                        <span className='text-[#505050] text-[14px] font-normal'>{product?.color}</span>
                     </div>
                     {product?.variants?.map((item, index) => (
                        <div
                           key={index}
                           onClick={() => setVariant(item.sku)}
                           className={`flex items-center justify-center gap-2 border cursor-pointer w-[100px] ${variant === item.sku ? 'border-main' : ''}`}
                        >
                           <img src={item.thumbnail} alt={item.title} className='w-[30px] h-[30px] object-contain' />
                           <span className='text-[#505050] text-[14px] font-normal'>{item.color}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className='flex items-center gap-10'>
                  <div className='text-[14px] text-[#151515] font-semibold'>Quantity</div>
                  <SelectQuantity
                     quantity={quantity}
                     handleQuantity={handleQuantity}
                     handleDecrement={handleDecrement}
                     handleIncrement={handleIncrement}
                  />
                  <div className='text-xs text-[#151515]'>{`In stock: ${product?.quantity}`}</div>
               </div>

               <button onClick={handleAddToCart} className='w-full py-2 mt-5 bg-main text-white text-[16px] font-semibold hover:bg-black'>Add to cart</button>
            </div>
            {!isQuickView &&
               <div className='w-[20%]'>
                  {ProductExtraInfoData.map((item, index) => {
                     return <ProductExtraInfo key={index} title={item.title} content={item.content} icon={item.icon} />
                  })}
               </div>
            }
         </div>
         {!isQuickView &&
            <div className='w-main m-auto bg-white mt-10 px-[10px] '>
               <ProductInformation totalRating={product?.totalRating} ratings={product?.ratings} nameProduct={product?.title} pid={product?._id} rerender={rerender} />
            </div>
         }
         {!isQuickView &&
            <div className='w-main m-auto bg-white mt-10 px-[10px] '>
               <h2 className=' text-xl font-semibold text-[#151515] pb-4 border-main border-b-[2px] uppercase'>Other Customers also buy</h2>
               <div className='my-10 mx-[-10px]'>
                  <Slider {...settings}>
                     {relativeProducts?.map((product, index) => {
                        return <Product key={index} product={product} />
                     })}
                  </Slider>
               </div>
            </div>}
      </div>
   )
}

export default ProductDetail
