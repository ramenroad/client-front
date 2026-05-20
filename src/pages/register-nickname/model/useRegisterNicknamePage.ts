import { useMemo, useState, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { viewerQueryKeys } from '@/entities/viewer/api'
import { useUpdateNicknameMutation } from '@/features/profile'
import type { ApiError } from '@/shared/api'
import { useToast } from '@/shared/ui/toast'

const MIN_NICKNAME_LENGTH = 2
const MAX_NICKNAME_LENGTH = 10

const getErrorStatusCode = (error: ApiError) => {
  const payloadStatusCode = error.payload?.statusCode
  return typeof payloadStatusCode === 'number' ? payloadStatusCode : error.status
}

export const useRegisterNicknamePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const [searchParams] = useSearchParams()
  const currentNickname = searchParams.get('nickname') ?? ''
  const [nickname, setNickname] = useState('')
  const [isNicknameAlreadyExists, setIsNicknameAlreadyExists] = useState(false)
  const updateNicknameMutation = useUpdateNicknameMutation({
    onSuccess: () => {
      openToast(currentNickname ? '닉네임 변경 완료' : '닉네임 설정 완료')
      queryClient.invalidateQueries({ queryKey: viewerQueryKeys.myInfo() })
      navigate('/mypage')
    },
    onError: (error) => {
      if (getErrorStatusCode(error) === 409) {
        setIsNicknameAlreadyExists(true)
        return
      }

      openToast(error.message || '닉네임 설정에 실패했어요.')
    },
  })

  const placeholder = currentNickname || '최소 2-10자로 설정해주세요'
  const trimmedNickname = nickname.trim()

  const isSubmitDisabled = useMemo(() => {
    return (
      trimmedNickname.length < MIN_NICKNAME_LENGTH ||
      trimmedNickname.length > MAX_NICKNAME_LENGTH ||
      trimmedNickname === currentNickname ||
      updateNicknameMutation.isPending
    )
  }, [currentNickname, trimmedNickname, updateNicknameMutation.isPending])

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNicknameAlreadyExists) {
      setIsNicknameAlreadyExists(false)
    }

    setNickname(event.target.value)
  }

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return
    }

    updateNicknameMutation.mutate({ nickname: trimmedNickname })
  }

  return {
    currentNickname,
    nickname,
    placeholder,
    isNicknameAlreadyExists,
    isSubmitDisabled,
    isPending: updateNicknameMutation.isPending,
    handleNicknameChange,
    handleSubmit,
  }
}
