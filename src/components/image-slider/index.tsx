import React, { useState, useEffect } from 'react'
import { Box, IconButton } from '@mui/material'
import IconifyIcon from '../Icon'
import Image from 'next/image'

// ** IMAGE IMPORTS */

interface TImageSlider {
  imageList: any[]
}

const ImageSlider = (props: TImageSlider ) => {
  const { imageList } = props
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  // Xử lý nút Previous
  const handlePrev = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageList.length - 1 : prevIndex - 1))
  }

  // Xử lý nút Next
  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === imageList.length - 1 ? 0 : prevIndex + 1))
  }

  // Tự động chuyển hình ảnh sau 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 4000) // 4 giây
    
    return () => clearInterval(interval) // Cleanup
  }, []) // Chạy một lần khi component mount

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:"8px"
        // objectFit: 'cover'
        // mb: 4
      }}
    >
      {/* Container chứa hình ảnh */}
      <Box
        sx={{
          display: 'flex',
          width: `${imageList.length * 100}%`,
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 1s ease-in-out' // Hiệu ứng mượt hơn trong 1 giây
        }}
      >
        {imageList.map((img, index) => (
          <Box key={index} sx={{ flex: '0 0 100%' }}>
            <Image
              src={img}
              alt={`slide-${index}`}
              style={{ width: '100%', height:'100%', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>

      {/* Nút điều hướng bên trái */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: 10,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <IconifyIcon icon="tabler:chevrons-left" />
      </IconButton>

      {/* Nút điều hướng bên phải */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 10,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        }}
      >
        <IconifyIcon icon="tabler:chevrons-right" />
      </IconButton>
    </Box>
  )
}

export default ImageSlider
