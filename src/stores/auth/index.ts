// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { changePasswordMeAsync, forgotPasswordAuthAsync,
   registerAuthAsync, 
   // COMMENTED: Social registration temporarily disabled
   // registerAuthFacebookAsync, 
   // registerAuthGoogleAsync, 
   resetPasswordAuthAsync, 
   serviceName, updateAuthMeAsync } from 'src/stores/auth/actions'
import { UserDataType } from 'src/contexts/types'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

type TInitialState = {
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
  message: string,
  typeError: string,
  isSuccessUpdateMe: boolean,
  isErrorUpdateMe: boolean,
  messageUpdateMe: string,
  isSuccessChangePassword: boolean,
  isErrorChangePassword: boolean,
  messageChangePassword: string,
  userData: UserDataType | null,
  isSuccessResetPassword: boolean,
  isErrorResetPassword: boolean,
  messageResetPassword: string,
  isSuccessForgotPassword: boolean,
  isErrorForgotPassword: boolean,
  messageForgotPassword: string,
}

const initialState: TInitialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  messageUpdateMe: '',
  isSuccessChangePassword: true,
  isErrorChangePassword: false,
  messageChangePassword: '',
  userData: null,
  isSuccessForgotPassword: true,
  isErrorForgotPassword: false,
  messageForgotPassword: '',
  isSuccessResetPassword: true,
  isErrorResetPassword: false,
  messageResetPassword: '',
}

export const authSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = false
      state.messageUpdateMe = ''
      state.isSuccessChangePassword = false
      state.isErrorChangePassword = false
      state.messageChangePassword = ''
      state.isSuccessForgotPassword = false
      state.isErrorForgotPassword = true
      state.messageForgotPassword = ''
      state.isSuccessResetPassword = false
      state.isErrorResetPassword = true
      state.messageResetPassword = ''
    }
  },

  extraReducers: builder => {
    // ** Register
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        state.isSuccess = !!action.payload?.data?.email //true khi có email
        state.isError = !action.payload?.data?.email // true khi ko có email
        state.message = action.payload?.message
        state.typeError = action.payload?.typeError
      }),
      builder.addCase(registerAuthAsync.rejected, (state, action) => {
        // khi call thất bại
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = ''
        state.typeError = ''
      })

    // COMMENTED: Google/Facebook registration temporarily disabled due to API billing issues
    // ** register with Google
    // builder.addCase(registerAuthGoogleAsync.pending, (state, action) => {
    //   state.isLoading = true
    // })
    // builder.addCase(registerAuthGoogleAsync.fulfilled, (state, action) => {
    //   console.log("action", {action})
    //   state.isLoading = false
    //   state.isSuccess = !!action.payload?.data?.email
    //   state.isError = !action.payload?.data?.email
    //   state.message = action.payload?.message
    //   state.typeError = action.payload?.typeError
    // })
    // builder.addCase(registerAuthGoogleAsync.rejected, (state, action) => {
    //   state.isLoading = false
    //   state.isSuccess = false
    //   state.isError = true
    //   state.message = ''
    //   state.typeError = ''
    // })

    //  // ** register with facebook
    //  builder.addCase(registerAuthFacebookAsync.pending, (state, action) => {
    //   state.isLoading = true
    // })
    // builder.addCase(registerAuthFacebookAsync.fulfilled, (state, action) => {
    //   state.isLoading = false
    //   state.isSuccess = !!action.payload?.data?.email
    //   state.isError = !action.payload?.data?.email
    //   state.message = action.payload?.message
    //   state.typeError = action.payload?.typeError
    // })
    // builder.addCase(registerAuthFacebookAsync.rejected, (state, action) => {
    //   state.isLoading = false
    //   state.isSuccess = false
    //   state.isError = true
    //   state.message = ''
    //   state.typeError = ''
    // })


    // ** Update-me
    builder.addCase(updateAuthMeAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        state.isSuccessUpdateMe = !!action.payload?.data?.email //true khi có email
        state.isErrorUpdateMe = !action.payload?.data?.email // true khi ko có email
        state.messageUpdateMe = action.payload?.message
        state.typeError = action.payload?.typeError
        state.userData = action.payload?.data
      }),
      builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
        // khi call thất bại
        state.isLoading = false
        state.isSuccessUpdateMe = false
        state.isErrorUpdateMe = true
        state.messageUpdateMe = ''
        state.typeError = ''
        state.userData= null
      })

    // ** Change-password-me
    builder.addCase(changePasswordMeAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(changePasswordMeAsync.fulfilled, (state, action) => {
        //khi call thành công
        console.log('action', action)
        state.isLoading = false
        state.isSuccessChangePassword = !!action.payload?.data //true khi có email
        state.isErrorChangePassword = !action.payload?.data // true khi ko có email
        state.messageChangePassword = action.payload?.message
        state.typeError = action.payload?.typeError
      }),
      builder.addCase(changePasswordMeAsync.rejected, (state, action) => {
        // khi call thất bại
        state.isLoading = false
        state.isSuccessChangePassword = false
        state.isErrorChangePassword = true
        state.messageChangePassword = ''
        state.typeError = ''
      })

    // ** reset password
     builder.addCase(resetPasswordAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(resetPasswordAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessResetPassword = !!action.payload?.data?.email
      state.isErrorResetPassword = !action.payload?.data?.email
      state.messageResetPassword = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(resetPasswordAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessResetPassword = false
      state.isErrorResetPassword = true
      state.messageResetPassword = ''
      state.typeError = ''
    })
     // ** forgot password
     builder.addCase(forgotPasswordAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(forgotPasswordAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessForgotPassword = !!action.payload?.data?.email
      state.isErrorForgotPassword = !action.payload?.data?.email
      state.messageForgotPassword = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(forgotPasswordAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessForgotPassword = false
      state.isErrorForgotPassword = true
      state.message = ''
      state.typeError = ''
    })
  }
})


export const { resetInitialState } = authSlice.actions
export default authSlice.reducer
