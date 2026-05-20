import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'

export const useAppBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isSignIn } = useAuthSession()

  const currentPath = useMemo(() => location.pathname.split('/')[1] ?? '', [location.pathname])

  const selected = useMemo(
    () => ({
      home: currentPath === '',
      map: currentPath === 'map',
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

  const handleMyClick = useCallback(() => {
    navigate(isSignIn ? '/mypage' : '/login')
  }, [isSignIn, navigate])

  return {
    selected,
    handleHomeClick,
    handleMapClick,
    handleMyClick,
  }
}
