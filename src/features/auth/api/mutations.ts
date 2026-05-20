import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type {
  SignInResponse,
  SignInWithAppleRequest,
  SignInWithGoogleRequest,
  SignInWithKakaoRequest,
  SignInWithNaverRequest,
  TokenPair,
} from '../model'
import { authMutationKeys } from './query-keys'
import { authApi } from './requests'

export function useSignInWithKakaoMutation(
  options?: ApiMutationOptions<SignInResponse, SignInWithKakaoRequest>,
) {
  return useApiMutation<SignInResponse, SignInWithKakaoRequest>(authApi.signInWithKakao, {
    mutationKey: authMutationKeys.signInWithKakao(),
    ...options,
  })
}

export function useSignInWithNaverMutation(
  options?: ApiMutationOptions<SignInResponse, SignInWithNaverRequest>,
) {
  return useApiMutation<SignInResponse, SignInWithNaverRequest>(authApi.signInWithNaver, {
    mutationKey: authMutationKeys.signInWithNaver(),
    ...options,
  })
}

export function useSignInWithGoogleMutation(
  options?: ApiMutationOptions<SignInResponse, SignInWithGoogleRequest>,
) {
  return useApiMutation<SignInResponse, SignInWithGoogleRequest>(authApi.signInWithGoogle, {
    mutationKey: authMutationKeys.signInWithGoogle(),
    ...options,
  })
}

export function useSignInWithAppleMutation(
  options?: ApiMutationOptions<void, SignInWithAppleRequest>,
) {
  return useApiMutation<void, SignInWithAppleRequest>(authApi.signInWithApple, {
    mutationKey: authMutationKeys.signInWithApple(),
    ...options,
  })
}

export function useRefreshAccessTokenMutation(options?: ApiMutationOptions<TokenPair, string>) {
  return useApiMutation<TokenPair, string>(authApi.refreshAccessToken, {
    mutationKey: authMutationKeys.refreshAccessToken(),
    ...options,
  })
}

export function useSignOutMutation(options?: ApiMutationOptions<void>) {
  return useApiMutation<void>(() => authApi.signOut(), {
    mutationKey: authMutationKeys.signOut(),
    ...options,
  })
}

export function useWithdrawMutation(options?: ApiMutationOptions<void>) {
  return useApiMutation<void>(() => authApi.withdraw(), {
    mutationKey: authMutationKeys.withdraw(),
    ...options,
  })
}
