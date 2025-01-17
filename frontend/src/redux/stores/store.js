import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import prodCategoryReducer from '../features/prodCategorySlice'
import blogCategoryReducer from '../features/blogCategorySlice'
import userReducer from '../features/userSlice'
import modalReducer from '../features/modalSlice'

const commonPersistConfig = {
   key: 'user',
   storage, // defaults to localStorage for web
}

const userPersistConfig = {
   ...commonPersistConfig,
   whitelist: ['isLoggedIn', 'token', 'userData', 'currentCart'], // only save in storage
}
const blogCategoryPersistConfig = {
   key: 'blogCategory',
   storage,
   whitelist: ['categories'],
};
const prodCategoryPersistConfig = {
   key: 'prodCategory',
   storage,
   whitelist: ['categories'],
};
export const store = configureStore({
   reducer: {
      prodCategory: persistReducer(prodCategoryPersistConfig, prodCategoryReducer),
      blogCategory: persistReducer(blogCategoryPersistConfig, blogCategoryReducer),
      user: persistReducer(userPersistConfig, userReducer),
      modal: modalReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            ignoredPaths: ['modal.modalContent', 'modal.changeAddressModalContent'],
            ignoredActionPaths: ['payload.modalContent', 'payload.changeAddressModalContent'],
         },
      }),
})
export const persistor = persistStore(store)
