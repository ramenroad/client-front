import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthSession } from './session'

/** 비로그인 상태로 페이지에 진입하면 지정 경로(기본 /login)로 보낸다(마운트 가드). */
export const useRequireSignInRedirect = (to = '/login') => {
  const navigate = useNavigate()
  const { isSignIn } = useAuthSession()

  useEffect(() => {
    if (!isSignIn) {
      navigate(to)
    }
  }, [isSignIn, navigate, to])
}
