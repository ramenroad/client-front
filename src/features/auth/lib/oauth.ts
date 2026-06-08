import { getApiBaseUrl, resolveEnv } from '@/shared/config'
import { ensureKakaoInitialized, isKakaoSdkConfigured } from '@/shared/lib/kakao-sdk'

export type OAuthProvider = 'kakao' | 'naver' | 'google' | 'apple'

const NAVER_OAUTH_STATE = 'ramenroad'

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
