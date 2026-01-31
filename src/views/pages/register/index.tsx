// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState } from 'react'

// ** Mui
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Typography,
  useTheme
} from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

import { useDispatch, useSelector } from 'react-redux'
import { registerAuthAsync } from 'src/stores/auth/actions'
// COMMENTED: Social registration temporarily disabled
// import { registerAuthAsync, registerAuthFacebookAsync, registerAuthGoogleAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/components/fall-back'
import { resetInitialState } from 'src/stores/auth'
import { useRouter } from 'next/router'
// COMMENTED: Social registration temporarily disabled
// import { useSession, signIn, signOut } from "next-auth/react"
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { clearLocalPreTokenAuthSocial, getLocalPreTokenAuthSocial, setLocalPreTokenAuthSocial } from 'src/helpers/storage'

type TProps = {}

type TDefaultValue = {
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage: NextPage<TProps> = () => {
  // State
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  // COMMENTED: Social registration temporarily disabled
  // const prevTokenLocal = getLocalPreTokenAuthSocial()

  // ** Router
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch() //dùng để đưa actions vào reducer xử lý
  const { isSuccess, isLoading, isError, message } = useSelector((state: RootState) => state.auth) // dùng useSelector để lấy ra các state trong store

  // ** theme
  const theme = useTheme()

  //useTranlate
  const { t } = useTranslation()

  // COMMENTED: Social registration temporarily disabled
  // const { data: session, ...restsss } = useSession()
  // console.log("restsss", { restsss, session })

  const schema = yup.object().shape({
    email: yup.string().required(t('required_field')).matches(EMAIL_REG, t("Rules_email")),
    password: yup
      .string()
      .required(t('required_field'))
      .matches(PASSWORD_REG, t("Rules_password")),
    confirmPassword: yup
      .string()
      .required(t('required_field'))
      .matches(PASSWORD_REG, t("Rules_password"))
      .oneOf([yup.ref('password'), ''], t("Rules_confirm_password"))
  })

  const defaultValues: TDefaultValue = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  console.log('errors', { errors })

  const onSubmit = (data: { email: string; password: string }) => {
    // console.log('data', { data, errors })
    if (!Object.keys(errors).length) {
      dispatch(registerAuthAsync({ email: data.email, password: data.password }))
    }
  }

  // COMMENTED: Google/Facebook registration temporarily disabled due to API billing issues
  // const handleRegisterGoogle = async () => {
  //   signIn("google")            // hàm này sẽ client sẽ gửi signIn lên cho Google để nó tar về thông tin user
  //   // như: name, avatar, accesstoke,...
  //   clearLocalPreTokenAuthSocial()
  // }

  // const handleRegisterFacebook = () => {
  //   signIn("facebook")
  //   clearLocalPreTokenAuthSocial()
  // }
  
  // useEffect(() => {
  //   if ((session as any)?.accessToken && (session as any)?.accessToken !== prevTokenLocal) {
  //     if ((session as any)?.provider === "facebook") {
  //       dispatch(registerAuthFacebookAsync((session as any)?.accessToken))
  //     } else {
  //       dispatch(registerAuthGoogleAsync((session as any)?.accessToken))
  //     }
  //     setLocalPreTokenAuthSocial((session as any)?.accessToken)
  //   }
  // }, [(session as any)?.accessToken])


  useEffect(() => {
    if (message) {
      // tất cả thằng dưới pahri có message thì mưới hiện thông báo toast(tranh việc mưới vào trang reggister đã hiện toast)
      if (isError) {
        toast.error(message)
      } else if (isSuccess) {
        toast.success(message)
        router.push(ROUTE_CONFIG.LOGIN)
      }

      //khi ấn đky xong thì phải reset lại state để nếu ấn liên tục đky mà ko thành công sẽ hiện toast thông báo lỗi liên tục cho họ thấy
      dispatch(resetInitialState())
    }
  }, [isError, isSuccess, message])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, rgb(70, 35, 224) 0%,rgb(45, 253, 249) 100%)'

        }}
      >

        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center'
          , background: "#fff", padding: "10px", width: "500px", borderRadius: "20px"
        }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              {t("Register")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
              <Box sx={{ mt: 2 }} width={{ md: '300px', xs: '290px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required

                      fullWidth
                      label={t("Email")}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t("Enter_email")}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                    />
                  )}
                  name='email'
                />
              </Box>

              <Box sx={{ mt: 2 }} width={{ md: '300px', xs: '290px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth

                      label={t('Password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t("Enter_password")}
                      error={Boolean(errors?.password)}
                      helperText={errors?.password?.message}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='password'
                />
              </Box>

              <Box sx={{ mt: 2 }} width={{ md: '300px', xs: '290px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth

                      label={t('Confirm_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t("Enter_confirm_password")}
                      error={Boolean(errors?.confirmPassword)}
                      helperText={errors?.confirmPassword?.message}
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='confirmPassword'
                />
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t("Register")}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", gap: '4px' }}>
                <Typography>{t("You_have_account")}?</Typography>
                <Link
                  href='/login'
                  style={{
                    color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.common.white
                  }}
                >
                  {t('Login')}
                </Link>
              </Box>
              {/* COMMENTED: Google/Facebook registration temporarily disabled due to API billing issues */}
              {/* <Typography sx={{ textAlign: 'center', mt: 2, mb: 2 }}>Or</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <IconButton sx={{ color: '#497ce2' }}
                  onClick={handleRegisterFacebook}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                    ></path>
                  </svg>
                </IconButton>
                <IconButton sx={{ color: theme.palette.error.main }}
                  onClick={handleRegisterGoogle}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                    ></path>
                  </svg>
                </IconButton>
              </Box> */}
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default RegisterPage
