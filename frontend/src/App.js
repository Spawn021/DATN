import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login, Home, PublicLayout, FAQ, Service, ProductDetail, Products, Blog, ActiveRegister, ForgetPassword } from './pages/public'
import { AdminLayout, ManageOrders, ManageProducts, ManageUsers, CreateProduct, Dashboard } from './pages/admin'
import { MemberLayout, Personal } from './pages/member'
import path from './ultils/path'
import { ScrollToTopHandler, Modal } from './components'
import { useSelector } from 'react-redux'

function App() {
   const { isShowModal, modalContent } = useSelector((state) => state.modal)

   return (
      <div className='min-h-screen relative'>
         {isShowModal && <Modal>{modalContent}</Modal>}
         <ScrollToTopHandler />
         <Routes>
            <Route path={path.ALL} element={<h1>404 Not Found</h1>} />
            <Route path={path.PUBLIC} element={<PublicLayout />}>
               <Route path={path.HOME} element={<Home />} />
               <Route path={path.BLOGS} element={<Blog />} />
               <Route path={path.PRODUCTS} element={<Products />} />
               <Route path={path.OUR_SERVICES} element={<Service />} />
               <Route path={path.FAQS} element={<FAQ />} />
               <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<ProductDetail />} />
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
            </Route>

            <Route path={path.ACTIVE_REGISTER} element={<ActiveRegister />} />
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.FORGET_PASSWORD} element={<ForgetPassword />} />
         </Routes>
      </div>
   )
}

export default App
