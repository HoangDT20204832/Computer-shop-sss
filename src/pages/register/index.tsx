
// Next
import {NextPage} from 'next'

// ** React
import { ReactNode } from 'react'

// ** Views
import BlackLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/pages/register'

type TProps = {}

 const Register:NextPage<TProps>=()=> {

  return <RegisterPage />
}

export default Register

//  xem ở file next.d.ts:  getLayout?: (page: ReactElement) => ReactNode
//trang Register có truyền getLayout là dùng layout của BlackLayout
Register.getLayout = (page: ReactNode) => <BlackLayout>{page}</BlackLayout>

Register.guestGuard = true  //trang Register là trang ko bắt bc đăng nhập => truyền guestGuard = true để đá sang <GuestGuard/> để hiện thị giao diện
