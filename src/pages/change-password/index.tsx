
// Next
import {NextPage} from 'next'

// ** React
import { ReactNode } from 'react'

// ** Views
import BlackLayout from 'src/views/layouts/BlankLayout'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import ChangePasswordPage from 'src/views/pages/change-password'

type TProps = {}

 const ChangPassword:NextPage<TProps>=()=> {

  return <ChangePasswordPage />
}

export default ChangPassword

//  xem ở file next.d.ts:  getLayout?: (page: ReactElement) => ReactNode
//trang ChangPassword có truyền getLayout là dùng layout của LayoutNotApp
ChangPassword.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
