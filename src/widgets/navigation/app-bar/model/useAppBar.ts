import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession } from '@/entities/session/model'

export const useAppBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isSignIn } = useAuthSession()

  const currentPath = useMemo(() => location.pathname.split('/')[1] ?? '', [location.pathname])

  const selected = useMemo(
    () => ({
      home: currentPath === '',
      map: currentPath === 'map',
      community: currentPath === 'community',
      my: currentPath === 'mypage' || currentPath === 'user-review',
    }),
    [currentPath],
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
