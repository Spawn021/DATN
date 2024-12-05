import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login, Home, Public, FAQ, Service, ProductDetail, Products, Blog, ActiveRegister, ForgetPassword } from './pages/public'
// import { Login, Home, Public } from './pages/public'
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
            <Route path={path.PUBLIC} element={<Public />}>
               <Route path={path.HOME} element={<Home />} />
               <Route path={path.BLOGS} element={<Blog />} />
               <Route path={path.PRODUCTS} element={<Products />} />
               <Route path={path.OUR_SERVICES} element={<Service />} />
               <Route path={path.FAQS} element={<FAQ />} />
               <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<ProductDetail />} />
            </Route>
            <Route path={path.ACTIVE_REGISTER} element={<ActiveRegister />} />
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.FORGET_PASSWORD} element={<ForgetPassword />} />
         </Routes>
      </div>
   )
}

export default App
