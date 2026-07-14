import { useCallback, useMemo } from 'react'
import { useAppLocation, useAppNavigate } from '@/shared/navigation'
import { useAuthSession, useGoToLogin } from '@/entities/session/model'
import { resolveActiveTab } from '@/shared/app-env'

export const useAppBar = () => {
  const navigate = useAppNavigate()
  const goToLogin = useGoToLogin()
  const location = useAppLocation()
  const { isSignIn } = useAuthSession()

  // 활성 탭은 resolveActiveTab 단일 소스로 산출(§2.9.3) — ROUTE_CHANGED 발신부와 매핑 일치.
  const activeTab = useMemo(() => resolveActiveTab(location.pathname), [location.pathname])

  const selected = useMemo(
    () => ({
      home: activeTab === 'home',
      map: activeTab === 'map',
      community: activeTab === 'community',
      my: activeTab === 'my',
    }),
    [activeTab],
  )

  const handleHomeClick = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleMapClick = useCallback(() => {
    navigate('/map')
  }, [navigate])

  const handleCommunityClick = useCallback(() => {
    navigate('/community')
  }, [navigate])

  const handleMyClick = useCallback(() => {
    if (isSignIn) {
      navigate('/mypage')
    } else {
      goToLogin('/mypage')
    }
  }, [isSignIn, navigate, goToLogin])

  return {
    selected,
    handleHomeClick,
    handleMapClick,
    handleCommunityClick,
    handleMyClick,
  }
}
