import React, { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import moment from 'moment'
import Slider from 'react-slick'
import { apiBlogs } from '../../redux/apis'
import icons from '../../ultils/icons'
import { limitText } from '../../ultils/helpers'
const BlogPost = () => {
   const { FaCalendarAlt } = icons
   const settings = {
      dots: false,
      infinite: true,
      // autoplay: true,
      autoplaySpeed: 2000,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
   }
   const [blogs, setBlogs] = useState([])
   const getBlogs = async () => {
      const response = await apiBlogs.getBlogs({ sort: '-createdAt', limit: 5 })
      if (response.success) setBlogs(response.blogs)
   }
   useEffect(() => {
      getBlogs()
   }, [])
   console.log(blogs)
   return <>
      <h2 className='text-xl font-semibold text-[#151515] border-main border-b-[2px] pb-4 mb-4'>BLOG POSTS</h2>
      <div className='mx-[-10px]'>
         <Slider {...settings}>
            {blogs.map((blog, index) => (
               <div key={index} className='w-full px-[10px] mb-[20px]'>
                  <div className='w-full flex flex-col items-center focus:outline-none'>
                     <Link to={`/blog/${blog._id}/${blog.title}`}>
                        <img src={blog.thumbnail} alt={blog.title} className='h-[260px] object-contain' />
                     </Link>
                     <Link to={`/blog/${blog._id}/${blog.title}`}>
                        <div className='text-base mx-[15px] font-semibold hover:text-main hover:cursor-pointer uppercase my-4 text-center'>{blog.title}</div>
                     </Link>
                     <div className='flex gap-2 text-[14px] justify-center items-center'>
                        <FaCalendarAlt className='text-gray-400' />
                        <div className='text-gray-400'>{moment(blog.createdAt).format('MMM DD, YYYY')}</div>
                     </div>
                     <div
                        className='text-sm text-[#505050] text-center mt-[10px]'
                        dangerouslySetInnerHTML={{
                           __html: DOMPurify.sanitize(
                              limitText(blog.description, 200),
                              {
                                 FORBID_TAGS: ['img'],
                                 FORBID_ATTRS: ['src'],
                              })
                        }}
                     />
                  </div>
               </div>
            ))}
         </Slider>
      </div>
   </>
}

export default memo(BlogPost)
