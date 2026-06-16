import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { viewerQueryKeys } from '@/entities/viewer/api'
import { authStore, consumePostLoginRedirect } from '@/entities/session/model'
import {
  buildAppReturnUrl,
  getNaverOAuthState,
  OAUTH_APP_STATE,
  startOAuthLogin,
  type OAuthProvider,
  type SignInResponse,
  type SignInType,
  useSignInWithGoogleMutation,
  useSignInWithKakaoMutation,
  useSignInWithNaverMutation,
} from '@/features/auth'
import type { ApiError } from '@/shared/api'
import { isInApp } from '@/shared/bridge'
import { useToast } from '@/shared/ui/toast'

type OAuthCallbackStatus = 'loading' | 'email_conflict' | 'withdrawn' | 'error'
type SupportedCallbackProvider = Extract<OAuthProvider, 'kakao' | 'naver' | 'google' | 'apple'>

const getOAuthSearchParams = () => new URLSearchParams(window.location.search)

const getAppleCallbackParams = () => {
  const searchParams = getOAuthSearchParams()

  return {
    accessToken: searchParams.get('accessToken'),
    refreshToken: searchParams.get('refreshToken'),
    type: searchParams.get('type'),
  }
}

const getOAuthCallbackCode = () => {
  const searchParams = getOAuthSearchParams()
  const hashParams = new URLSearchParams(window.location.hash.substring(1))

  return {
    code: searchParams.get('code'),
    state: searchParams.get('state'),
    accessToken: hashParams.get('access_token'),
  }
}

const normalizeSignInType = (type?: string | null): SignInType => {
  if (type === 'signup' || type === 'signUp') {
    return 'signup'
  }

  return 'signin'
}

const getErrorStatusCode = (error: ApiError) => {
  const payloadStatusCode = error.payload?.statusCode
  return typeof payloadStatusCode === 'number' ? payloadStatusCode : error.status
}

const getErrorEmail = (error: ApiError) => {
  const email = error.payload?.email
  return typeof email === 'string' ? email : ''
}

export const useOAuthCallbackPage = () => {
  const { id } = useParams()
  const provider = id as SupportedCallbackProvider | undefined
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const [status, setStatus] = useState<OAuthCallbackStatus>('loading')
  const [loginEmail, setLoginEmail] = useState('')
  const deferStatus = useCallback((nextStatus: OAuthCallbackStatus) => {
    window.setTimeout(() => setStatus(nextStatus), 0)
  }, [])
  const processedKeyRef = useRef<string | null>(null)

  const handleSignInSuccess = useCallback(
    (data: SignInResponse) => {
      authStore.setTokens(data)
      queryClient.invalidateQueries({ queryKey: viewerQueryKeys.myInfo() })
      openToast('로그인 성공')
      // 로그인 직전 페이지로 복귀(없으면 홈). 회원가입은 /register로 보내되 복귀 경로는 보존 → 가입 완료 시 사용.
      const isSignup = normalizeSignInType(data.type) === 'signup'
      navigate(isSignup ? '/register' : (consumePostLoginRedirect() ?? '/'))
    },
    [navigate, openToast, queryClient],
  )

  const handleSignInError = useCallback(
    (error: ApiError) => {
      const statusCode = getErrorStatusCode(error)

      if (statusCode === 406) {
        setStatus('email_conflict')
        setLoginEmail(getErrorEmail(error))
        return
      }

      if (statusCode === 403) {
        setStatus('withdrawn')
        return
      }

      setStatus('error')
      openToast(error.message || '로그인 실패', undefined, 'error')
    },
    [openToast],
  )

  const kakaoSignIn = useSignInWithKakaoMutation({
    onSuccess: handleSignInSuccess,
    onError: handleSignInError,
  })
  const naverSignIn = useSignInWithNaverMutation({
    onSuccess: handleSignInSuccess,
    onError: handleSignInError,
  })
  const googleSignIn = useSignInWithGoogleMutation({
    onSuccess: handleSignInSuccess,
    onError: handleSignInError,
  })

  useEffect(() => {
    if (!provider) {
      deferStatus('error')
      return
    }

    if (provider === 'apple') {
      const { accessToken, refreshToken, type } = getAppleCallbackParams()
      const callbackKey = `apple:${accessToken ?? ''}:${refreshToken ?? ''}`

      if (!accessToken || !refreshToken) {
        deferStatus('error')
        return
      }

      if (processedKeyRef.current === callbackKey) {
        return
      }

      processedKeyRef.current = callbackKey
      handleSignInSuccess({ accessToken, refreshToken, type: normalizeSignInType(type) })
      return
    }

    const { code, state, accessToken } = getOAuthCallbackCode()

    // 카카오 앱 경유 로그인이 카톡 인앱 브라우저로 떨어진 경우: 커스텀 스킴으로 네이티브에 코드를 넘겨
    // 우리 WebView로 복귀시킨다(토큰 교환은 복귀 후 isInApp 컨텍스트에서 실행). 순수 웹/인앱에선 바운스 안 함.
    if (provider === 'kakao' && code && state === OAUTH_APP_STATE && !isInApp()) {
      window.location.replace(buildAppReturnUrl('kakao', { code, state }))
      return
    }

    const callbackValue = provider === 'google' ? accessToken : code
    const callbackKey = `${provider}:${callbackValue ?? ''}:${state ?? ''}`

    if (!callbackValue) {
      deferStatus('error')
      return
    }

    if (processedKeyRef.current === callbackKey) {
      return
    }

    processedKeyRef.current = callbackKey

    if (provider === 'kakao') {
      kakaoSignIn.mutate({ authorizationCode: callbackValue })
      return
    }

    if (provider === 'naver') {
      naverSignIn.mutate({ authorizationCode: callbackValue, state: state || getNaverOAuthState() })
      return
    }

    if (provider === 'google') {
      googleSignIn.mutate({ accessToken: callbackValue })
    }
  }, [deferStatus, googleSignIn, handleSignInSuccess, kakaoSignIn, naverSignIn, provider])

  const handleLogin = (loginType: 'kakao' | 'naver') => {
    void startOAuthLogin(loginType)
  }

  const handleBack = () => {
    navigate('/')
  }

  return {
    status,
    loginEmail,
    handleLogin,
    handleBack,
  }
}
