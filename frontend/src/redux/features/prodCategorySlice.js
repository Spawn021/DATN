import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiProdCategories } from '../apis'

export const getProdCategories = createAsyncThunk('prodCate/getProdCategories', async (data, { rejectWithValue }) => {
   const response = await apiProdCategories.getProductCategories()
   if (!response.success) return rejectWithValue(response)

   return response
})

const prodCategorySlice = createSlice({
   name: 'prodCate',
   initialState: {
      categories: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(getProdCategories.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(getProdCategories.fulfilled, (state, action) => {
         state.loading = false
         state.error = null
         state.categories = action.payload.getAllProductCategory
      })
      builder.addCase(getProdCategories.rejected, (state, action) => {
         state.loading = false
         state.error = action.error.message
      })
   },
})

// export const {} = prodCategorySlice.actions
export default prodCategorySlice.reducer
