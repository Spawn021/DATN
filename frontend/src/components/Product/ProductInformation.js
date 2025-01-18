import React, { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { showModal } from '../../redux/features/modalSlice'
import { productDescriptionTabs } from '../../ultils/constants'
import { Votebar, VoteOption, Button, Comment } from '../../components'
import { renderStar } from '../../ultils/helpers'
import { apiProducts } from '../../redux/apis'
import path from '../../ultils/path'


const ProductInformation = ({ totalRating, ratings, nameProduct, pid, rerender }) => {
   console.log(ratings)

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
               className={`py-[9px] px-5 border-[1px] border-solid border-b-0 cursor-pointer hover:bg-white ${activeTab === 3 ? 'bg-white border-b-transparent ' : 'bg-[#f1f1f1]'
                  }`}
               onClick={() => setActiveTab(3)}
            >
               DELIVERY
            </span>
            <span
               className={`py-[9px] px-5 border-[1px] border-solid border-b-0 cursor-pointer hover:bg-white ${activeTab === 4 ? 'bg-white border-b-transparent ' : 'bg-[#f1f1f1]'
                  }`}
               onClick={() => setActiveTab(4)}
            >
               PAYMENT
            </span>
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
               {activeTab === 3 && (
                  <div>
                     <div className='text-lg font-semibold mb-2'>Delivery & Return </div>
                     <ul className='flex gap-2 flex-col pl-6'>
                        <li className='text-sm list-square pl-1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sint irure occaecat sit pariatur voluptate occaecat sit sit tempor occaecat.</li>
                        <li className='text-sm list-square pl-1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna sunt cupidatat consectetur aliqua eu deserunt. Dolor anim occaecat commodo aliquip do.</li>
                        <li className='text-sm list-square pl-1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi veniam occaecat enim dolore id ipsum proident sunt.</li>
                        <li className='text-sm list-square pl-1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim officia mollit nostrud ipsum incididunt proident id adipisicing esse est fugiat excepteur dolore do. Ipsum commodo labore duis ad voluptate duis proident proident aute dolore proident nulla. Eiusmod cillum velit excepteur pariatur incididunt elit id excepteur consequat excepteur et. Magna cupidatat nostrud ea est ad culpa veniam id ut nisi est eu.</li>
                     </ul>
                  </div>
               )}
               {activeTab === 4 && (
                  <div>
                     <div className='text-lg font-semibold mb-2'>Payment</div>
                     <div className='flex gap-2 flex-col'>
                        <div className='text-sm'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reprehenderit do irure laboris tempor laborum Lorem do. Sunt cillum deserunt dolor veniam sunt mollit. Commodo sunt cupidatat id incididunt reprehenderit irure esse irure magna deserunt irure veniam voluptate. Mollit ullamco anim non ipsum incididunt qui ea exercitation. Pariatur quis laborum commodo duis in cupidatat officia sint duis cillum sint est.</div>
                        <div className='text-sm'>Officia fugiat commodo veniam aliquip labore est ut aliqua eiusmod. Sit irure nostrud consequat excepteur sit reprehenderit mollit laboris deserunt velit pariatur quis Lorem. Magna tempor culpa sunt amet occaecat exercitation dolor. Ad dolore eiusmod incididunt incididunt. Excepteur quis Lorem sit occaecat.</div>
                        <div className='text-sm'>Eiusmod officia laboris culpa magna. Lorem nisi consequat tempor laboris minim do nulla amet Lorem nisi laborum incididunt. Qui ad mollit incididunt ut Lorem dolore. Proident aliqua amet enim nostrud exercitation laborum veniam proident laboris fugiat occaecat do enim excepteur. Ullamco velit velit officia occaecat esse proident ad veniam laboris et exercitation. Mollit nulla proident aute mollit ea esse ex duis.</div>
                     </div>
                  </div>
               )}
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
