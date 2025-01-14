import React from 'react'
import { useSelector } from 'react-redux'
import Masonry from 'react-masonry-css'
import { Breadcrumb, Pagination, Product } from '../../components'

const Wishlist = () => {
    const { userData } = useSelector(state => state.user)
    const breakpointColumnsObj = {
        default: 4,
        1024: 3,
        768: 2,
        480: 1,
    }
    return (
        <div className='w-full'>
            <div className='flex flex-col justify-center items-center h-[80px] gap-2 bg-[#f7f7f7]'>
                <div className='w-main px-[10px] font-semibold text-[18px] uppercase'>Wishlist</div>
                <Breadcrumb />
            </div>
            <div className='w-main mx-auto pt-8 pb-4 px-[10px]'>
                {userData.wishlist.length > 0 ? (
                    <Masonry breakpointCols={breakpointColumnsObj} className='flex mx-[-10px]'>
                        {userData.wishlist.map((product, index) => (
                            <Product key={index} product={product} delWishlist />
                        ))}
                    </Masonry>
                ) : (
                    <div className='text-center text-gray-500 py-10'>No products available in wishlist.</div>
                )}
            </div>
            {userData.wishlist.length > 0 && <div className='w-main mx-auto px-[10px]'>
                <Pagination totalCount={userData.wishlist.length} pageSize={process.env.REACT_APP_PRODUCT_LIMIT} />
            </div>}
            <div className='w-full h-[400px]'></div>
        </div>
    )
}

export default Wishlist