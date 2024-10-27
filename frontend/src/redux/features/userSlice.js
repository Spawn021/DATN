import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const userSlice = createSlice({
   name: 'user',
   initialState: {
      isLoggedIn: false,
      userData: null,
      token: null,
   },
   reducers: {
      registerUser: (state, action) => {
         //  console.log(action.payload)
         state.isLoggedIn = action.payload.isLoggedIn
         state.userData = action.payload.userData
         state.token = action.payload.token
      },
   },
})
export const { registerUser } = userSlice.actions

export default userSlice.reducer
