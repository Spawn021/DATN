import React, { useState, useEffect } from 'react'
import { useSearchParams, createSearchParams, useNavigate, useLocation, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Breadcrumb, Pagination } from '../../components'
import { apiBlogs } from '../../redux/apis'
import { limitText } from '../../ultils/helpers'
import icons from '../../ultils/icons'
import path from '../../ultils/path'

const Blog = () => {
   const { FaArrowRightLong } = icons
   const categories = useSelector((state) => state.blogCategory.categories)
   const [selectedCategory, setSelectedCategory] = useState('All')
   const [blogs, setBlogs] = useState(null)
   const [recentBlogs, setRecentBlogs] = useState(null)
   const [counts, setCounts] = useState(0)
   const navigate = useNavigate()
   const location = useLocation()

   const [params] = useSearchParams()

   const getRecentBlogs = async () => {
      const response = await apiBlogs.getBlogs({ limit: 3, page: 1, sort: '-createdAt' })
      if (response.success) {
         setRecentBlogs(response.blogs)
         setCounts(response.counts)
      } else {
         setRecentBlogs(null)
         setCounts(0)
      }
   }
   useEffect(() => {
      getRecentBlogs()
   }, [])
   const getBlogs = async (queries) => {
      const response = await apiBlogs.getBlogs(queries)
      if (response.success) {
         setBlogs(response.blogs)
         setCounts(response.counts)
      } else {
         setBlogs(null)
         setCounts(0)
      }
   }
   useEffect(() => {
      const queries = Object.fromEntries(params.entries());
      if (!queries.page) {
         queries.page = 1;
      }
      getBlogs(queries)
   }, [params])
   const handleCategory = (category) => {
      setSelectedCategory(category)
      const queries = Object.fromEntries(params.entries())
      if (category === 'All') {
         delete queries.category
      } else {
         queries.category = category
      }
      queries.page = 1
      navigate({
         pathname: location.pathname,
         search: createSearchParams(queries).toString()
      })
   }

   return <div className='w-full'>
      <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
         <div className='w-main px-[10px] font-semibold text-[18px] uppercase'>Blogs</div>
         <Breadcrumb />
      </div>
      <div className='w-main mx-auto pt-8 pb-4 px-[10px]'>
         <div className='flex gap-5'>
            <div
               className={`text-base font-medium text-gray-700 hover:cursor-pointer hover:bg-slate-300 px-2 rounded py-1 ${selectedCategory === 'All' ? 'bg-slate-300' : ''}`}
               onClick={() => handleCategory('All')}
            >
               All
            </div>
            {categories?.map((item, index) => (
               <div
                  key={index}
                  className={`text-base font-medium text-gray-700 hover:cursor-pointer hover:bg-slate-300 px-2 py-1 rounded ${selectedCategory === item.title ? 'bg-slate-300' : ''}`}
                  onClick={() => handleCategory(item.title)}
               >
                  {item.title}
               </div>
            ))}
         </div>
         <div className='w-full flex mt-5 mb-10 '>
            <div className='w-3/4 flex flex-col gap-10 pr-10'>
               {blogs?.map((item, index) => (
                  <div key={index} className='flex gap-5'>
                     <div className='w-1/2'>
                        <Link
                           to={`/blog/${item._id}/${item.title}`}>
                           <img src={item.thumbnail} alt={item.title} className='w-full h-[280px] object-cover' />
                        </Link>
                     </div>
                     <div className='w-1/2'>
                        <Link
                           to={`/blog/${item._id}/${item.title}`}>
                           <div className='text-lg font-semibold hover:text-main hover:cursor-pointer uppercase mb-2'>{item.title}</div>
                        </Link>
                        <div className='flex gap-2 mb-2 text-[13px]'>
                           <div className='text-gray-400'>By Admin</div>
                           <div className='text-gray-400'>.</div>
                           <div className='text-gray-400'>{moment(item.createdAt).format('MMM DD, YYYY')}</div>
                        </div>
                        <div
                           className='text-sm text-gray-500'
                           dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                 limitText(item.description, 350),
                                 {
                                    FORBID_TAGS: ['img'],
                                    FORBID_ATTRS: ['src'],
                                 })
                           }}
                        />
                        <div className='flex'>
                           <Link
                              to={`/blog/${item._id}/${item.title}`}>
                              <div className='text-main hover:text-black hover:cursor-pointer flex gap-2 items-center mt-2 text-sm'>
                                 <span>Read more</span>
                                 <FaArrowRightLong />
                              </div>
                           </Link>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            <div className='w-1/4 flex-col'>
               <div className='text-[#fff] uppercase text-lg font-semibold py-[10px] px-5 bg-main w-full'>Recent Articles</div>
               <div className='w-full flex flex-col gap-5 p-5 border border-gray-300 shadow-xl'>
                  {recentBlogs?.map((item, index) => (
                     <div key={index} className='flex gap-5'>
                        <div className='flex flex-col gap-2'>
                           <Link
                              to={`/blog/${item._id}/${item.title}`}>
                              <div className='text-sm font-medium hover:text-main hover:cursor-pointer '>{item.title}</div>
                           </Link>
                           <div className='text-xs text-gray-500'>{moment(item.createdAt).format('MMM DD, YYYY')}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
      <div className='w-main mx-auto px-[10px] mb-10'>
         <Pagination totalCount={counts} />
      </div>
   </div>
}

export default Blog
