import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getInitialHashParams,
  getInitialSearchParams,
  useAppNavigate,
  useAppParams,
  useAppSearchParams,
} from '@/shared/navigation'
import { viewerQueryKeys } from '@/entities/viewer/api'
import { authStore, consumePostLoginRedirect } from '@/entities/session/model'
import {
  buildAppReturnUrl,
  getNaverOAuthState,
  isOAuthProviderConfigured,
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

// 부팅 시점의 URL을 읽는다. window.location을 직접 보면 안 된다 — 스택(history-sync)이 마운트 직후
// URL을 다시 쓰면서 **해시를 지워버려서**, 구글 implicit flow의 access_token(#access_token=...)이
// 이 훅이 실행될 때쯤엔 이미 사라져 있다.
const getAppleCallbackParams = () => {
  const searchParams = getInitialSearchParams()

  return {
    accessToken: searchParams.get('accessToken'),
    refreshToken: searchParams.get('refreshToken'),
    type: searchParams.get('type'),
  }
}

const getOAuthCallbackCode = () => {
  const searchParams = getInitialSearchParams()
  const hashParams = getInitialHashParams()

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
  const { id } = useAppParams()
  const provider = id as SupportedCallbackProvider | undefined
  const navigate = useAppNavigate()
  const [, setSearchParams] = useAppSearchParams()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const [status, setStatus] = useState<OAuthCallbackStatus>('loading')
  const [loginEmail, setLoginEmail] = useState('')
  const deferStatus = useCallback((nextStatus: OAuthCallbackStatus) => {
    window.setTimeout(() => setStatus(nextStatus), 0)
  }, [])
  const processedRef = useRef(false)

  /**
   * 인가코드/토큰을 URL에서 지운다. OAuth 인가코드는 **일회용**인데 콜백 URL에 그대로 남아 있으면,
   * 이 화면에서 새로고침하는 순간 이미 소비된 코드를 다시 교환하려 들고 서버가 500을 뱉는다
   * (실제로 `{"statusCode":500,"message":"Internal server error"}`가 온다).
   * 코드가 히스토리·리퍼러·로그에 남는 것도 막는다.
   */
  const clearOAuthParamsFromUrl = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const handleSignInSuccess = useCallback(
    (data: SignInResponse) => {
      authStore.setTokens(data)
      queryClient.invalidateQueries({ queryKey: viewerQueryKeys.myInfo() })
      openToast('로그인 성공')
      // 로그인 직전 페이지로 복귀(없으면 홈). 회원가입은 /register로 보내되 복귀 경로는 보존 → 가입 완료 시 사용.
      const isSignup = normalizeSignInType(data.type) === 'signup'
      const destination = isSignup ? '/register' : (consumePostLoginRedirect() ?? '/')

      // 콜백 화면은 목적지로 치환한다 — OAuth는 풀페이지 왕복이라 이 액티비티가 스택의 바닥이고,
      // push로 얹으면 뒤로가기가 콜백 화면으로 되돌아와 인가 코드를 다시 처리하려 든다.
      navigate(destination, { replace: true })
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

      // 서버 원문(예: "Internal server error")을 그대로 띄우지 않는다 — 사용자에게 의미가 없고 겁만 준다.
      // 화면(status='error')이 "로그인에 실패했어요 / 잠시 후 다시 시도해 주세요"를 이미 안내하므로 토스트도 생략.
      setStatus('error')
    },
    [],
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
    // 콜백은 딱 한 번만 처리한다. useMutation이 렌더마다 새 객체를 주므로 이 effect는 리렌더마다 재실행되고,
    // 아래에서 URL의 인가코드를 지우기 때문에 가드가 없으면 두 번째 실행이 "코드 없음"으로 오판한다.
    if (processedRef.current) {
      return
    }

    if (!provider) {
      processedRef.current = true
      deferStatus('error')
      return
    }

    if (provider === 'apple') {
      const { accessToken, refreshToken, type } = getAppleCallbackParams()

      if (!accessToken || !refreshToken) {
        processedRef.current = true
        deferStatus('error')
        return
      }

      processedRef.current = true
      clearOAuthParamsFromUrl() // 토큰이 URL(히스토리·리퍼러)에 남지 않게 즉시 제거
      handleSignInSuccess({ accessToken, refreshToken, type: normalizeSignInType(type) })
      return
    }

    const { code, state, accessToken } = getOAuthCallbackCode()

    // 카카오 앱 경유 로그인이 카톡 인앱 브라우저로 떨어진 경우: 커스텀 스킴으로 네이티브에 코드를 넘겨
    // 우리 WebView로 복귀시킨다(토큰 교환은 복귀 후 isInApp 컨텍스트에서 실행). 순수 웹/인앱에선 바운스 안 함.
    if (provider === 'kakao' && code && state === OAUTH_APP_STATE && !isInApp()) {
      processedRef.current = true
      window.location.replace(buildAppReturnUrl('kakao', { code, state }))
      return
    }

    const callbackValue = provider === 'google' ? accessToken : code

    // 코드 없이 이 화면에 있다 = 이미 처리하고 URL을 비웠거나(새로고침), 잘못 들어온 것.
    // 소비된 코드를 다시 교환하면 서버가 500을 뱉으므로, 재전송 대신 로그인 화면으로 되돌린다.
    //
    // 여기선 스택 네비게이션(replace)을 쓰지 않는다. 새로고침으로 히스토리에서 복원된 액티비티를 replace하면
    // history-sync가 그 액티비티의 step을 되감으려고 history.back()을 호출해 SPA 밖으로 빠져나간다.
    // 콜백은 어차피 일회성 화면이라 풀 네비게이션이 의미상으로도 맞다.
    if (!callbackValue) {
      processedRef.current = true
      window.location.replace('/login')
      return
    }

    processedRef.current = true
    clearOAuthParamsFromUrl() // 일회용 인가코드 제거 → 새로고침해도 재전송되지 않는다

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
  }, [
    clearOAuthParamsFromUrl,
    deferStatus,
    googleSignIn,
    handleSignInSuccess,
    kakaoSignIn,
    naverSignIn,
    navigate,
    provider,
  ])

  // 로그인 페이지(useLoginPage)와 같은 가드/피드백을 둔다 — 기존에는 반환값을 버려서(void), 설정 누락이나
  // SDK 로드 실패로 이동을 못 해도 아무 안내 없이 화면이 그대로였다.
  const handleLogin = useCallback(
    async (loginType: OAuthProvider) => {
      if (!isOAuthProviderConfigured(loginType)) {
        openToast('로그인 설정이 비어있어요. OAuth 설정을 확인해주세요.', undefined, 'error')
        return
      }

      const started = await startOAuthLogin(loginType)

      if (!started) {
        openToast('로그인 페이지로 이동하지 못했어요.', undefined, 'error')
      }
    },
    [openToast],
  )

  const handleBack = () => {
    navigate('/')
  }

  return {
    status,
    loginEmail,
    /** 방금 실패한 제공자 — 이메일 충돌 화면에서 같은 버튼을 다시 눌러 무한 반복하는 걸 막는 데 쓴다. */
    attemptedProvider: provider,
    handleLogin,
    handleBack,
  }
}
