import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession } from '@/entities/session/model'
import { resolveActiveTab } from '@/shared/app-env'

export const useAppBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
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
    navigate(isSignIn ? '/mypage' : '/login')
  }, [isSignIn, navigate])

  return {
    selected,
    handleHomeClick,
    handleMapClick,
    handleCommunityClick,
    handleMyClick,
  }
}
