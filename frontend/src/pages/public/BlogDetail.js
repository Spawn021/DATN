import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { Breadcrumb } from '../../components'
import { apiBlogs } from '../../redux/apis'

const BlogDetail = () => {
    const params = useParams()
    const [blog, setBlog] = useState(null)
    const getBlog = async () => {
        const response = await apiBlogs.getBlog(params.bid)
        if (response.success) {
            setBlog(response.blog)
        }
    }
    useEffect(() => {
        getBlog()
    }, [])
    return (
        <div className='w-full'>
            <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
                <div className='w-main px-[10px] font-semibold text-[18px]'>{params.title}</div>
                <Breadcrumb title={params.title} />
            </div>
            <div className='w-main mx-auto pt-8 pb-4 px-[10px] mb-10'>
                <div className='flex flex-col gap-4'>
                    <div className='flex gap-2 items-center'>
                        <div className='text-[14px] text-[#333]'>By Adimn</div>
                        <div>.</div>
                        <div className='text-[14px] text-[#333]'>{moment(blog?.createdAt).format('MMM DD, YYYY')}</div>
                        <div>.</div>
                        <div className='text-[14px] text-[#333]'>{`${blog?.numberViews} views`}</div>
                    </div>
                    <div className='text-[14px] text-[#333]' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.description) }} />
                </div>
            </div>
        </div>
    )
}

export default BlogDetail