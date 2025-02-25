import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiUsers } from '../apis'
export const getUserCurrent = createAsyncThunk('user/getUserCurrent', async (data, { rejectWithValue }) => {
   const response = await apiUsers.getUserCurrent()
   if (!response.success) return rejectWithValue(response)
   // console.log(response)
   return response
})

const userSlice = createSlice({
   name: 'user',
   initialState: {
      isLoggedIn: false,
      userData: null,
      token: null,
      loading: false,
      error: null,
      message: '',
      currentCart: [],
   },
   reducers: {
      login: (state, action) => {
         // console.log(action.payload)
         state.isLoggedIn = action.payload.isLoggedIn
         state.token = action.payload.token
      },
      logout: (state) => {
         state.isLoggedIn = false
         state.token = null
         state.userData = null
         state.currentCart = []

      },
      clearMessage: (state) => {
         state.message = ''
      },
      updateCart: (state, action) => {
         const { pid, color, quantity } = action.payload
         const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
         const updatedCart = updatingCart.map((item) => {
            if (item.product?._id === pid && item.color === color) {
               return { ...item, quantity }
            } else {
               return item
            }
         })
         state.currentCart = updatedCart

      }
   },
   extraReducers: (builder) => {
      builder.addCase(getUserCurrent.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(getUserCurrent.fulfilled, (state, action) => {
         state.loading = false
         state.error = null
         state.userData = action.payload.user // user is data from response of api getCurrent in UserController
         state.isLoggedIn = true
         state.currentCart = action.payload.user.cart
      })
      builder.addCase(getUserCurrent.rejected, (state, action) => {
         state.loading = false
         state.error = action.error.message
         state.isLoggedIn = false
         state.token = null
         state.userData = null
         state.message = 'Login session expired. Please login again!'
      })
   },
})
export const { login, logout, clearMessage, updateCart } = userSlice.actions

export default userSlice.reducer
