import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { Login, Home, PublicLayout, FAQ, Service, ProductDetail, Products, Blog, ActiveRegister, ForgetPassword, DetailCart, Wishlist } from './pages/public'
import { AdminLayout, ManageOrders, ManageProducts, ManageUsers, CreateProduct, Dashboard, ManageCoupon, CreateCoupon } from './pages/admin'
import { MemberLayout, Personal, History, ChangePassword, Checkout, Payment, MyAddress } from './pages/member'
import path from './ultils/path'
import { ScrollToTopHandler, Modal, ScrollToTopButton, Cart, ModalChangeAddress } from './components'
import { showCart } from './redux/features/modalSlice'

function App() {
   const { isShowModal, modalContent, isShowCart, isShowChangeAddressModal, changeAddressModalContent } = useSelector((state) => state.modal)
   const dispatch = useDispatch()
   return (
      <div className='h-screen relative'>
         {isShowCart &&
            <div onClick={() => dispatch(showCart())} className='absolute inset-0 bg-black bg-opacity-50 z-50 flex justify-end'>
               <Cart />
            </div>
         }
         {isShowModal && <Modal>{modalContent}</Modal>}
         {isShowChangeAddressModal && <ModalChangeAddress>{changeAddressModalContent}</ModalChangeAddress>}
         <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
         />
         <ScrollToTopHandler />
         <ScrollToTopButton />
         <Routes>
            <Route path={path.ALL} element={<h1>404 Not Found</h1>} />
            <Route path={path.CHECKOUT} element={<Checkout />} />
            <Route path={path.PAYMENT} element={<Payment />} />
            <Route path={path.PUBLIC} element={<PublicLayout />}>
               <Route path={path.HOME} element={<Home />} />
               <Route path={path.BLOGS} element={<Blog />} />
               <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
               <Route path={path.OUR_SERVICES} element={<Service />} />
               <Route path={path.FAQS} element={<FAQ />} />
               <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<ProductDetail />} />
               <Route path={path.DETAIL_CART} element={<DetailCart />} />
               <Route path={path.WISHLIST} element={<Wishlist />} />
            </Route>

            <Route path={path.ADMIN} element={<AdminLayout />}>
               <Route path={path.DASHBOARD} element={<Dashboard />} />
               <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
               <Route path={path.MANAGE_ORDERS} element={<ManageOrders />} />
               <Route path={path.MANAGE_USERS} element={<ManageUsers />} />
               <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
               <Route path={path.MANAGE_COUPONS} element={<ManageCoupon />} />
               <Route path={path.CREATE_COUPON} element={<CreateCoupon />} />
            </Route>

            <Route path={path.MEMBER} element={<MemberLayout />}>
               <Route path={path.PERSONAL} element={<Personal />} />
               <Route path={path.HISTORY} element={<History />} />
               <Route path={path.CHANGE_PASSWORD} element={<ChangePassword />} />
               <Route path={path.MY_ADDRESS} element={<MyAddress />} />
            </Route>

            <Route path={path.ACTIVE_REGISTER} element={<ActiveRegister />} />
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.FORGET_PASSWORD} element={<ForgetPassword />} />
         </Routes>
      </div>
   )
}

export default App
