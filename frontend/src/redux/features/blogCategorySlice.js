import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiBlogCategories } from '../apis'

export const getAllBlogCategory = createAsyncThunk('blogCate/getAllBlogCategory', async (data, { rejectWithValue }) => {
   const response = await apiBlogCategories.getAllBlogCategory()
   if (!response.success) return rejectWithValue(response)

   return response
})

const blogCategorySlice = createSlice({
   name: 'blogCate',
   initialState: {
      categories: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(getAllBlogCategory.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(getAllBlogCategory.fulfilled, (state, action) => {
         state.loading = false
         state.error = null
         state.categories = action.payload.blogCategories
      })
      builder.addCase(getAllBlogCategory.rejected, (state, action) => {
         state.loading = false
         state.error = action.error.message
      })
   },
})

export default blogCategorySlice.reducer
