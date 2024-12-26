// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Grid, Typography, useTheme, Tab, Tabs, TabsProps } from '@mui/material'

// ** Redux

// ** Components
import Spinner from 'src/components/spinner'
import CustomPagination from 'src/components/custom-pagination'
import CardProduct from 'src/views/pages/product/components/CardProduct'
import FilterProduct from 'src/views/pages/product/components/FilterProduct'
import InputSearch from 'src/components/input-search'
import NoData from 'src/components/no-data'

// ** Config
import { PAGE_SIZE_OPTION3 } from 'src/configs/gridConfig'

// ** Services
import { getAllProductTypes } from 'src/services/product-type'
import { getAllCities } from 'src/services/city'
import { getAllProductsPublic } from 'src/services/product'

// ** Utils
import { formatFilter } from 'src/utils'
import { TProduct } from 'src/types/product'
import { styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/product'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import IconifyIcon from 'src/components/Icon'
import CardSkeleton from '../product/components/CardSkeleton'
import { getSubcategoriesService } from 'src/services/subcategory'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import ImageSlider from 'src/components/image-slider'
import Slider1 from '/public/images/typeP1.png'
import Slider2 from '/public/images/typeP2.png'
import Slider3 from '/public/images/typeP3.png'
import Slider4 from '/public/images/typeP7.png'
import Slider5 from '/public/images/pc2.png'
import Slider6 from '/public/images/typeP8.png'


// Danh sách hình ảnh

const imageList1: any[] = [Slider1, Slider2, Slider3]
const imageList2: any[] = [Slider4, Slider5, Slider6]


type TProps = {}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))

const ProductTypePage: NextPage<TProps> = () => {
  // ** Translate
  const { t } = useTranslation()

  // State
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  // const [productTypeSelected, setProductTypeSelected] = useState('')
  const [reviewSelected, setReviewSelected] = useState('')
  const [locationSelected, setLocationSelected] = useState('')

  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [nameProductType, setNameProductType] = useState('')
  const [productTypeIded, setproductTypeIded] = useState('')

  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION3[0])
  const [page, setPage] = useState(1)
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [loading, setLoading] = useState(false)
  const [productsPublic, setProductsPublic] = useState({
    data: [],
    total: 0
  })

  // State để lưu danh sách subcategories
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Tất cả') // Mặc định là 'Tất cả'
  const [minPriceSelected, setMinPriceSelected] = useState('')
  const [maxPriceSelected, setMaxPriceSelected] = useState('')


  const firstRender = useRef<boolean>(false)

  // ** Redux
  const {
    isSuccessLike,
    isErrorLike,
    isErrorUnLike,
    typeError,
    isSuccessUnLike,
    messageErrorLike,
    messageErrorUnLike,
    isLoading
  } = useSelector((state: RootState) => state.product)
  const dispatch: AppDispatch = useDispatch()

  // ** theme
  const theme = useTheme()

  const router = useRouter()
  // console.log("router", router)
  const productTypeSlug = router.query?.productTypeId as string
  // console.log("productTypeId", productTypeSlug)

  // fetch api

  // hàm lấy tát cả subcategory của loại sản phẩm lớn
  const handleGetSubcategories = async (productTypeId: string) => {
    try {
      const response = await getSubcategoriesService(productTypeId)
      // console.log("res", response)
      const data = response?.data
      if (data.subcategories) {
        setSubcategories(['Tất cả', ...data.subcategories]) // Thêm "Tất cả" vào đầu danh sách
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error)
      setSubcategories(['Tất cả']) // Nếu có lỗi, chỉ hiển thị "Tất cả"
    }
  }

  const handleGetListProducts = async () => {
    setLoading(true)
    const query = {
      params: {
        limit: pageSize, page: page, search: searchBy, order: sortBy, productType: productTypeIded,
        minPrice: minPriceSelected || undefined, // Thêm giá trị minPrice nếu có
        maxPrice: maxPriceSelected || undefined, // Thêm giá trị maxPrice nếu có
        subcategory: selectedSubcategory === 'Tất cả' ? '' : selectedSubcategory, // Lọc theo subcategory
        ...formatFilter(filterBy)
      }
    }
    if (productTypeIded) {
      await getAllProductsPublic(query).then(res => {
        if (res?.data) {
          setLoading(false)
          setProductsPublic({
            data: res?.data?.products,
            total: res?.data?.totalCount
          })
        }
      })
    }

  }

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleFilterProduct = (value: string, type: string) => {
    switch (type) {
      case 'review': {
        setReviewSelected(value)
        break
      }
      case 'location': {
        setLocationSelected(value)
        break
      }
    }
  }

  const handleResetFilter = () => {
    setLocationSelected('')
    setReviewSelected('')
    setMinPriceSelected('')
    setMaxPriceSelected('')
  }

  // ** fetch api
  const fetchAllTypes = async () => {
    setLoading(true)
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.productTypes
        if (data) {
          const typeProduct = data?.find((item: { name: string; slug: string, _id: string }) => item.slug === productTypeSlug)
          console.log("nameProductType", typeProduct)
          setNameProductType(typeProduct?.name)
          setproductTypeIded(typeProduct?._id)
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
    if(productTypeSlug){
      fetchAllCities()
      fetchAllTypes()
    }
  }, [productTypeSlug])



  useEffect(() => {
    if (productTypeIded) {
      handleGetSubcategories(productTypeIded)
      handleGetListProducts()
    }
  }, [productTypeIded])


  useEffect(() => {
    handleGetListProducts()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize, filterBy,minPriceSelected, maxPriceSelected])

  useEffect(() => {

    setFilterBy({ minStar: reviewSelected, productLocation: locationSelected })
  }, [reviewSelected, locationSelected])

  useEffect(() => {
    if (isSuccessLike) {
      toast.success(t('Like_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
    } else if (isErrorLike && messageErrorLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Like_product_error'))
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessLike, isErrorLike, messageErrorLike, typeError])

  useEffect(() => {
    if (isSuccessUnLike) {
      toast.success(t('Unlike_product_success'))
      dispatch(resetInitialState())
      handleGetListProducts()
    } else if (isErrorUnLike && messageErrorUnLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Unlike_product_error'))
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUnLike, isErrorUnLike, messageErrorUnLike, typeError])

  return (
    <>
      {loading && <Spinner />}
      <Box
        sx={{
          height: '100%',
          width: '100%'
        }}
      >

        <Box sx={{ display: 'flex', alignItems: "center" }}>
          <Typography color={theme.palette.primary.main}
            sx={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
            onClick={() => router.push(ROUTE_CONFIG.HOME)}
          >Trang chủ
          </Typography>
          <IconifyIcon icon="tabler:chevron-right" />
          <Typography fontSize={18} color={theme.palette.primary.main}>
            {nameProductType}
          </Typography>
        </Box>

        <Box>
          <Grid container spacing={1.5} mt={2} mb={2}>
            <Grid item md={6} xs={12} sx={{ borderRadius: "20px" }}>
              <Box sx={{ height: '100px' }}>
                <ImageSlider
                  imageList={imageList1}
                />
              </Box>
            </Grid>
            <Grid item md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' }, borderRadius: "20px" }}>
              <Box sx={{ height: '100px' }}>
                <ImageSlider
                  imageList={imageList2}
                />
              </Box>
            </Grid>

          </Grid>
        </Box>

        <Box>
          <Typography color={theme.palette.primary.main} fontSize={18} fontWeight={600}>
            {t("Choose_according_to_your_needs")}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              mt: 2,
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.3)
            }}
          >
            {subcategories.map((subcategory, index) => (
              <Typography
                key={index}
                onClick={() => {
                  setSelectedSubcategory(subcategory)
                  setFilterBy(prev => ({
                    ...prev,
                    subcategory: subcategory === 'Tất cả' ? '' : subcategory // Nếu chọn "Tất cả", không lọc
                  }))
                  setPage(1) // Reset về trang đầu
                }}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color:
                    selectedSubcategory === subcategory
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                  backgroundColor: selectedSubcategory === subcategory ? theme.palette.primary.main : 'transparent',
                  p: 2,
                  borderRadius: 4,
                  minWidth: 100,
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  fontSize: "16px"
                }}
              >
                {subcategory}
              </Typography>
            ))}
          </Box>

        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{ width: '300px' }}>
            <InputSearch
              placeholder={t('Search_name_product')}
              value={searchBy}
              onChangeSearch={(value: string) => setSearchBy(value)}
            />
          </Box>
        </Box>

        <Box
          sx={{
            height: '100%',
            width: '100%',
            mt: 4,
            mb: 8
          }}
        >
          <Grid
            container
            spacing={{
              md: 6,
              xs: 4
            }}
          >
            <Grid item md={3} display={{ md: 'flex', xs: 'none' }}>
              <Box sx={{ width: '100%' }}>
                <FilterProduct
                  locationSelected={locationSelected}
                  reviewSelected={reviewSelected}
                  handleReset={handleResetFilter}
                  optionCities={optionCities}
                  handleFilterProduct={handleFilterProduct}

                  minPriceSelected={minPriceSelected} // Truyền minPrice vào
                  maxPriceSelected={maxPriceSelected} // Truyền maxPrice vào
                  setMinPriceSelected={setMinPriceSelected} // Cập nhật minPrice
                  setMaxPriceSelected={setMaxPriceSelected} // Cập nhật maxPrice
                  // handleSearchByPrice={handleSearchByPrice} // Truyền hàm tìm kiếm

                />
              </Box>
            </Grid>
            <Grid item md={9} xs={12}>
              {loading ? (
                //Hiển thị Khung card khi đang loading
                <Grid
                  container
                  spacing={{
                    md: 6,
                    xs: 4
                  }}
                >
                  {Array.from({ length: 4 }).map((_, index) => {
                    return (
                      <Grid item key={index} md={4} sm={6} xs={12}>
                        <CardSkeleton />
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={{
                    md: 6,
                    xs: 4
                  }}
                >
                  {productsPublic?.data?.length > 0 ? (
                    <>
                      {productsPublic?.data?.map((item: TProduct) => {
                        return (
                          <Grid item key={item._id} md={4} sm={6} xs={12}>
                            <CardProduct item={item} />
                          </Grid>
                        )
                      })}
                    </>
                  ) : (
                    <Box sx={{ width: '100%', mt: 10 }}>
                      <NoData widthImage='60px' heightImage='60px' textNodata={t('No_product')} />
                    </Box>
                  )}
                </Grid>
              )}

            </Grid>
          </Grid>
        </Box>
        <CustomPagination
          onChangePagination={handleOnchangePagination}
          pageSizeOptions={PAGE_SIZE_OPTION3}
          pageSize={pageSize}
          page={page}
          rowLength={productsPublic.total}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default ProductTypePage