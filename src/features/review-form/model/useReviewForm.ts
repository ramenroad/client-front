import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useRamenyaDetailQuery, ramenyaQueryKeys } from '@/entities/ramenya/api'
import {
  reviewQueryKeys,
  useCreateReviewMutation,
  useReviewDetailQuery,
  useUpdateReviewMutation,
} from '@/entities/review/api'
import { useAuthSession } from '@/entities/session/model'
import { useImageUpload } from '@/shared/lib/useImageUpload'
import { useToast } from '@/shared/ui/toast'
import { MAX_REVIEW_IMAGES, MIN_REVIEW_LENGTH, REVIEW_FORM_COPY } from './constants'
import type { ReviewFormImage, ReviewFormMode, ReviewFormValues } from './types'
import {
  EMPTY_REVIEW_FORM,
  areReviewImagesEqual,
  getCreateDirtyBaseline,
  getCreateReviewFormValues,
  getEditReviewFormValues,
  getMenuList,
  getSelectedMenus,
} from './utils'

type UseReviewFormOptions = {
  mode: ReviewFormMode
}

type ReviewFormDraft = {
  key: string
  values: ReviewFormValues
}

const isUploadFile = (image: ReviewFormImage): image is File => image instanceof File

const isExistingImageUrl = (image: ReviewFormImage): image is string => typeof image === 'string'

const isReviewFormValid = ({ rating, menus, review }: Pick<ReviewFormValues, 'rating' | 'menus' | 'review'>) => {
  return rating > 0 && getSelectedMenus(menus).length > 0 && review.trim().length >= MIN_REVIEW_LENGTH
}

export const useReviewForm = ({ mode }: UseReviewFormOptions) => {
  const isEditMode = mode === 'edit'
  const { id: routeId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const authSession = useAuthSession()
  const { openToast } = useToast()
  const initialRatingValue = Number.parseFloat(searchParams.get('rating') ?? '0')
  const initialRating = Number.isNaN(initialRatingValue) ? 0 : initialRatingValue
  const pageCopy = REVIEW_FORM_COPY[mode]

  const [draftForm, setDraftForm] = useState<ReviewFormDraft | null>(null)
  const [customMenuInput, setCustomMenuInput] = useState('')
  const [isBackModalOpen, setIsBackModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const ramenyaDetailQuery = useRamenyaDetailQuery(isEditMode ? '' : routeId)
  const reviewDetailQuery = useReviewDetailQuery(isEditMode ? routeId : '')
  const createReviewMutation = useCreateReviewMutation()
  const updateReviewMutation = useUpdateReviewMutation()

  const createDefaultValues = useMemo(
    () => getCreateReviewFormValues(routeId, initialRating),
    [initialRating, routeId],
  )
  const editDefaultValues = useMemo(
    () => getEditReviewFormValues(reviewDetailQuery.data),
    [reviewDetailQuery.data],
  )
  const defaultValues = useMemo(
    () => (isEditMode ? editDefaultValues ?? EMPTY_REVIEW_FORM : createDefaultValues),
    [createDefaultValues, editDefaultValues, isEditMode],
  )
  const formKey = isEditMode
    ? `edit:${routeId}:${editDefaultValues ? 'loaded' : 'loading'}`
    : `create:${routeId}:${initialRating}`
  const values = draftForm?.key === formKey ? draftForm.values : defaultValues
  const dirtyBaseline = useMemo(
    () => (isEditMode ? editDefaultValues : getCreateDirtyBaseline(routeId)),
    [editDefaultValues, isEditMode, routeId],
  )
  const currentReviewImages = useMemo(() => values.reviewImages ?? [], [values.reviewImages])
  const selectedMenus = useMemo(() => getSelectedMenus(values.menus), [values.menus])
  const sourceMenus = isEditMode ? reviewDetailQuery.data?.menus : ramenyaDetailQuery.data?.menus
  const menuList = useMemo(() => getMenuList(sourceMenus, selectedMenus), [selectedMenus, sourceMenus])
  const isFormValid = useMemo(() => isReviewFormValid(values), [values])
  const isFormDirty = useMemo(() => {
    if (!dirtyBaseline) {
      return false
    }

    return (
      dirtyBaseline.ramenyaId !== values.ramenyaId ||
      dirtyBaseline.rating !== values.rating ||
      dirtyBaseline.review !== values.review ||
      dirtyBaseline.menus !== values.menus ||
      !areReviewImagesEqual(dirtyBaseline.reviewImages, currentReviewImages)
    )
  }, [currentReviewImages, dirtyBaseline, values])

  const updateValues = useCallback(
    (updater: (prev: ReviewFormValues) => ReviewFormValues) => {
      setDraftForm((prev) => {
        const baseValues = prev?.key === formKey ? prev.values : defaultValues

        return {
          key: formKey,
          values: updater(baseValues),
        }
      })
    },
    [defaultValues, formKey],
  )

  const handleReviewImagesChange = useCallback(
    (images: ReviewFormImage[]) => {
      updateValues((prev) => ({ ...prev, reviewImages: images }))
    },
    [updateValues],
  )

  const { fileInputRef, isUploading: isImageUploading, handleImageClick, handleImageUpload, handleRemoveImage } =
    useImageUpload({
      images: currentReviewImages,
      maxImages: MAX_REVIEW_IMAGES,
      onImagesChange: handleReviewImagesChange,
      onLimitExceeded: (maxImages) => openToast(`이미지는 최대 ${maxImages}개까지 업로드 가능합니다.`),
      onUploadError: () => openToast('이미지 변환에 실패했습니다. 다른 이미지를 선택해주세요.'),
    })

  const invalidateReviewQueries = useCallback(
    (ramenyaId: string, reviewId?: string) => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ramenyaQueryKeys.detail(ramenyaId) })

      if (reviewId) {
        queryClient.invalidateQueries({ queryKey: reviewQueryKeys.detail(reviewId) })
      }
    },
    [queryClient],
  )

  const handleStarClick = useCallback(
    (starIndex: number, isHalf = false) => {
      const rating = isHalf ? starIndex - 0.5 : starIndex
      updateValues((prev) => ({ ...prev, rating }))
    },
    [updateValues],
  )

  const handleMenuClick = useCallback(
    (menu: string) => {
      const nextSelectedMenus = selectedMenus.includes(menu)
        ? selectedMenus.filter((item) => item !== menu)
        : selectedMenus.length >= 2
          ? selectedMenus
          : [...selectedMenus, menu]

      updateValues((prev) => ({ ...prev, menus: nextSelectedMenus.join(',') }))
    },
    [selectedMenus, updateValues],
  )

  const handleCustomMenuInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCustomMenuInput(event.target.value)
  }, [])

  const handleAddCustomMenu = useCallback(() => {
    const trimmedMenu = customMenuInput.trim()

    if (!trimmedMenu) {
      return
    }

    const nextSelectedMenus =
      selectedMenus.includes(trimmedMenu) || selectedMenus.length >= 2 ? selectedMenus : [...selectedMenus, trimmedMenu]

    updateValues((prev) => ({ ...prev, menus: nextSelectedMenus.join(',') }))
    setCustomMenuInput('')
  }, [customMenuInput, selectedMenus, updateValues])

  const handleCustomMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        event.preventDefault()
        handleAddCustomMenu()
      }
    },
    [handleAddCustomMenu],
  )

  const handleReviewChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      updateValues((prev) => ({ ...prev, review: event.target.value }))
    },
    [updateValues],
  )

  const closeBackModal = useCallback(() => {
    setIsBackModalOpen(false)
  }, [])

  const handleBackClick = useCallback(() => {
    if (isFormDirty) {
      setIsBackModalOpen(true)
      return
    }

    navigate(-1)
  }, [isFormDirty, navigate])

  const handleConfirmBack = useCallback(() => {
    setIsBackModalOpen(false)
    navigate(-1)
  }, [navigate])

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false)
  }, [])

  const handleLoginConfirm = useCallback(() => {
    setIsLoginModalOpen(false)
    navigate('/login')
  }, [navigate])

  const handleSubmitReview = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setHasSubmitted(true)

      if (!isFormValid) {
        return
      }

      if (!authSession.isSignIn) {
        setIsLoginModalOpen(true)
        return
      }

      try {
        if (isEditMode) {
          await updateReviewMutation.mutateAsync({
            reviewId: routeId,
            data: {
              rating: values.rating,
              review: values.review,
              menus: values.menus,
              reviewImageUrls: values.reviewImages.filter(isExistingImageUrl),
              reviewImages: values.reviewImages.filter(isUploadFile),
            },
          })
          invalidateReviewQueries(values.ramenyaId, routeId)
        } else {
          await createReviewMutation.mutateAsync({
            ramenyaId: values.ramenyaId,
            rating: values.rating,
            review: values.review,
            menus: values.menus,
            reviewImages: values.reviewImages.filter(isUploadFile),
          })
          invalidateReviewQueries(values.ramenyaId)
        }

        openToast(pageCopy.successToast)
        navigate(-1)
      } catch (error) {
        console.error(isEditMode ? '리뷰 수정 중 에러 발생:' : '리뷰 등록 중 에러 발생:', error)
        openToast(pageCopy.errorToast)
      }
    },
    [
      authSession.isSignIn,
      createReviewMutation,
      invalidateReviewQueries,
      isEditMode,
      isFormValid,
      navigate,
      openToast,
      pageCopy.errorToast,
      pageCopy.successToast,
      routeId,
      updateReviewMutation,
      values,
    ],
  )

  useEffect(() => {
    if (!routeId) {
      navigate(-1)
    }
  }, [navigate, routeId])

  useEffect(() => {
    if (isEditMode) {
      if (reviewDetailQuery.isError) {
        openToast('리뷰 정보를 불러오는데 실패했습니다.')
        navigate(-1)
      }

      return
    }

    if (ramenyaDetailQuery.isError) {
      openToast('라멘집 정보를 불러오는데 실패했습니다.')
    }
  }, [isEditMode, navigate, openToast, ramenyaDetailQuery.isError, reviewDetailQuery.isError])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const isSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending
  const isLoading = isEditMode ? reviewDetailQuery.isLoading : ramenyaDetailQuery.isLoading

  return {
    currentReviewImages,
    customMenuInput,
    errors: {
      rating: hasSubmitted && values.rating <= 0,
      menus: hasSubmitted && selectedMenus.length === 0,
      review: hasSubmitted && values.review.trim().length < MIN_REVIEW_LENGTH,
    },
    fileInputRef,
    handleAddCustomMenu,
    handleBackClick,
    handleCancelBack: closeBackModal,
    handleConfirmBack,
    handleCustomMenuInputChange,
    handleCustomMenuKeyDown,
    handleImageClick,
    handleImageUpload,
    handleLoginConfirm,
    handleMenuClick,
    handleRemoveImage,
    handleReviewChange,
    handleStarClick,
    handleSubmitReview,
    isBackModalOpen,
    isFormValid,
    isImageUploading,
    isLoading,
    isLoginModalOpen,
    isSubmitting,
    loginModalClose: closeLoginModal,
    menuList,
    pageCopy,
    review: values.review,
    selectedMenus,
    watchedRating: values.rating,
  }
}
