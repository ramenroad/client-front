import { apiClient } from '@/shared/api'
import type {
  SignInResponse,
  SignInWithAppleRequest,
  SignInWithGoogleRequest,
  SignInWithKakaoRequest,
  SignInWithNaverRequest,
  TokenPair,
} from '../model'

const AUTH_PATH = '/auth'

export const authApi = {
  signInWithKakao(data: SignInWithKakaoRequest) {
    return apiClient.post<SignInResponse>(`${AUTH_PATH}/signin/kakao`, data)
  },

  signInWithNaver(data: SignInWithNaverRequest) {
    return apiClient.post<SignInResponse>(`${AUTH_PATH}/signin/naver`, data)
  },

  signInWithGoogle(data: SignInWithGoogleRequest) {
    return apiClient.post<SignInResponse>(`${AUTH_PATH}/signin/google`, data)
  },

  signInWithApple(data: SignInWithAppleRequest) {
    return apiClient.post<void>(`${AUTH_PATH}/apple`, data)
  },

  refreshAccessToken(refreshToken: string) {
    return apiClient.post<TokenPair>(`${AUTH_PATH}/refresh`, undefined, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
  },

  signOut() {
    return apiClient.post<void>(`${AUTH_PATH}/signout`)
  },

  withdraw() {
    return apiClient.post<void>(`${AUTH_PATH}/withdrawal`)
  },
}
