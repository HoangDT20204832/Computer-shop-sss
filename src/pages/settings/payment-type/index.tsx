
// Next
import {NextPage} from 'next'

// ** React
import { ReactNode } from 'react'

// ** Views
import BlackLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/pages/register'
import { PERMISSIONS } from 'src/configs/permission'
// ** Pages
import PaymentTypeListPage from 'src/views/pages/settings/payment-type/PaymentTypeList'

type TProps = {}

 const PaymentType:NextPage<TProps>=()=> {

  return (
    <PaymentTypeListPage/>
  )
}
  
// PaymentType.permission = [PERMISSIONS.SETTING.PAYMENT_TYPE.VIEW]

export default PaymentType


