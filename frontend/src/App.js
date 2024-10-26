import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login, Home, Public, FAQ, Service, ProductDetail, Products, Blog } from './pages/public'
// import { Login, Home, Public } from './pages/public'
import path from './ultils/path'

function App() {
   return (
      <div className='min-h-screen'>
         <Routes>
            <Route path={path.PUBLIC} element={<Public />}>
               <Route path={path.HOME} element={<Home />} />
               <Route path={path.BLOGS} element={<Blog />} />
               <Route path={path.PRODUCTS} element={<Products />} />
               <Route path={path.OUR_SERVICES} element={<Service />} />
               <Route path={path.FAQS} element={<FAQ />} />
               <Route path={path.DETAIL_PRODUCT__PID__TITLE} element={<ProductDetail />} />
            </Route>
            <Route path={path.LOGIN} element={<Login />} />
         </Routes>
      </div>
   )
}

export default App
