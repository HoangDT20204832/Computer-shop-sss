
// Next
import {NextPage} from 'next'

// ** React
import { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'

// ** Views
import BlackLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/pages/register'

import ProductTypeListPage from 'src/views/pages/manage-product/product-type/ProductTypeList'

type TProps = {}

 const ProductType:NextPage<TProps>=()=> {

  return  <ProductTypeListPage />
  
}

// ProductType.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.VIEW]

export default ProductType


