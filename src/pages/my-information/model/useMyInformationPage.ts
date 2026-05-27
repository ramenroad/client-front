import { useRef, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useMyInfoQuery, viewerQueryKeys } from '@/entities/viewer/api'
import { authStore, useAuthSession, useSignOutMutation } from '@/features/auth'
import { useUpdateProfileImageMutation } from '@/features/profile'
import { useTheme } from '@/shared/model'
import { useToast } from '@/shared/ui/toast'

export const useMyInformationPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const { isDarkMode, toggleTheme } = useTheme()
  const authSession = useAuthSession()
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const myInfoQuery = useMyInfoQuery({ enabled: authSession.isSignIn })
  const updateProfileImageMutation = useUpdateProfileImageMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: viewerQueryKeys.myInfo() })
    },
  })
  const signOutMutation = useSignOutMutation({
    onSettled: () => {
      authStore.clearTokens()
      queryClient.clear()
      openToast('로그아웃 완료')
      navigate('/')
    },
  })

  const handleProfileImageButtonClick = () => {
    profileImageInputRef.current?.click()
  }

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    updateProfileImageMutation.mutate(file)
    event.target.value = ''
  }

  const handleNicknameClick = () => {
    const nickname = myInfoQuery.data?.nickname
    navigate(nickname ? `/register?nickname=${encodeURIComponent(nickname)}` : '/register')
  }

  return {
    profile: myInfoQuery.data,
    isSignedIn: authSession.isSignIn && myInfoQuery.error?.status !== 401,
    isLoading: authSession.isSignIn && myInfoQuery.isLoading,
    isError: authSession.isSignIn && myInfoQuery.isError && myInfoQuery.error?.status !== 401,
    isProfileImageUpdating: updateProfileImageMutation.isPending,
    isDarkMode,
    isThemeToggleVisible: import.meta.env.DEV,
    themeModeLabel: isDarkMode ? '다크모드' : '라이트모드',
    profileImageInputRef,
    handleProfileImageButtonClick,
    handleProfileImageChange,
    handleNicknameClick,
    handleLoginClick: () => navigate('/login'),
    handleWithdrawClick: () => navigate('/withdraw'),
    handleLogoutClick: () => signOutMutation.mutate(),
    handleThemeToggle: toggleTheme,
  }
}
