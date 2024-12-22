// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

//  **  Next-auth
import { SessionProvider } from "next-auth/react"


// ** Store Imports
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Contexts
import { AuthProvider } from 'src/contexts/AuthContext'

// ** Global css styles
import 'src/styles/globals.scss'
import "react-multi-carousel/lib/styles.css";

// ** Redux
import { store } from 'src/stores'

// ** Components
import GuestGuard from 'src/components/auth/GuestGuard'
import AuthGuard from 'src/components/auth/AuthGuard'
import FallbackSpinner from 'src/components/fall-back'
import { SettingsConsumer, SettingsProvider } from 'src/contexts/SettingsContext'
import AclGuard from 'src/components/auth/AclGuard'
import ReactHotToast from 'src/components/react-hot-toast'

// ** Hooks
import { useSettings } from 'src/hooks/useSettings'

// ** Theme
import ThemeComponent from 'src/theme/ThemeComponent'

// ** Views
import UserLayout from 'src/views/layouts/UserLayout'

// ** Helpers
import { AxiosInterceptor } from 'src/helpers/axios'
import NoGuard from 'src/components/auth/NoGuard'

import { useTheme } from '@mui/material'

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

// ** Pace Loader (tạo thanh ngang màu xanh khi ấn chuyển trang (load))
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

//Tạo component Guard với biến authGuard mặc định =true; và guestGuard mặc định =false
// => các page nếu ko truyền gì thì sẽ mặc định nhân {authGuard=true, guestGuard=false} => chạy vào <AuthGuard/> (những trang chỉ cho user vào)
// => những trang ko bắt bc đăng nhập và ko cho vào khi đã đăng nhập(chỉ cho khách vào nhưu login,...)  => phải truyền thêm guestGuard=true => chạy vào <GuestGiard/>
// => những trang ko bắt bc đăng nhập và có thể vào kể cả khi đã đăng nhập(cho cả khách và user vào) => truyênf thêm authGuard=true, guestGuard=true 
const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <NoGuard fallback={<FallbackSpinner/>}>{children}</NoGuard>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}

export default function App(props: ExtendedAppProps) {
  const { Component, pageProps : { session, ...pageProps }} = props

  console.log("Component", {Component})

  const { settings } = useSettings()
  const theme = useTheme()

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>) 
     
   //Những page có truyền getLayout thì sẽ sử dụng Layout của chính nó truyền
   //còn những page ko có truyền getLayout thì sẽ sử dụng layput mặc định là <UserLayout/>

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  const permission = Component.permission ?? [] //permision của từng trang mà ta vào
  // console.log("permisson", permission)

  const toastOptions = {
    success: {
      className: 'react-hot-toast',
      style: {
        background: '#DDF6E8',
        color: theme.palette.text.primary
      }
    },
    error: {
      className: 'react-hot-toast',
      style: {
        background: '#FDE4D5',
        color: theme.palette.text.primary
      }
    }
  }

  return (
    <Provider store={store}>
      <Head>
        <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.`}
        />
        <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <AuthProvider>
        <AxiosInterceptor>
        <SessionProvider session={session}>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      <AclGuard permisson={permission} aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </AclGuard>
                    </Guard>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={toastOptions} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
          </SessionProvider>
        </AxiosInterceptor>
      </AuthProvider>
    </Provider>
  )
}
