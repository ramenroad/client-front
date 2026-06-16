import { isInApp } from '@/shared/bridge'
import { getApiBaseUrl, resolveEnv } from '@/shared/config'
import { ensureKakaoInitialized, isKakaoSdkConfigured } from '@/shared/lib/kakao-sdk'

export type OAuthProvider = 'kakao' | 'naver' | 'google' | 'apple'

const NAVER_OAUTH_STATE = 'ramenroad'

// 네이티브 앱 복귀용 커스텀 스킴(Info.plist/AndroidManifest에 등록). 카톡 앱 경유 로그인이
// 카톡 인앱 브라우저로 떨어졌을 때, 콜백 페이지가 이 스킴으로 코드를 네이티브에 넘겨 우리 WebView로 복귀시킨다.
export const APP_RETURN_SCHEME = 'raisingapp'
// OAuth state 표식 — "앱에서 시작한 로그인"임을 라운드트립 후에도 식별(카톡 인앱 브라우저엔 __RAISING_APP__ 미주입).
export const OAUTH_APP_STATE = 'app'

export const buildAppReturnUrl = (
  provider: Exclude<OAuthProvider, 'apple'>,
  params: Record<string, string>,
) => `${APP_RETURN_SCHEME}://oauth/${provider}?${new URLSearchParams(params).toString()}`

// Kakao login is started through the JavaScript SDK so that mobile users get the
// KakaoTalk app simple-login flow (throughTalk). The redirect still lands on
// /oauth/kakao with ?code=, so the callback exchange is unchanged.
const KAKAO_LOGIN_THROUGH_TALK = true

export const getOAuthCallbackUrl = (provider: Exclude<OAuthProvider, 'apple'>) => {
  return `${window.location.origin}/oauth/${provider}`
}

export const getAppleRedirectUrl = () => `${getApiBaseUrl()}/auth/apple`

export const getOAuthClientId = (provider: OAuthProvider) => {
  switch (provider) {
    case 'kakao':
      return resolveEnv('VITE_KAKAO_CLIENT_ID')
    case 'naver':
      return resolveEnv('VITE_NAVER_CLIENT_ID', 'VITE_NAVER_OAUTH_CLIENT_ID')
    case 'google':
      return resolveEnv('VITE_GOOGLE_CLIENT_ID')
    case 'apple':
      return resolveEnv('VITE_APPLE_CLIENT_ID')
  }
}

export const isOAuthProviderConfigured = (provider: OAuthProvider) =>
  provider === 'kakao' ? isKakaoSdkConfigured() : Boolean(getOAuthClientId(provider))

export const getOAuthAuthorizationUrl = (provider: OAuthProvider) => {
  const clientId = getOAuthClientId(provider)

  if (!clientId) {
    return null
  }

  switch (provider) {
    // Kakao login goes through startOAuthLogin -> SDK (throughTalk). This REST
    // branch is retained only to keep the switch exhaustive; it is not used by
    // the live login flow and keys on VITE_KAKAO_CLIENT_ID, not the SDK app key.
    case 'kakao':
      return `https://kauth.kakao.com/oauth/authorize?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: getOAuthCallbackUrl('kakao'),
        response_type: 'code',
      }).toString()}`
    case 'naver':
      return `https://nid.naver.com/oauth2.0/authorize?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: getOAuthCallbackUrl('naver'),
        response_type: 'code',
        state: NAVER_OAUTH_STATE,
      }).toString()}`
    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: getOAuthCallbackUrl('google'),
        response_type: 'token',
        scope: 'email profile',
        prompt: 'select_account',
      }).toString()}`
    case 'apple':
      return `https://appleid.apple.com/auth/authorize?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: getAppleRedirectUrl(),
        response_type: 'code id_token',
        response_mode: 'form_post',
        state: 'raising',
        scope: 'email name',
      }).toString()}`
  }
}

export const redirectToOAuthProvider = (provider: OAuthProvider) => {
  const authorizationUrl = getOAuthAuthorizationUrl(provider)

  if (!authorizationUrl) {
    return false
  }

  window.location.href = authorizationUrl
  return true
}

// Starts Kakao login via the JavaScript SDK (KakaoTalk app simple login).
// Returns false when the SDK key is missing or the script failed to load.
export const loginWithKakaoSdk = async (): Promise<boolean> => {
  const kakao = await ensureKakaoInitialized()

  if (!kakao) {
    return false
  }

  kakao.Auth.authorize({
    redirectUri: getOAuthCallbackUrl('kakao'),
    throughTalk: KAKAO_LOGIN_THROUGH_TALK,
    // 앱에서 시작한 로그인이면 표식을 심어, 카톡 인앱 브라우저로 떨어진 콜백이 네이티브로 바운스하도록 한다.
    ...(isInApp() ? { state: OAUTH_APP_STATE } : {}),
  })

  return true
}

// Unified login entry point. Kakao goes through the SDK; the others use a plain
// OAuth authorization redirect. Both login and re-login screens call this so the
// call sites stay consistent.
export const startOAuthLogin = async (provider: OAuthProvider): Promise<boolean> => {
  if (provider === 'kakao') {
    return loginWithKakaoSdk()
  }

  return redirectToOAuthProvider(provider)
}

export const getNaverOAuthState = () => NAVER_OAUTH_STATE
