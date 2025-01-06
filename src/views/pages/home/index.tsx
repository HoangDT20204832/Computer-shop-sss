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
import InputSearch from 'src/components/input-search'
import NoData from 'src/components/no-data'

// ** Config
import { PAGE_SIZE_OPTION2 } from 'src/configs/gridConfig'

// ** Services
import { getAllProductTypes } from 'src/services/product-type'
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
import ImageSlider from 'src/components/image-slider'
import { useRouter } from 'next/router'
import CardSkeleton from '../product/components/CardSkeleton'
import CustomSelect from 'src/components/custom-select'
import ImageSearchBar from 'src/components/image-upload'

import Slider1 from '/public/images/slide3.png'
import Slider2 from '/public/images/slider1.png'
import Slider3 from '/public/images/slider2.png'
import Slider4 from '/public/images/slide2.png'
import Slider5 from '/public/images/slider4.jpg'
import Slider6 from '/public/images/slider10.jpg'
import Image from 'next/image'

import ChatBotAI from 'src/components/chat-bot'

// Danh sách hình ảnh

const imageList: any[] = [Slider1, Slider2, Slider3, Slider4]


interface TOptions {
  label: string
  value: string
  id: string

}


type TProps = {
  products: TProduct[],
  totalCount: number
  productTypesServer: TOptions[]
  paramsServer: {
    limit: number
    page: number
    order: string
    // productType: string
  }
}

interface TProductPublicState {
  data: TProduct[],
  total: number,
}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))

const HomePage: NextPage<TProps> = (props) => {

    // ** Props
    const {products, totalCount,  paramsServer, productTypesServer} = props

  // ** Translate
  const { t } = useTranslation()

  // State
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [productTypeSelected, setProductTypeSelected] = useState('')
  const [reviewSelected, setReviewSelected] = useState('')
  const [locationSelected, setLocationSelected] = useState('')

  const router = useRouter()

  // const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION2[0])
  const [page, setPage] = useState(1)
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string, id: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [loading, setLoading] = useState(false)
  const [productsPublic, setProductsPublic] = useState<TProductPublicState>({
    data: [],
    total: 0
  })
  const [category, setCategory] = useState<string>(''); // State để quản lý category
  const [productTypeId, setProductTypeId] = useState<string>('');
  const [nameProductType, setNameProductType] = useState<string>('');
  const [dataProductType, setDataProductType] = useState<any[]>([]);
  const firstRender = useRef<boolean>(false)
  const isServerRendered = useRef<boolean>(false) // lần render đầu tiên thì cho server trả về dl; còn các thao tác sau thì để client xử lý

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
  const categoriesWithImages = optionTypes.map((category) => {
    let bgColor = '';
    let imageUrl = '';
    switch (category.value) {
      case 'accessory':
        bgColor = '#B39DDB'; // Màu tím nhạt
        imageUrl = '/images/bg4.png';
        break;
      case 'monitor':
        bgColor = '#FFCC80'; // Màu cam nhạt
        imageUrl = '/images/bg3.png';
        break;
      case 'pc':
        bgColor = '#EC556C'; // Màu đỏ nhạt
        imageUrl = '/images/bg2.png';
        break;
      case 'laptop':
        bgColor = '#A5D6A7'; // Màu xanh lá nhạt
        imageUrl = '/images/background1.png';
        break;

      default:
        bgColor = '#E0E0E0'; // Màu xám nhạt
        imageUrl = '/images/default.png';
    }

    return { ...category, bgColor, image: imageUrl };
  });



  // fetch api
  const handleGetListProducts = async () => {
    setLoading(true)
    const query = {
      params: {
        limit: pageSize, page: page, search: searchBy, order: sortBy, productType: productTypeId
      }
    }
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

  const handleOnchangePagination = (page: number, pageSize: number) => {
    if(!firstRender.current) {
      firstRender.current = true
    }
    setPage(page)
    setPageSize(pageSize)
  }

  console.log("optionTypes", optionTypes)

  const handleChange = (newValue: string) => {
    // setProductTypeSelected(newValue)
    // Tìm ID của loại sản phẩm dựa trên `newValue`()(slug)
    const selectedType = optionTypes.find((type) => type.value === newValue);

    // if (selectedType) {
    // Điều hướng tới đường dẫn `/product-type/[label]` và kèm ID dưới dạng query
    router.push({
      pathname: `/product-type/${newValue}`, // Đường dẫn chính
      // query: { id: selectedType.id },    // Gửi kèm ID qua query
    });
    // }
  }


  useEffect(()=>{
      if(productTypesServer){
        setDataProductType(productTypesServer)
      }
  },[productTypesServer])
  console.log("types", dataProductType)

  // ** fetch api
  // const fetchAllTypes = async () => {
  //   setLoading(true)
  //   await getAllProductTypes({ params: { limit: -1, page: -1 } })
  //     .then(res => {
  //       const data = res?.data.productTypes
  //       console.log("hmmm", data)
  //       setDataProductType(data)
  //       if (data) {
  //         setOptionTypes(data?.map((item: { name: string; slug: string, _id: string }) => ({ label: item.name, value: item.slug, id: item._id })))
  //         // setProductTypeSelected(data?.[0]?._id)
  //         // firstRender.current = true
  //       }
  //       setLoading(false)
  //     })
  //     .catch(e => {
  //       setLoading(false)
  //     })
  // }


  useEffect(() => {
    // fetchAllTypes()   
    // fetchAllCities()
    // handleGetListProducts()

  }, [])

  useEffect(() => {
    if(category){
    const selectedType = dataProductType.find((item) => item.value === category)
    console.log("seee", selectedType)
    setProductTypeId(selectedType?.id)
    setNameProductType(selectedType?.label)
    if(!firstRender.current) {
      firstRender.current = true
    }
    }


  }, [category])

  console.log("mmm", productTypeId)

  useEffect(() => {
    if (!isServerRendered.current && paramsServer && totalCount && !!products.length && !!productTypesServer.length) {
      setPage(paramsServer.page)
      setPageSize(paramsServer.limit)
      setSortBy(paramsServer.order)
      // if(paramsServer.productType) {
      //   setProductTypeSelected(paramsServer.productType)
      // }
      setProductsPublic({
        data: products,
        total: totalCount
      })
      setOptionTypes(productTypesServer)
      isServerRendered.current = true
    }
  }, [paramsServer, products, totalCount, productTypesServer])


  useEffect(() => {
    if (isServerRendered.current && firstRender.current) {

    handleGetListProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize, productTypeId])

  // useEffect(() => {
  //   if (firstRender.current) {
  //     setFilterBy({ productType: productTypeSelected, minStar: reviewSelected, productLocation: locationSelected })
  //   }
  // }, [productTypeSelected, reviewSelected, locationSelected])

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
      <ChatBotAI />
      <Box
        sx={{
          height: '100%',
          width: '100%'
        }}
      >
        <Box>
          <Grid container spacing={1.5}>
            <Grid item md={8} xs={12}>
              <Box sx={{ height: '350px' }}>
                <ImageSlider
                  imageList={imageList}
                />
              </Box>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
              sx={{
                display: { xs: 'none', md: 'block' },
                height: '100%'
              }}
            >
              {/* Ảnh nhỏ thứ nhất */}
              <Box sx={{ flex: 1, height: '172px', overflow: 'hidden', borderRadius: "8px" }}>
                <Image src={Slider6} alt={`slide-5`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>

              {/* Ảnh nhỏ thứ hai */}
              <Box sx={{ flex: 1, height: '172px', overflow: 'hidden', mt: 1.5, borderRadius: "8px" }}>
                <Image src={Slider5} alt={`slide-5`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Grid>
          </Grid>
        </Box>


        {/* <StyledTabs value={productTypeSelected} onChange={handleChange} aria-label='wrapped label tabs example'>
          {optionTypes.map(opt => {
            return <Tab key={opt.value} value={opt.value} label={t(opt.label)} />
          })}
        </StyledTabs> */}
        <Box sx={{display:"flex", flexDirection:"column",alignItems:"center", gap:1, mt:3,
        }}>
          <Typography fontWeight={600} color={theme.palette.primary.main} variant="h4">{t("Category")}</Typography>

          <Box
          sx={{
            display: 'flex',
            gap: 5, // Khoảng cách giữa các ô
            justifyContent: 'center', // Căn giữa toàn bộ hàng
            alignItems: 'center',
            padding: 2,
            overflowX: 'auto', // Cuộn ngang nếu không đủ không gian
          }}
        >
          {categoriesWithImages.map((category) => (
            <Box onClick={()=>handleChange(category.value)}
              key={category.id}
              sx={{
                width: 140,
                height: 140,
                borderRadius: 2,
                position: 'relative',
                backgroundColor: category.bgColor, // Màu nền
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 2,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              {/* Label */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#000',
                  zIndex: 2,
                }}
              >
                {t(category.label)}
              </Typography>
              {/* Hình ảnh */}
              <img
                src={category.image}
                alt={t(category.label)}
                style={{
                  width: '90%', // Để hình ảnh không lấn ra ngoài
                  height: '90%',
                  objectFit: 'contain',
                  zIndex: 1,
                }}
              />
            </Box>
          ))}
        </Box>
        </Box>
     


        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Component tìm kiếm bằng ảnh */}
          <ImageSearchBar setCategory={setCategory} />

          {/* Hiển thị category */}
          {category && (
            <Box sx={{ margin: '10px auto 0px', textAlign: "center", display: "flex", alignItems: "center" }}>
              <Typography fontSize={20} fontWeight={700} >{t('Product_Type')}:</Typography>
              <Typography fontSize={20} fontWeight={700} sx={{ color: theme.palette.primary.main }}>{t(nameProductType) || t('Unknown')}</Typography>
            </Box>
          )}

        </Box>

        <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
          <Box sx={{ width: '300px' }}>
            <CustomSelect
              fullWidth
              onChange={(e) => {
                if(!firstRender.current) {
                  firstRender.current = true
                }
                setSortBy(e.target.value as string)
                
              }}
              value={sortBy}
              options={[
                {
                  label: t("Sort_best_sold"),
                  value: "sold desc"
                },
                {
                  label: t("Sort_new_create"),
                  value: "createdAt desc"
                },
                // {
                //   label: t("Sort_high_view"),
                //   value: "views desc"
                // },
                {
                  label: t("Sort_high_like"),
                  value: "totalLikes desc"
                }
              ]}
              placeholder={t('Sort_by')}
            />
          </Box>
          <Box sx={{ width: '300px' }}>
            <InputSearch
              placeholder={t('Search_name_product')}
              value={searchBy}
              onChangeSearch={(value: string) => {
                if(value !==""){
                  console.log("chayvao")
                  if(!firstRender.current) {
                    firstRender.current = true
                  }
                }
                setSearchBy(value)
              }}
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
            {/* <Grid item md={3} display={{ md: 'flex', xs: 'none' }}>
              <Box sx={{ width: '100%' }}>
                <FilterProduct
                  locationSelected={locationSelected}
                  reviewSelected={reviewSelected}
                  handleReset={handleResetFilter}
                  optionCities={optionCities}
                  handleFilterProduct={handleFilterProduct}
                />
              </Box>
            </Grid> */}
            <Grid item md={12} xs={12}>
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
                      <Grid item key={index} md={3} sm={6} xs={12}>
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
                          <Grid item key={item._id} md={3} sm={6} xs={12}>
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
          pageSizeOptions={PAGE_SIZE_OPTION2}
          pageSize={pageSize}
          page={page}
          rowLength={productsPublic.total}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default HomePage


