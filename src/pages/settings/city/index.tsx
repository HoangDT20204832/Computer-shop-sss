
// Next
import {NextPage} from 'next'

// ** React
import { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'

// ** Views
import BlackLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/pages/register'
import CityListPage from 'src/views/pages/settings/city/CityList'

type TProps = {}

 const City:NextPage<TProps>=()=> {

  return <CityListPage/>
}

// City.permission = [PERMISSIONS.SETTING.CITY.VIEW] 

export default City


