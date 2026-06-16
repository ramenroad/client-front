import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  communityQueryKeys,
  useCommunityBoardDetailQuery,
  useCreateCommunityBoardMutation,
  useUpdateCommunityBoardMutation,
} from '@/entities/community/api'
import {
  COMMUNITY_BOARD_CATEGORIES,
  MAX_COMMUNITY_IMAGE_COUNT,
  type CommunityBoardCategory,
} from '@/entities/community/model'
import { useAuthSession, useGoToLogin } from '@/entities/session/model'
import { useImageUpload, type UploadImageValue } from '@/shared/lib/useImageUpload'
import { useToast } from '@/shared/ui/toast'

export const useCommunityWritePage = () => {
  const navigate = useNavigate()
  const goToLogin = useGoToLogin()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)
  const { isSignIn } = useAuthSession()
  const { openToast } = useToast()
  const [category, setCategory] = useState<CommunityBoardCategory | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [images, setImages] = useState<UploadImageValue[]>([])
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false)
  const [isImageLimitOpen, setIsImageLimitOpen] = useState(false)
  // 유효 카테고리는 서버 검증 없이 클라이언트 하드코딩(COMMUNITY_BOARD_CATEGORIES) 기준.
  const categoryOptions = COMMUNITY_BOARD_CATEGORIES

  // 수정 모드: 기존 게시글을 불러와 폼을 1회만 prefill 한다(사용자 편집 덮어쓰기 방지).
  const boardQuery = useCommunityBoardDetailQuery(id ?? '', { enabled: isEditMode })
  const prefilledRef = useRef(false)

  useEffect(() => {
    if (!isEditMode || prefilledRef.current || !boardQuery.data) {
      return
    }
    const board = boardQuery.data
    setCategory(board.category as CommunityBoardCategory)
    setTitle(board.title)
    setBody(board.body)
    setImages(board.ImageUrls ?? [])
    prefilledRef.current = true
  }, [isEditMode, boardQuery.data])

  const createBoardMutation = useCreateCommunityBoardMutation({
    onSuccess: () => {
      openToast('게시글이 등록됐어요.')
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all })
      navigate('/community')
    },
    onError: () => {
      openToast('게시글 등록에 실패했어요.', undefined, 'error')
    },
  })

  const updateBoardMutation = useUpdateCommunityBoardMutation({
    onSuccess: () => {
      openToast('게시글을 수정했어요.')
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all })
      navigate(`/community/${id}`, { replace: true })
    },
    onError: () => {
      openToast('게시글 수정에 실패했어요.', undefined, 'error')
    },
  })

  const { fileInputRef, isUploading, handleImageClick, handleImageUpload, handleRemoveImage } = useImageUpload({
    images,
    maxImages: MAX_COMMUNITY_IMAGE_COUNT,
    onImagesChange: setImages,
    onLimitExceeded: () => setIsImageLimitOpen(true),
    onUploadError: () => openToast('이미지를 처리하지 못했어요. 다시 시도해주세요.', undefined, 'error'),
  })

  const isSubmitting = createBoardMutation.isPending || updateBoardMutation.isPending
  const trimmedTitle = title.trim()
  const trimmedBody = body.trim()
  const isSubmitDisabled = !category || trimmedTitle.length === 0 || trimmedBody.length === 0 || isSubmitting

  const handleSubmit = () => {
    if (!isSignIn) {
      openToast('로그인 후 게시글을 작성할 수 있어요.')
      goToLogin()
      return
    }

    if (isSubmitDisabled || !category) {
      openToast('주제, 제목, 내용을 모두 입력해주세요.', undefined, 'error')
      return
    }

    const newImages = images.filter((image): image is File => image instanceof File)

    if (isEditMode && id) {
      updateBoardMutation.mutate({
        boardId: id,
        data: {
          category,
          title: trimmedTitle,
          body: trimmedBody,
          // 남겨둔 기존 이미지(url)는 유지하고, 새로 추가한 파일만 업로드한다.
          imageUrls: images.filter((image): image is string => typeof image === 'string'),
          images: newImages,
        },
      })
      return
    }

    createBoardMutation.mutate({
      category,
      title: trimmedTitle,
      body: trimmedBody,
      images: newImages,
    })
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value)
  }

  return {
    isEditMode,
    category,
    categoryOptions,
    title,
    body,
    images,
    fileInputRef,
    isUploading,
    isSubmitDisabled,
    isSubmitting,
    isCategoryPopupOpen,
    isImageLimitOpen,
    setCategory,
    setIsCategoryPopupOpen,
    setIsImageLimitOpen,
    handleTitleChange,
    handleBodyChange,
    handleImageClick,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleBack: () => navigate(-1),
  }
}
