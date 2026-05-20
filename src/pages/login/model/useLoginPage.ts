import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { isOAuthProviderConfigured, redirectToOAuthProvider, type OAuthProvider } from '@/features/auth'
import { useToast } from '@/shared/ui/toast'

export const useLoginPage = () => {
  const navigate = useNavigate()
  const { openToast } = useToast()

  const handleLogin = useCallback(
    (provider: OAuthProvider) => {
      if (!isOAuthProviderConfigured(provider)) {
        openToast('로그인 설정이 비어있어요. OAuth Client ID를 확인해주세요.')
        return
      }

      const redirected = redirectToOAuthProvider(provider)

      if (!redirected) {
        openToast('로그인 페이지로 이동하지 못했어요.')
      }
    },
    [openToast],
  )

  return {
    handleLogin,
    handleBack: () => navigate('/'),
  }
}
