import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import prodCategoryReducer from '../features/prodCategorySlice'
import userReducer from '../features/userSlice'

const commonPersistConfig = {
   key: 'user',
   storage, // defaults to localStorage for web
}
const userPersistConfig = {
   ...commonPersistConfig,
   whitelist: ['isLoggedIn', 'token'], // only save in storage
}
export const store = configureStore({
   reducer: {
      prodCategory: prodCategoryReducer,
      user: persistReducer(userPersistConfig, userReducer),
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
         },
      }),
})
export const persistor = persistStore(store)
