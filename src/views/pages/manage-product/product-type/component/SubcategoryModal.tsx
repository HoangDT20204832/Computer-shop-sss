import React, { useState, useEffect, useRef } from 'react'
import { Modal, Box, Button, Typography, List, ListItem, ListItemText, IconButton, TextField } from '@mui/material'
// import { Delete, Edit, Close } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { getSubcategoriesAsync, addSubcategoriesAsync, deleteSubcategoryAsync, updateSubcategoryAsync } from 'src/stores/subcategory/actions'
import { AppDispatch, RootState } from 'src/stores'
import IconifyIcon from 'src/components/Icon'

interface SubcategoryModalProps {
  open: boolean
  onClose: () => void
  productTypeId: string
  productTypeName: string
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({ open, onClose, productTypeId, productTypeName }) => {
  const dispatch:AppDispatch = useDispatch()
  const { subcategories, loading } = useSelector((state: RootState) => state.subcategory)
  const [isEditing, setIsEditing] = useState(false)
  const [subcategoryInput, setSubcategoryInput] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null) // Ref để điều khiển focus

  useEffect(() => {
    if (open) {
      dispatch(getSubcategoriesAsync({ productTypeId }))
    }
  }, [open, dispatch, productTypeId])

  const handleAddOrUpdate = () => {
    if (isEditing && selectedSubcategory) {
      dispatch(
        updateSubcategoryAsync({
          productTypeId,
          oldSubcategory: selectedSubcategory,
          newSubcategory: subcategoryInput
        })
      )
    } else {
      dispatch(addSubcategoriesAsync({ productTypeId, subcategories: [subcategoryInput] }))
    }
    setSubcategoryInput('')
    setIsEditing(false)
    setSelectedSubcategory(null)
  }

  const handleEdit = (subcategory: string) => {
    setIsEditing(true)
    setSelectedSubcategory(subcategory)
    setSubcategoryInput(subcategory)
    setTimeout(() => inputRef.current?.focus(), 0) // Tự động focus sau khi set state
  }

  const handleDelete = (subcategory: string) => {
    dispatch(deleteSubcategoryAsync({ productTypeId, subcategory }))
  }

  const getBackgroundColor = (subcategory: string) => {
    return selectedSubcategory === subcategory ? '#f0f0f0' : 'transparent'
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 500, margin: '100px auto', padding: 4, backgroundColor: 'white', borderRadius: 2, position: 'relative' }}>
        {/* Nút đóng ở góc trên bên phải */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          X 
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Quản lý Subcategory cho loại sản phẩm: {productTypeName}
        </Typography>
        <List>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            subcategories.map(subcategory => (
              <ListItem
                key={subcategory}
                sx={{
                  backgroundColor: getBackgroundColor(subcategory),
                  borderRadius: '4px'
                }}
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleEdit(subcategory)}>
                    <IconifyIcon icon='tabler:edit' />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(subcategory)}>
                    <IconifyIcon icon='mdi:delete-outline' />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={subcategory} />
              </ListItem>
            ))
          )}
        </List>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            value={subcategoryInput}
            onChange={e => setSubcategoryInput(e.target.value)}
            placeholder="Nhập tên subcategory"
            inputRef={inputRef} // Liên kết Ref với ô nhập
          />
          <Button variant="contained" onClick={handleAddOrUpdate}>
            {isEditing ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default SubcategoryModal
