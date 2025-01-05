// Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'

// ** Views
import BlackLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/pages/register'
import RoleListPage from 'src/views/pages/system/role/RoleList'

type TProps = {}

const Role: NextPage<TProps> = () => {
  return <RoleListPage />
}
//đặt quyền truy cập vào trang Role => chỉ những tài khoản có permissonUser = ["ADMIN.GRANTED"] hoặc bao gồm quyèn như ở dưới(PERMISSIONS.SYSTEM.ROLE.VIEW]) mới được vào
Role.permission = [PERMISSIONS.SYSTEM.ROLE.VIEW]  
export default Role
