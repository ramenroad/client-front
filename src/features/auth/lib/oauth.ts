import { getApiBaseUrl, resolveEnv } from '@/shared/config'

export type OAuthProvider = 'kakao' | 'naver' | 'google' | 'apple'

const NAVER_OAUTH_STATE = 'ramenroad'

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

export const isOAuthProviderConfigured = (provider: OAuthProvider) => Boolean(getOAuthClientId(provider))

export const getOAuthAuthorizationUrl = (provider: OAuthProvider) => {
  const clientId = getOAuthClientId(provider)

  if (!clientId) {
    return null
  }

  switch (provider) {
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

export const getNaverOAuthState = () => NAVER_OAUTH_STATE
