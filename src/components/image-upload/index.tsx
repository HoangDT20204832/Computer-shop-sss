
import React, { useState } from 'react';
import { API_ENDPOINT } from 'src/configs/api';
import IconifyIcon from '../Icon';
import { Typography, useTheme,alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ImageSearchBarProps = {
  setCategory: (category: string) => void; // Truyền hàm để cập nhật category ở Home
};

const ImageSearchBar: React.FC<ImageSearchBarProps> = ({ setCategory }) => {
  const [image, setImage] = useState<string | null>(null);

  // Xử lý khi chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImage(base64Image); // Hiển thị ảnh đã upload
        classifyImage(base64Image); // Gửi ảnh đi phân loại
      };
      reader.readAsDataURL(file);
    }
  };

  // Gửi ảnh đến backend để phân loại
  const classifyImage = async (base64Image: string) => {
    try {
      const response = await fetch(API_ENDPOINT.SEARCH_IMAGE.INDEX, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image.split(',')[1] }),
      });

      const data = await response.json();
      setCategory(data.category); // Cập nhật category ở trang Home
    } catch (error) {
      console.error('Lỗi phân loại hình ảnh:', error);
    }
  };

  // Xóa ảnh và reset category
  const handleRemoveImage = () => {
    setImage(null); // Xóa ảnh
    setCategory(''); // Reset category
  };
  const {t} = useTranslation()
  const theme = useTheme()

  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ccc',
          borderRadius: '25px',
          padding: '10px 20px',
          width: '350px',
          margin: '10px auto',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="upload-image"
        />
        <label htmlFor="upload-image" style={{ cursor: 'pointer', paddingRight: '5px',
        marginRight:"5px",
        display:"flex", alignItems:"center",
        borderRight: '1px solid'
            // backgroundColor:theme.palette.primary.main
         }}>
           <IconifyIcon icon ="noto-v1:camera"/>
           <Typography variant='h6' sx={{ cursor: 'pointer' }}>
                            {t("Upload")}
                        </Typography>
          {/* <img
            src="/camera-icon.png" // Icon camera (thay thế bằng icon của bạn)
            alt="Upload"
            style={{ width: '24px', height: '24px' }}
          /> */}
        </label>
        <input
          type="text"
          placeholder="Tải lên ảnh để tìm kiếm..."
          readOnly
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            cursor: 'default',
            backgroundColor: theme.palette.background.default
            // backgroundColor: alpha(theme.palette.common.white, 0.15),
          }}
        />
      </div>

      {/* Hiển thị ảnh đã upload */}
      <div style={{ position: 'relative', marginTop: '20px', textAlign: 'center' }}>
        {image && (
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <img
              src={image}
              alt="Uploaded"
              style={{
                width: '300px',
                height: '200px',
                borderRadius: '15px',
                objectFit: 'cover',
                border: '1px solid #ccc',
              }}
            />
            {/* Dấu X để xóa ảnh */}
            <button
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
              }}
            >
              X
            </button>
          </div>
        ) }
      </div>
    </div>
  );
};

export default ImageSearchBar;

