import { createSlice } from '@reduxjs/toolkit'
import {
  getSubcategoriesAsync,
  addSubcategoriesAsync,
  deleteSubcategoryAsync,
  updateSubcategoryAsync
} from './actions'

interface SubcategoryState {
  subcategories: string[]
  loading: boolean
  error: string | null
}

const initialState: SubcategoryState = {
  subcategories: [],
  loading: false,
  error: null
}

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSubcategoriesAsync.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getSubcategoriesAsync.fulfilled, (state, action) => {
        state.loading = false
        state.subcategories = action.payload
      })
      .addCase(getSubcategoriesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addSubcategoriesAsync.fulfilled, (state, action) => {
        state.subcategories = action.payload.productType.subcategories
      })
      .addCase(deleteSubcategoryAsync.fulfilled, (state, action) => {
        state.subcategories = action.payload.productType.subcategories
      })
      .addCase(updateSubcategoryAsync.fulfilled, (state, action) => {
        state.subcategories = action.payload.productType.subcategories
      })
  }
})

export default subcategorySlice.reducer
