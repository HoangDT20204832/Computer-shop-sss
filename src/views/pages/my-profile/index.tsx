// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState, useTransition } from 'react'

// ** Mui
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
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

// ** Images
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'
import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'
import { UserDataType } from 'src/contexts/types'
import { convertBase64, separationFullName, toFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/auth'
import { ROUTE_CONFIG } from 'src/configs/route'
import { updateAuthMeAsync } from 'src/stores/auth/actions'
import FallbackSpinner from 'src/components/fall-back'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'
import CustomModal from 'src/components/custom-modal'

import { getAuthMe } from 'src/services/auth'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  fullName: string
  city: string
  phoneNumber: string
  role: string
}

const MyProfilePage: NextPage<TProps> = () => {
  // State
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  // const [roleId, setRoleId] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  const [isDisableRole, setIsDisableRole] = useState(false)

  // const [user, setUser] = useState<UserDataType | null>(null);

  // ** translate
  const { i18n } = useTranslation()
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isErrorUpdateMe, isLoading, isSuccessUpdateMe, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  const schema = yup.object().shape({
    email: yup.string().required(t('required_field')).matches(EMAIL_REG, 'The field is must email type'),
    fullName: yup.string().notRequired(),
    city: yup.string().notRequired(),
    phoneNumber: yup.string().required(t('required_field')).min(8, 'The phone number is min 8 number'),
    address: yup.string().notRequired(),
    role: isDisableRole ? yup.string().notRequired() : yup.string().required(t('required_field'))
  })

  const defaultValues: TDefaultValue = {
    email: '',
    address: '',
    fullName: '',
    city: '',
    phoneNumber: '',
    role: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  //watch: giúp xem được giá trị của các thuộc tính trong form
  console.log('watch', watch('role')) //xem giá trị của "role"

  //fetch api
  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async response => {
        console.log('response1: ', response)
        setLoading(false)
        const data = response?.data
        if (data) {
          // setRoleId(data?.roleId?._id)
          setIsDisableRole(!data?.role?.permissions?.length) //có dữ liệu Role => isDisableRole = false
          setAvatar(data?.avatar)
          reset({
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            role: data?.role?._id,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n?.language)
          })
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const fetchAllRole = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.roles
        if (data) {
          setOptionRoles(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item?.name,
                value: item?._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const fetchAllCities = async () => {
    setLoading(true)
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.cities
        if (data) {
          setOptionCities(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAllRole()
    fetchAllCities()
  }, [])

  useEffect(() => {
    fetchGetAuthMe()
  }, [i18n?.language])

  useEffect(() => {
    if (messageUpdateMe) {
      // tất cả thằng dưới pahri có message thì mưới hiện thông báo toast(tranh việc mưới vào trang reggister đã hiện toast)
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      }

      //khi ấn đky xong thì phải reset lại state để nếu ấn liên tục đky mà ko thành công sẽ hiện toast thông báo lỗi liên tục cho họ thấy
      dispatch(resetInitialState())
    }
  }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe])

  // console.log('errors', { errors })
  const onSubmit = (data: any) => {
    console.log('data1111', { data, errors })
    const { firstName, middleName, lastName } = separationFullName(data?.fullName, i18n.language)
    dispatch(
      updateAuthMeAsync({
        email: data.email,
        role: data.role,
        phoneNumber: data.phoneNumber,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        address: data.address,
        avatar: avatar,
        city: data.city,
      })
    )
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    console.log('base64', base64)
    setAvatar(base64 as string)
  }

  return (
    <>
      {loading || (isLoading && <Spinner />)}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
        <Grid container>
          <Grid
            container
            item
            md={6}
            xs={12}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: 5,
              px: 4
            }}
          >
            <Box sx={{ height: '100%', width: '100%' }}>
              <Grid container spacing={4}>
                <Grid item md={12} xs={12}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      justifyContent: 'center',
                      alignItems: 'center'

                      // position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative'
                      }}
                    >
                      {avatar ? (
                        <IconButton
                          edge='start'
                          sx={{
                            position: 'absolute',
                            bottom: -6,
                            right: -6,
                            zIndex: 2,
                            color: theme.palette.primary.main
                          }}
                          onClick={() => setAvatar('')}
                        >
                          <IconifyIcon icon='material-symbols-light:delete-outline'></IconifyIcon>
                        </IconButton>
                      ) : (
                        <></>
                      )}

                      {avatar ? (
                        <Avatar src={avatar} sx={{ width: 100, height: 100 }}></Avatar>
                      ) : (
                        <Avatar sx={{ width: 100, height: 100 }}>
                          <IconifyIcon icon='ph:user-thin' fontSize={50} />
                        </Avatar>
                      )}
                    </Box>

                    <WrapperFileUpload
                      uploadFunc={handleUploadAvatar}
                      objectAcceptFile={{
                        'image/jpeg': ['.jpg'],
                        'image/png': ['.png']
                      }}
                    >
                      <Button
                        variant='outlined'
                        sx={{ width: 'auto', display: 'flex', justifyContent: 'center', gap: 2 }}
                      >
                        <IconifyIcon icon='ph:camera-thin' />
                        {avatar ? t('change_avatar') : t('upload_avatar')}
                      </Button>
                    </WrapperFileUpload>
                  </Box>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        required
                        disabled
                        
                        fullWidth
                        label={t('Email')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('enter_your_email')}
                        error={Boolean(errors?.email)}
                        helperText={errors?.email?.message}
                      />
                    )}
                    name='email'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  {!isDisableRole && (
                    <Controller
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <div>
                          <label
                            style={{
                              fontSize: '13px',
                              marginBottom: '4px',
                              display: 'block',
                              color: errors?.role
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {t('Role')}
                          </label>
                          <CustomSelect
                            fullWidth
                            disabled
                            onChange={onChange}
                            options={optionRoles}
                            error={Boolean(errors?.role)}
                            onBlur={onBlur}
                            value={value}
                            placeholder={t('enter_your_role')}
                          />

                          {errors?.role?.message && (
                            <FormHelperText
                              sx={{
                                color: errors?.role
                                  ? theme.palette.error.main
                                  : `rgba(${theme.palette.customColors.main}, 0.42)`
                              }}
                            >
                              {errors?.role?.message}
                            </FormHelperText>
                          )}
                        </div>
                      )}
                      name='role'
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
              marginLeft={{ md: 5, xs: 0 }}
            >
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        
                        fullWidth
                        label={t('Full_name')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('enter_your_full_name')}
                        error={Boolean(errors?.fullName)}
                        helperText={errors?.fullName?.message}
                      />
                    )}
                    name='fullName'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        
                        fullWidth
                        label={t('Address')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('enter_your_address')}
                        error={Boolean(errors?.address)}
                        helperText={errors?.address?.message}
                      />
                    )}
                    name='address'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Box>
                        <InputLabel
                          sx={{
                            fontSize: '13px',
                            marginBottom: '4px',
                            display: 'block',
                            color: errors?.city
                              ? theme.palette.error.main
                              : `rgba(${theme.palette.customColors.main}, 0.42)`
                          }}
                        >
                          {t('City')}
                        </InputLabel>
                        <CustomSelect
                          fullWidth
                          onChange={onChange}
                          options={optionCities}
                          error={Boolean(errors?.city)}
                          onBlur={onBlur}
                          value={value}
                          placeholder={t('enter_your_city')}
                        />
                        {errors?.city?.message && (
                          <FormHelperText
                            sx={{
                              color: !errors?.city
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {errors?.city?.message}
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                    name='city'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        required
                        
                        fullWidth
                        label={t('Phone_number')}
                        onChange={e => {
                          const numValue = e.target.value.replace(/\D/g, '')
                          onChange(numValue)
                        }}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          minLength: 8
                        }}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('enter_your_phone')}
                        error={Boolean(errors?.phoneNumber)}
                        helperText={errors?.phoneNumber?.message}
                      />
                    )}
                    name='phoneNumber'
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
            {t('Update')}
          </Button>
        </Box>
      </form>
    </>
  )
}

export default MyProfilePage
