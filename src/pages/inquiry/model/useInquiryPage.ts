import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequireSignInRedirect } from '@/entities/session/model'
import { useCreateInquiryMutation } from '@/features/inquiry'
import { useToast } from '@/shared/ui/toast'

export const useInquiryPage = () => {
  const navigate = useNavigate()
  const { openToast } = useToast()

  // 의견 남기기는 로그인이 필요하다. 비로그인 상태로 진입하면 로그인 화면으로 보낸다.
  useRequireSignInRedirect()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false)
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false)

  const createInquiry = useCreateInquiryMutation({
    onSuccess: () => {
      openToast('소중한 의견 감사합니다.')
      navigate(-1)
    },
    onError: (error) => {
      setIsSubmitConfirmOpen(false)
      openToast(error.message || '의견 등록에 실패했어요.', undefined, 'error')
    },
  })

  const isValid = title.trim().length > 0 && body.trim().length > 0
  const isDirty = title.length > 0 || body.length > 0

  const handleBackClick = () => {
    if (isDirty) {
      setIsBackConfirmOpen(true)
      return
    }

    navigate(-1)
  }

  const handleSubmitClick = () => {
    if (!isValid || createInquiry.isPending) {
      return
    }

    setIsSubmitConfirmOpen(true)
  }

  const confirmSubmit = () => {
    if (createInquiry.isPending) {
      return
    }

    createInquiry.mutate({ title: title.trim(), body: body.trim() })
  }

  return {
    title,
    body,
    isValid,
    isSubmitting: createInquiry.isPending,
    isBackConfirmOpen,
    isSubmitConfirmOpen,
    setTitle,
    setBody,
    handleBackClick,
    confirmBack: () => {
      setIsBackConfirmOpen(false)
      navigate(-1)
    },
    cancelBack: () => setIsBackConfirmOpen(false),
    handleSubmitClick,
    confirmSubmit,
    cancelSubmit: () => setIsSubmitConfirmOpen(false),
  }
}
