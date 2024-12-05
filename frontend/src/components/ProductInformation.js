import React, { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { showModal } from '../redux/features/modalSlice'
import { productDescriptionTabs } from '../ultils/constants'
import { Votebar, VoteOption, Button, Comment } from '../components'
import { renderStar } from '../ultils/helpers'
import { apiProducts } from '../redux/apis'
import path from '../ultils/path'


const ProductInformation = ({ totalRating, ratings, nameProduct, pid, rerender }) => {

   const { isLoggedIn } = useSelector(state => state.user)
   const [activeTab, setActiveTab] = useState(1)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // const [rating, setRating] = useState({
   //    comment: '',
   //    star: ''
   // })
   const handleSubmitRating = useCallback(async ({ comment, star }) => {
      if (!comment || !star || !pid) {
         Swal.fire({
            title: 'Error',
            text: 'Please fill in all fields',
            icon: 'error',
            confirmButtonText: 'OK'
         })
         return
      }
      const response = await apiProducts.apiRating({ star, comment, pid, updatedAt: Date.now() })
      if (response.success) {
         rerender()
         Swal.fire({
            title: 'Success',
            text: 'Thank you for your review',
            icon: 'success',
            confirmButtonText: 'OK'
         })
      } else {
         Swal.fire({
            title: 'Error',
            text: 'Something went wrong',
            icon: 'error',
            confirmButtonText: 'OK'
         })
      }


   }, [pid])

   const toggleVote = () => {
      if (!isLoggedIn) {
         Swal.fire({
            text: 'You need to login to vote',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Login',
            title: 'Login required',
            showCancelButton: true,

         }).then((result) => {
            if (result.isConfirmed) navigate(`/${path.LOGIN}`)
         })
      } else
         dispatch(showModal({ isShowModal: true, modalContent: <VoteOption nameProduct={nameProduct} handleSubmitRating={handleSubmitRating} /> }))
   }
   return (
      <div>
         <div className='flex items-center gap-2 relative bottom-[-1px] '>
            {productDescriptionTabs.map((tab) => {
               return (
                  <span
                     key={tab.id}
                     className={`py-[9px] px-5 border-[1px] border-solid border-b-0 cursor-pointer hover:bg-white ${activeTab === tab.id ? 'bg-white border-b-transparent ' : 'bg-[#f1f1f1]'
                        }`}
                     onClick={() => setActiveTab(tab.id)}
                  >
                     {tab.name}
                  </span>
               )
            })}
            <span
               className={`py-[9px] px-5 border-[1px] border-solid border-b-0 cursor-pointer hover:bg-white ${activeTab === 5 ? 'bg-white border-b-transparent ' : 'bg-[#f1f1f1]'
                  }`}
               onClick={() => setActiveTab(5)}
            >
               CUSTOMER REVIEWS
            </span>
         </div>
         <div className='border-[#ebebeb] border-[1px] border-solid '>
            <div className='p-3'>
               {productDescriptionTabs.some((tab) => tab.id === activeTab) &&
                  productDescriptionTabs.find((tab) => tab.id === activeTab)?.content}
               {activeTab === 5 && (
                  <div>
                     <div className='flex justify-between border-b pb-5 pt-3'>
                        <div className='w-[35%] flex flex-col items-center justify-center border-r gap-2'>
                           <span className='text-2xl font-semibold'>{`${totalRating}/5`}</span>
                           <span className='flex gap-2'>{renderStar(totalRating)}</span>
                           <div>
                              <span className='text-sm'>{ratings?.length} </span>
                              {
                                 ratings?.length > 1 ? <span className='text-sm'>reviews</span> : <span className='text-sm'>review</span>
                              }
                           </div>
                        </div>
                        <div className='w-[60%]'>
                           {Array.from(Array(5).keys())
                              .reverse()
                              .map((el) => (
                                 <Votebar key={el} number={el + 1} ratingCount={ratings?.filter(i => i.star === el + 1)?.length} totalRatingCount={ratings?.length} />

                              ))}
                        </div>
                     </div>
                     <div className='flex items-center justify-center text-sm my-4 flex-col gap-2'>
                        <div className='text-gray-500'>Do you review this product?</div>
                        <Button handleOnClick={toggleVote} className="text-white bg-main px-3 py-2 rounded hover:bg-[#ee313180]" name="Write a review"> </Button>
                     </div>
                     <div className='flex flex-col gap-4'>
                        {
                           ratings?.map((rating) => (
                              <Comment key={rating._id} star={rating.star} updatedAt={rating.updatedAt} comment={rating.comment} name={`${rating.postedBy?.lastname} ${rating.postedBy?.firstname} `} />
                           ))
                        }
                     </div>
                  </div>

               )}
            </div>
         </div>
      </div>
   )
}

export default memo(ProductInformation)
