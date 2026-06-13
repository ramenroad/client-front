import { useRef, useState, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authStore, useRequireSignInRedirect } from '@/entities/session/model'
import { useWithdrawMutation } from '@/features/auth'
import { useToast } from '@/shared/ui/toast'

const WITHDRAW_CONFIRM_TEXT = '확인했습니다'

export const useWithdrawPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  useRequireSignInRedirect()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isConfirmedPolicy, setIsConfirmedPolicy] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const withdrawMutation = useWithdrawMutation({
    onSuccess: () => {
      authStore.clearTokens()
      queryClient.clear()
      setIsWithdrawModalOpen(false)
      openToast('회원탈퇴 완료')
      navigate('/')
    },
    onError: (error) => {
      openToast(error.message || '회원탈퇴에 실패했어요.')
    },
  })

  const openWithdrawModal = () => {
    setConfirmText('')
    setIsWithdrawModalOpen(true)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const closeWithdrawModal = () => {
    if (withdrawMutation.isPending) {
      return
    }

    setIsWithdrawModalOpen(false)
    setConfirmText('')
  }

  const handleConfirmPolicyClick = () => {
    setIsConfirmedPolicy((prev) => !prev)
  }

  const handleWithdrawClick = () => {
    if (!isConfirmedPolicy) {
      return
    }

    openWithdrawModal()
  }

  const handleSubmitWithdraw = () => {
    if (confirmText !== WITHDRAW_CONFIRM_TEXT || withdrawMutation.isPending) {
      return
    }

    withdrawMutation.mutate()
  }

  const handleConfirmTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmText(event.target.value)
  }

  return {
    confirmText,
    confirmTextToMatch: WITHDRAW_CONFIRM_TEXT,
    inputRef,
    isConfirmedPolicy,
    isWithdrawModalOpen,
    isWithdrawPending: withdrawMutation.isPending,
    isConfirmTextMatched: confirmText === WITHDRAW_CONFIRM_TEXT,
    handleConfirmTextChange,
    closeWithdrawModal,
    handleConfirmPolicyClick,
    handleWithdrawClick,
    handleSubmitWithdraw,
  }
}
