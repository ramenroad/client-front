export type SignInType = 'signin' | 'signup' | string

export type TokenPair = {
  accessToken: string
  refreshToken: string
}

export type SignInResponse = TokenPair & {
  type: SignInType
}

export type SignInWithKakaoRequest = {
  authorizationCode: string
}

export type SignInWithNaverRequest = {
  authorizationCode: string
  state: string
}

export type SignInWithGoogleRequest = {
  accessToken: string
}

export type SignInWithAppleRequest = {
  state: string
  code: string
  id_token: string
}
