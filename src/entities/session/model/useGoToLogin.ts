import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { setPostLoginRedirect } from './postLoginRedirect'

/**
 * 로그인 화면으로 보내되, 로그인 후 돌아올 경로를 저장한다(로그인 성공 시 자동 복귀).
 *
 * @example
 *   const goToLogin = useGoToLogin()
 *   goToLogin()            // 현재 페이지로 복귀 (예: 리뷰 작성 시도 → 로그인 → 리뷰 작성 페이지)
 *   goToLogin('/mypage')   // 의도한 목적지가 현재 페이지와 다를 때(예: '마이' 탭)
 */
export const useGoToLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (from?: string) => {
      setPostLoginRedirect(from ?? `${location.pathname}${location.search}`)
      navigate('/login')
    },
    [navigate, location.pathname, location.search],
  )
}
