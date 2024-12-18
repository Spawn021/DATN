import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import { Login, Home, PublicLayout, FAQ, Service, ProductDetail, Products, Blog, ActiveRegister, ForgetPassword, DetailCart } from './pages/public'
import { AdminLayout, ManageOrders, ManageProducts, ManageUsers, CreateProduct, Dashboard } from './pages/admin'
import { MemberLayout, Personal, MyCart, MyWishlist, History, ChangePassword } from './pages/member'
import path from './ultils/path'
import { ScrollToTopHandler, Modal, ScrollToTopButton, Cart } from './components'
import { showCart } from './redux/features/modalSlice';

function App() {
   const { isShowModal, modalContent, isShowCart } = useSelector((state) => state.modal)
   const dispatch = useDispatch()
   return (
      <div className='h-screen relative'>
         {isShowCart &&
            <div onClick={() => dispatch(showCart())} className='absolute inset-0 bg-black bg-opacity-50 z-50 flex justify-end'>
               <Cart />
            </div>
         }
         {isShowModal && <Modal>{modalContent}</Modal>}
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
            <Route path={path.PUBLIC} element={<PublicLayout />}>
               <Route path={path.HOME} element={<Home />} />
               <Route path={path.BLOGS} element={<Blog />} />
               <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
               <Route path={path.OUR_SERVICES} element={<Service />} />
               <Route path={path.FAQS} element={<FAQ />} />
               <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<ProductDetail />} />
               <Route path={path.DETAIL_CART} element={<DetailCart />} />
            </Route>

            <Route path={path.ADMIN} element={<AdminLayout />}>
               <Route path={path.DASHBOARD} element={<Dashboard />} />
               <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
               <Route path={path.MANAGE_ORDERS} element={<ManageOrders />} />
               <Route path={path.MANAGE_USERS} element={<ManageUsers />} />
               <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
            </Route>

            <Route path={path.MEMBER} element={<MemberLayout />}>
               <Route path={path.PERSONAL} element={<Personal />} />
               <Route path={path.MY_CART} element={<MyCart />} />
               <Route path={path.MY_WISHLIST} element={<MyWishlist />} />
               <Route path={path.HISTORY} element={<History />} />
               <Route path={path.CHANGE_PASSWORD} element={<ChangePassword />} />
            </Route>

            <Route path={path.ACTIVE_REGISTER} element={<ActiveRegister />} />
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.FORGET_PASSWORD} element={<ForgetPassword />} />
         </Routes>
      </div>
   )
}

export default App
