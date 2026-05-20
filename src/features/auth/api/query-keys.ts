export const authMutationKeys = {
  signInWithKakao: () => ['auth', 'signin', 'kakao'] as const,
  signInWithNaver: () => ['auth', 'signin', 'naver'] as const,
  signInWithGoogle: () => ['auth', 'signin', 'google'] as const,
  signInWithApple: () => ['auth', 'signin', 'apple'] as const,
  refreshAccessToken: () => ['auth', 'refresh'] as const,
  signOut: () => ['auth', 'signout'] as const,
  withdraw: () => ['auth', 'withdraw'] as const,
}
