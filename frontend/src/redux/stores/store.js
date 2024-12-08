import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import prodCategoryReducer from '../features/prodCategorySlice'
import userReducer from '../features/userSlice'
import modalReducer from '../features/modalSlice'

const commonPersistConfig = {
   key: 'user',
   storage, // defaults to localStorage for web
}

const userPersistConfig = {
   ...commonPersistConfig,
   whitelist: ['isLoggedIn', 'token', 'userData'], // only save in storage
}
export const store = configureStore({
   reducer: {
      prodCategory: prodCategoryReducer,
      user: persistReducer(userPersistConfig, userReducer),
      modal: modalReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            ignoredPaths: ['modal.modalContent'],
            ignoredActionPaths: ['payload.modalContent'],
         },
      }),
})
export const persistor = persistStore(store)
