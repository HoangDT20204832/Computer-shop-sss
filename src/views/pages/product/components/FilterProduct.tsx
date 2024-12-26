import * as React from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { styled, useTheme } from '@mui/material/styles'
import {
  Box,
  BoxProps,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Button,
  TextFieldProps
} from '@mui/material'

// ** Config
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'
import Icon from 'src/components/Icon'

interface TFilterProduct {
  handleFilterProduct: (value: string, type: string) => void
  optionCities: { label: string; value: string }[]
  locationSelected: string
  reviewSelected: string
  handleReset: () => void
  minPriceSelected: string
  maxPriceSelected: string
  setMinPriceSelected: React.Dispatch<React.SetStateAction<string>>
  setMaxPriceSelected: React.Dispatch<React.SetStateAction<string>>
}

const StyleFilterProduct = styled(Box)<BoxProps>(({ theme }) => ({
  padding: '10px',
  border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
  borderRadius: '15px',
  backgroundColor: theme.palette.background.paper
}))

const StyleTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    '.MuiInputBase-root': {
         height:"40px"
    }
}))

const FilterProduct = (props: TFilterProduct) => {
  // ** Props
  const {
    handleFilterProduct,
    optionCities,
    reviewSelected,
    locationSelected,
    handleReset,
    minPriceSelected,
    maxPriceSelected,
    setMinPriceSelected,
    setMaxPriceSelected
  } = props

  // ** State cho giá trị tạm thời
  const [tempMinPrice, setTempMinPrice] = React.useState<string>('')
  const [tempMaxPrice, setTempMaxPrice] = React.useState<string>('')

  // ** Hooks
  const { t } = useTranslation()
  const theme = useTheme()
  const listReviewProducts = FILTER_REVIEW_PRODUCT()

  const onChangeFilter = (value: string, type: string) => {
    handleFilterProduct(value, type)
  }

  const handleResetFilter = () => {
    handleReset()
    setTempMinPrice('')
    setTempMaxPrice('')
  }

  const handleSearch = () => {
    setMinPriceSelected(tempMinPrice)
    setMaxPriceSelected(tempMaxPrice)
  }

  const handleNumericInput = (value: string) => {
    // Chỉ cho phép nhập số
    return value.replace(/[^0-9]/g, '')
  }

  return (
    <StyleFilterProduct sx={{ width: '100%', padding: 4 }}>
      {/* Nút xóa bộ lọc */}
      {Boolean(reviewSelected || locationSelected || minPriceSelected || maxPriceSelected) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Tooltip title={t('Delete_filter')}>
            <IconButton onClick={handleResetFilter}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Bộ lọc theo đánh giá */}
      <Box>
        <FormControl>
          <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600 }} id='radio-group-review'>
            {t('Review')}
          </FormLabel>
          <RadioGroup
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeFilter(e.target.value, 'review')}
            aria-labelledby='radio-group-review'
            name='radio-reviews-group'
          >
            {listReviewProducts.map(review => {
              return (
                <FormControlLabel
                  key={review.value}
                  value={review.value}
                  control={<Radio checked={reviewSelected === review.value} />}
                  label={review.label}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Bộ lọc theo vị trí */}
      <Box sx={{ mt: 2 }}>
        <FormControl>
          <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600 }} id='radio-group-location'>
            {t('Location')}
          </FormLabel>
          <RadioGroup
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeFilter(e.target.value, 'location')}
            aria-labelledby='radio-group-locations'
            name='radio-locations-group'
          >
            {optionCities.map(city => {
              return (
                <FormControlLabel
                  key={city.value}
                  value={city.value}
                  control={<Radio checked={locationSelected === city.value} />}
                  label={city.label}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Bộ lọc theo giá */}
      <Box sx={{ mt: 2 }}>
        <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>{t('Price_Range')}</FormLabel>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <StyleTextField
            fullWidth
            value={tempMinPrice}
            onChange={e => setTempMinPrice(handleNumericInput(e.target.value))} // Xử lý nhập giá trị số
            placeholder={t('Min_Price')}
            InputProps={{
              inputMode: 'numeric', // Chỉ hiển thị bàn phím số trên thiết bị di động
              startAdornment: <InputAdornment position='start'>₫</InputAdornment>
            }}
          />
          <StyleTextField
            fullWidth
            value={tempMaxPrice}
            onChange={e => setTempMaxPrice(handleNumericInput(e.target.value))} // Xử lý nhập giá trị số
            placeholder={t('Max_Price')}
            InputProps={{
              inputMode: 'numeric', // Chỉ hiển thị bàn phím số trên thiết bị di động
              startAdornment: <InputAdornment position='start'>₫</InputAdornment>
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant='contained'
            onClick={handleSearch}
            sx={{ width: '100%' }}
            disabled={!tempMinPrice && !tempMaxPrice} // Chỉ kích hoạt khi có ít nhất một giá trị
          >
            {t('Apply')}
          </Button>
        </Box>
      </Box>
    </StyleFilterProduct>
  )
}

export default FilterProduct
