import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getSubcategoriesService,
  addSubcategoriesService,
  deleteSubcategoryService,
  updateSubcategoryService
} from 'src/services/subcategory'

// Lấy danh sách subcategories
export const getSubcategoriesAsync = createAsyncThunk(
  'subcategory/get',
  async ({ productTypeId }: { productTypeId: string }, { rejectWithValue }) => {
    try {
      const response = await getSubcategoriesService(productTypeId)
   
      return response.data.subcategories
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Thêm danh mục con
export const addSubcategoriesAsync = createAsyncThunk(
  'subcategory/add',
  async ({ productTypeId, subcategories }: { productTypeId: string; subcategories: string[] }, { rejectWithValue }) => {
    try {
      const response = await addSubcategoriesService(productTypeId, subcategories)
    
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Xóa danh mục con
export const deleteSubcategoryAsync = createAsyncThunk(
  'subcategory/delete',
  async ({ productTypeId, subcategory }: { productTypeId: string; subcategory: string }, { rejectWithValue }) => {
    try {
      const response = await deleteSubcategoryService(productTypeId, subcategory)
    
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Cập nhật danh mục con
export const updateSubcategoryAsync = createAsyncThunk(
  'subcategory/update',
  async (
    { productTypeId, oldSubcategory, newSubcategory }: { productTypeId: string; oldSubcategory: string; newSubcategory: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateSubcategoryService(productTypeId, oldSubcategory, newSubcategory)
      
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)
