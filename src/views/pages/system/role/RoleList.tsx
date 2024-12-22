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
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
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
import { useDispatch, useSelector } from 'react-redux'
import { changePasswordMeAsync, registerAuthAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/components/fall-back'
import { resetInitialState } from 'src/stores/role'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import { deleteRoleAsync, getAllRolesAsync, updateRoleAsync } from 'src/stores/role/actions'
import CustomDataGrid from 'src/components/custom-data-grid'
import { GridColDef, GridRowClassNameParams, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import CustomPagination from 'src/components/custom-pagination'
import IconifyIcon from 'src/components/Icon'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './component/CreateEditRole'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { deleteRole, getDetailsRole } from 'src/services/role'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/error'
import TablePermisson from './component/TablePermission'
import { PERMISSIONS } from 'src/configs/permission'
import { getAllValueOfObject, toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

type TProps = {}

type TDefaultValue = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const RoleListPage: NextPage<TProps> = () => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  // truyền thêm id vào để phân biệt nếu id ko phải chuỗi rỗng thì nghĩa là mở Modal Edit, ngược lại thì là mở Modal Create
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })

  const [openDeleteRole, setOpenDeleteRole] = useState({
    open: false,
    id: ''
  })

  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')
  const [permissonSelected, setPermissonSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: ''
  })
  const [isDisablePermisson, setIsDisablePermisson] = useState(false)

  // ** Router
  const router = useRouter()

  // check permission xem, thêm, xoá, sửa của User  trên từng trang
  const {VIEW, CREATE, UPDATE, DELETE} = usePermission("SYSTEM.ROLE", ["CREATE","VIEW","UPDATE", "DELETE"])
  console.log("permisson", {VIEW, CREATE, UPDATE, DELETE})

  const {
    roles,
    isLoading,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageCreateEdit,
    typeError,
    isSuccessDelete,
    isErrorDelete,
    messagErrorDelete
  } = useSelector((state: RootState) => state.role)
  console.log('roles', roles)

  // ** Redux
  const dispatch: AppDispatch = useDispatch() //dùng để đưa actions vào reducer xử lý

  // ** theme
  const theme = useTheme()

  // ** Translate
  const { t } = useTranslation()

  // fetch Api
  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const handleUpdateRoles = () => {
    dispatch(updateRoleAsync({ name: selectedRow.name, id: selectedRow.id, permissions: permissonSelected }))
    
    // để khi ấn vào update trên bảng permisson thì sẽ thay đổi id để useEffect thấy có id ở openCreateEdit để thông báo Cập nhật thành công
    // nếu ko có id thì sẽ thông báo Tạo nhóm vai trò thành công
    setOpenCreateEdit({
      open: false,
      id: '1'
    })
  }

  const columns: GridColDef[] = [
    {
      field: 'name', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Name'),
      flex: 1
    },
    {
      field: 'action',
      headerName: t('Actions'),
      width: 150,
      align: 'left',
      sortable: false,
      renderCell: params => {
        // console.log('params', params)
        const { row } = params
        console.log('rrrr', row)

        return (
          <Box sx={{ width: '100%' }}>
            {/* nếu role có permisson là 'ADMIN.GRANTED' hoặc 'BASIC.PUBLIC' thì hiện 2 nút chỉnh sửa và xoá */}
            {!row?.permissions?.some((per: string) => ['ADMIN.GRANTED', 'BASIC.PUBLIC']?.includes(per)) ? (
              <>
                <GridEdit
                  disabled={!UPDATE}
                  onClick={() =>
                    setOpenCreateEdit({
                      open: true,
                      id: String(row._id)
                    })
                  }
                />
                <GridDelete
                  disabled={!DELETE}
                  onClick={() =>
                    setOpenDeleteRole({
                      open: true,
                      id: String(row._id)
                    })
                  }
                />
              </>
            ) : (
              <IconifyIcon icon='material-symbols-light:lock-outline' fontSize={27} />
            )}
          </Box>
        )
      }
    }
  ]

  const handleOnchangePagination = (page: number, pageSize: number) => {}


  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnchangePagination}
        pageSizeOptions={PAGE_SIZE_OPTION}
        page={page}
        pageSize={pageSize}
        rowLength={roles.total}
      />
    )
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleSort = (sort: GridSortModel) => {
    console.log('check', sort)
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`) // đtặ lại sortBy = "name asc" hoặc "name desc"
    // sắp xếp theo field với thuộc tính sort là ...
  }

  const handleConfirmCloseDelete = () => {
    setOpenDeleteRole({
      open: false,
      id: ''
    })
  }
  const handleDeleteRole = () => {
    dispatch(deleteRoleAsync(openDeleteRole.id))
  }

  const handleGetDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailsRole(id)
      .then(res => {
        if (res?.data) {
          if (res?.data?.permissions.includes(PERMISSIONS.ADMIN)) {
            setPermissonSelected(getAllValueOfObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
            setIsDisablePermisson(true)
          } else if (res?.data?.permissions.includes(PERMISSIONS.BASIC)) {
            setPermissonSelected((PERMISSIONS as any)?.DASHBOARD)
            setIsDisablePermisson(true)
          } else {
            setPermissonSelected(res?.data?.permissions || [])
            setIsDisablePermisson(false)
          }
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleGetListRoles()
  }, [sortBy, searchBy])

  // xử lý thông báo khi tạo hoặc update thành công, thất bại
  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_role_success'))
      } else {
        toast.success(t('Update_role_success'))
      }
      // toast.success(t(messageCreateEdit))
      handleGetListRoles()
      dispatch(resetInitialState())
      handleCloseCreateEdit()
    } else if (isErrorCreateEdit && typeError) {
      //nêu sko thành công
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        //nếu thao tác sai để trả về typeError  vd = "ALREADY_EXIST" hoặc INTERNAL_SERVER_ERROR
        toast.error(t(errorConfig))
      } else {
        // nếu bị lỗi nhưng trả  về typeError ko nằm trong khai báo
        if (openCreateEdit.id) {
          toast.error(t('Update_role_error'))
        } else {
          toast.error(t('Create_role_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit, typeError])

  // xử lý khi Delete thành công, thất bại
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_role_success'))
      handleGetListRoles()
      dispatch(resetInitialState())
      handleConfirmCloseDelete()
    } else if (isErrorDelete) {
      // toast.error(t(messagErrorDelete))
      toast.success(t('Delete_role_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messagErrorDelete])

  useEffect(() => {
    // console.log("selectedRow", selectedRow)
    if (selectedRow.id) {
      handleGetDetailsRole(selectedRow.id)
    }
  }, [selectedRow.id])

  console.log('openCE', openCreateEdit)

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteRole.open}
        handleClose={handleConfirmCloseDelete}
        handleCancel={handleConfirmCloseDelete}
        handleConfirm={handleDeleteRole}
        title={t('title_delete_role')}
        description={t('confirm_delete_role')}
      />
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%',
          borderRadius:'15px'
        }}
      >
        <Grid container sx={{ height: '100%', width: '100%' }}>
          <Grid item md={4} xs={12} sx={{ maxHeight: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <GridCreate
                disabled={!CREATE}
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }
              />
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChangeSearch={(value: string) => setSearchBy(value)} />
              </Box>
            </Box>
            <Box sx={{ height: `calc(100% - 47px)` }}>
              <CustomDataGrid
                rows={roles.data}
                columns={columns}
                getRowId={row => row._id}
                checkboxSelection={false} // ẩn đi checkbox
                disableRowSelectionOnClick
                autoHeight
                disableColumnMenu //ẩn tuỳ chọn menu ở các cột
                hideFooter //ẩn thanh paginate
                slots={{
                  pagination: PaginationComponent //custom lại thanh pagination
                }}
                pageSizeOptions={[5]}
                //cài đặt sort
                sortingMode='server' // đặt sắp xếp theo phía server, mặc định sẽ là client
                onSortModelChange={handleSort}
                sortingOrder={['asc', 'desc']} // quy định những lựa chọn cho sorting

                //thêm class  "selected-row" vào dòng được click vào => có id = selectedRow.id  để css cho nó nổi lên
                getRowClassName={(params: GridRowClassNameParams) =>{
                  // console.log("GridRowClassNameParams", params)
                  const {row} = params

                  return row._id === selectedRow.id ? "selected-row": ""
                }}
                sx={{
                  cursor:"pointer",
                  ".selected-row":{
                    backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important `,
                    color: `${theme.palette.primary.main} !important `,
                    fontWeight: 600
                  }
                }}
                onRowClick={row => {
                  console.log('roww', { row })
                  setSelectedRow({ id: String(row.id), name: row?.row?.name }) //cập nhật selectedRow = id đã click
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            md={8}
            xs={12}
            sx={{ maxHeight: '100%' }}
            paddingLeft={{ md: '40px', xs: '0' }}
            paddingTop={{ md: '0px', xs: '20px' }}
          >
            {selectedRow?.id && (
              <>
                <Box sx={{ height: 'calc(100% - 40px)' }}>
                  <TablePermisson
                    permissonSelected={permissonSelected}
                    setPermissonSelected={setPermissonSelected}
                    isDisablePermisson={isDisablePermisson}
                  />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleUpdateRoles}
                    disabled={isDisablePermisson}
                  >
                    {t('Update')}
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
