import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUploadMenuBoardMutation } from '@/entities/menu-board/api'
import { ramenyaQueryKeys } from '@/entities/ramenya/api'
import { useImageUpload } from '@/shared/lib/useImageUpload'
import { useToast } from '@/shared/ui/toast'
import { useQueryClient } from '@tanstack/react-query'

const MAX_MENU_BOARD_IMAGES = 5
const MAX_DESCRIPTION_LENGTH = 50

export const useMenuBoardSubmitPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const [selectedImages, setSelectedImages] = useState<(File | string)[]>([])
  const [description, setDescription] = useState('')
  const uploadMenuBoardMutation = useUploadMenuBoardMutation({
    onSuccess: () => {
      openToast('메뉴판 등록 성공')
      queryClient.invalidateQueries({ queryKey: ramenyaQueryKeys.detail(id) })
      navigate(-1)
    },
    onError: () => {
      openToast('메뉴판 등록에 실패했습니다.', undefined, 'error')
    },
  })
  const { fileInputRef, isUploading: isImageUploading, handleImageClick, handleImageUpload, handleRemoveImage } =
    useImageUpload({
      images: selectedImages,
      maxImages: MAX_MENU_BOARD_IMAGES,
      onImagesChange: setSelectedImages,
      onLimitExceeded: (maxImages) => openToast(`이미지는 최대 ${maxImages}개까지 업로드 가능합니다.`),
      onUploadError: () => openToast('이미지 변환에 실패했습니다. 다른 이미지를 선택해주세요.', undefined, 'error'),
    })

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(event.target.value)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!id) {
      openToast('메뉴판 등록에 실패했습니다.', undefined, 'error')
      return
    }

    uploadMenuBoardMutation.mutate({
      ramenyaId: id,
      description,
      menuBoardImages: selectedImages.filter((image): image is File => image instanceof File),
    })
  }

  return {
    selectedImages,
    description,
    fileInputRef,
    isImageUploading,
    isSubmitting: uploadMenuBoardMutation.isPending,
    isSubmitDisabled: selectedImages.length === 0 || description.length === 0 || uploadMenuBoardMutation.isPending,
    maxImages: MAX_MENU_BOARD_IMAGES,
    maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
    handleDescriptionChange,
    handleImageClick,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
  }
}
