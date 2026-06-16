import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession } from './session'
import { setPostLoginRedirect } from './postLoginRedirect'

/** 비로그인 상태로 페이지에 진입하면 지정 경로(기본 /login)로 보낸다(마운트 가드). 로그인 후 원래 페이지로 복귀. */
export const useRequireSignInRedirect = (to = '/login') => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isSignIn } = useAuthSession()

  useEffect(() => {
    if (!isSignIn) {
      if (to === '/login') {
        setPostLoginRedirect(`${location.pathname}${location.search}`)
      }
      navigate(to)
    }
  }, [isSignIn, navigate, to, location.pathname, location.search])
}
