import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/stores/store'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
   <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </PersistGate>
   </Provider>,
)
