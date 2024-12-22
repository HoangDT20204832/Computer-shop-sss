// ** Configs
import { ACCESS_TOKEN,DEVICE_TOKEN, PRE_AUTH_TOKEN, REFRESH_TOKEN, TEMPORARY_TOKEN,REMEMBER_AUTH_TOKEN, USER_DATA } from 'src/configs/auth'
import { LOCAL_PRODUCT_CART } from 'src/configs/product'
import { TItemOrderProduct } from 'src/types/order-product'

export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  if(typeof window !== 'undefined'){ 
     window.localStorage.setItem(USER_DATA, userData),
     window.localStorage.setItem(ACCESS_TOKEN, accessToken),
    window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}

export const getLocalUserData = () => {
  //xét thêm điều kiện này để khi có window mới trả về; để tránh khi dùng nso trong 1 component có sửu dụng cả 2 hình thức serversiderendering và cliensiderendering
    // vd:_app.tsx
  if(typeof window !== 'undefined') {  
  return {
    userData: window.localStorage.getItem(USER_DATA),
    accessToken: window.localStorage.getItem(ACCESS_TOKEN),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
  }
}

   return {
    userData: '',
    accessToken: '',
    refreshToken: ''
   }
}

export const clearLocalUserData = () => {
  if(typeof window !== 'undefined') {
    window.localStorage.removeItem(USER_DATA)
    window.localStorage.removeItem(ACCESS_TOKEN)
    window.localStorage.removeItem(REFRESH_TOKEN)
  }

}

///////////////
// Tạo ra TemporaryToken: 1 access token tạm thời (khi ko chọn remmeber me) sẽ bị xóa đi khỏi localStogate khi reload lại trang
// và khi TemporaryToken hết hạn thì sẽ có refreshToken cấp lại TemporaryToken mới => phải đăng nhập lại

export const setTemporaryToken = ( accessToken: string) => {
  if(typeof window !== 'undefined'){ 
     window.localStorage.setItem(TEMPORARY_TOKEN, accessToken)
  }
}

export const getTemporaryToken = () => {
  //xét thêm điều kiện này để khi có window mới trả về; để tránh khi dùng nso trong 1 component có sửu dụng cả 2 hình thức serversiderendering và cliensiderendering
    // vd:_app.tsx
  if(typeof window !== 'undefined') {  
  return {
    temporaryToken: window.localStorage.getItem(TEMPORARY_TOKEN),
  }
}

return {
    temporaryToken: '',
   }
}

export const clearTemporaryToken = () => {
  if(typeof window !== 'undefined') {
    window.localStorage.removeItem(TEMPORARY_TOKEN)
  }
}

// Hàm này có tácd dụng lưu trữ danh sách product thêm vaoof giở hàng trên localstrorage
export const setLocalProductToCart = (data: Record<string, TItemOrderProduct[]>) => {
  console.log("data", {data})
  if (typeof window !== 'undefined') {
    window.localStorage?.setItem(LOCAL_PRODUCT_CART, JSON.stringify(data))
  }
}
export const getLocalProductCart = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(LOCAL_PRODUCT_CART)
  }

  return ""
}

// Hàm gán Accestoken(PreTokenAuthSocial) lúc đầu do google, or facebook trả về khi client ấn sighIn()
export const setLocalPreTokenAuthSocial = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRE_AUTH_TOKEN, token)
  }
}
export const clearLocalPreTokenAuthSocial = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(PRE_AUTH_TOKEN)
  }
}
export const getLocalPreTokenAuthSocial = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(PRE_AUTH_TOKEN)
  }

  return ""
}


export const setLocalRememberLoginAuthSocial = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(REMEMBER_AUTH_TOKEN, token)
  }
}
export const clearLocalRememberLoginAuthSocial = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(REMEMBER_AUTH_TOKEN)
  }
}
export const getLocalRememberLoginAuthSocial = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(REMEMBER_AUTH_TOKEN)
  }
  
  return ""
}

export const setLocalDeviceToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DEVICE_TOKEN, token)
  }
}
export const clearLocalDeviceToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(DEVICE_TOKEN)
  }
}
export const getLocalDeviceToken = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(DEVICE_TOKEN)
  }
  
  return ""
}