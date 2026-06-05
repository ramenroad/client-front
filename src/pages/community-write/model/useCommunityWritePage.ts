import { useMemo, useState, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { communityQueryKeys, useCreateCommunityBoardMutation } from '@/entities/community/api'
import {
  COMMUNITY_BOARD_CATEGORIES,
  MAX_COMMUNITY_IMAGE_COUNT,
  type CommunityBoardFilterCategory,
} from '@/entities/community/model'
import { useAuthSession } from '@/entities/session/model'
import { useImageUpload, type UploadImageValue } from '@/shared/lib/useImageUpload'
import { useToast } from '@/shared/ui/toast'

export const useCommunityWritePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isSignIn } = useAuthSession()
  const { openToast } = useToast()
  const [category, setCategory] = useState<CommunityBoardFilterCategory | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [images, setImages] = useState<UploadImageValue[]>([])
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false)
  const categoryOptions = useMemo(
    () => COMMUNITY_BOARD_CATEGORIES.filter((option): option is CommunityBoardFilterCategory => option !== '전체'),
    [],
  )

  const createBoardMutation = useCreateCommunityBoardMutation({
    onSuccess: () => {
      openToast('게시글이 등록됐어요.')
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all })
      navigate('/community')
    },
    onError: () => {
      openToast('게시글 등록에 실패했어요.')
    },
  })

  const { fileInputRef, isUploading, handleImageClick, handleImageUpload, handleRemoveImage } = useImageUpload({
    images,
    maxImages: MAX_COMMUNITY_IMAGE_COUNT,
    onImagesChange: setImages,
    onLimitExceeded: (maxImages) => openToast(`이미지는 최대 ${maxImages}장까지 올릴 수 있어요.`),
    onUploadError: () => openToast('이미지를 처리하지 못했어요. 다시 시도해주세요.'),
  })

  const trimmedTitle = title.trim()
  const trimmedBody = body.trim()
  const isSubmitDisabled = !category || trimmedTitle.length === 0 || trimmedBody.length === 0 || createBoardMutation.isPending

  const handleSubmit = () => {
    if (!isSignIn) {
      openToast('로그인 후 게시글을 작성할 수 있어요.')
      navigate('/login')
      return
    }

    if (isSubmitDisabled || !category) {
      openToast('주제, 제목, 내용을 모두 입력해주세요.')
      return
    }

    createBoardMutation.mutate({
      category,
      title: trimmedTitle,
      body: trimmedBody,
      images: images.filter((image): image is File => image instanceof File),
    })
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value)
  }

  return {
    category,
    categoryOptions,
    title,
    body,
    images,
    fileInputRef,
    isUploading,
    isSubmitDisabled,
    isSubmitting: createBoardMutation.isPending,
    isCategoryPopupOpen,
    setCategory,
    setIsCategoryPopupOpen,
    handleTitleChange,
    handleBodyChange,
    handleImageClick,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleBack: () => navigate(-1),
  }
}
