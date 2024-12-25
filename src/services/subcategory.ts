import axios from 'axios'
import { API_ENDPOINT } from 'src/configs/api'

const BASE_URL = '/api/subcategories'

// Fetch all subcategories for a specific product type
export const getSubcategoriesService = (productTypeId: string) => {
  return axios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/${productTypeId}/subcategories`)
}

// Thêm danh mục con
export const addSubcategoriesService = (productTypeId: string, subcategories: string[]) => {
  return axios.post(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/${productTypeId}/subcategories`, { subcategories })
}

// Xóa danh mục con
export const deleteSubcategoryService = (productTypeId: string, subcategory: string) => {
  return axios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/${productTypeId}/subcategories`, {
    data: { subcategory }
  })
}

// Cập nhật danh mục con
export const updateSubcategoryService = (productTypeId: string, oldSubcategory: string, newSubcategory: string) => {
  return axios.put(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/${productTypeId}/subcategories`, {
    oldSubcategory,
    newSubcategory
  })
}