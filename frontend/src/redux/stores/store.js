import { configureStore } from '@reduxjs/toolkit'
import prodCategoryReducer from '../features/prodCategorySlice'

export const store = configureStore({
   reducer: {
      prodCategory: prodCategoryReducer,
   },
})
