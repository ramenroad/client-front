import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { isOAuthProviderConfigured, startOAuthLogin, type OAuthProvider } from '@/features/auth'
import { useToast } from '@/shared/ui/toast'

export const useLoginPage = () => {
  const navigate = useNavigate()
  const { openToast } = useToast()

  const handleLogin = useCallback(
    async (provider: OAuthProvider) => {
      if (!isOAuthProviderConfigured(provider)) {
        openToast('로그인 설정이 비어있어요. OAuth 설정을 확인해주세요.', undefined, 'error')
        return
      }

      const started = await startOAuthLogin(provider)

      if (!started) {
        openToast('로그인 페이지로 이동하지 못했어요.', undefined, 'error')
      }
    },
    [openToast],
  )

  return {
    handleLogin,
    handleBack: () => navigate('/'),
  }
}
