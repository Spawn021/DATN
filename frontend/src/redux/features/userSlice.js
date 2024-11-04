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
   },
   reducers: {
      login: (state, action) => {
         //  console.log(action.payload)
         state.isLoggedIn = action.payload.isLoggedIn
         state.token = action.payload.token
      },
      logout: (state) => {
         state.isLoggedIn = false
         state.token = null
      },
   },
   extraReducers: (builder) => {
      builder.addCase(getUserCurrent.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(getUserCurrent.fulfilled, (state, action) => {
         state.loading = false
         state.error = null
         state.userData = action.payload.user
         state.isLoggedIn = true
      })
      builder.addCase(getUserCurrent.rejected, (state, action) => {
         state.loading = false
         state.error = action.error.message
      })
   },
})
export const { login, logout } = userSlice.actions

export default userSlice.reducer
