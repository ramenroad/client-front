import { resolveEnv } from '@/shared/config'

type KakaoAuthorizeParams = {
  redirectUri: string
  throughTalk?: boolean
  state?: string
  scope?: string
}

export type KakaoShareDefaultPayload = {
  objectType: 'feed'
  content: {
    title: string
    description: string
    link: {
      mobileWebUrl: string
      webUrl: string
    }
    imageUrl?: string
  }
}

// Minimal surface of the Kakao JavaScript SDK that login/share rely on.
// The SDK script is loaded synchronously in index.html (Kakao share also uses it).
export type KakaoSdk = {
  isInitialized: () => boolean
  init: (appKey: string) => void
  Auth: {
    authorize: (params: KakaoAuthorizeParams) => void
  }
  Share?: {
    sendDefault: (payload: KakaoShareDefaultPayload) => void
  }
}

const SDK_READY_TIMEOUT_MS = 5000
const SDK_POLL_INTERVAL_MS = 50

const getKakaoSdk = () => (window as Window & { Kakao?: KakaoSdk }).Kakao

// Waits for the SDK script to attach window.Kakao. It is synchronous in <head>,
// so this usually resolves on the first tick; the poll just guards slow loads.
const waitForKakaoSdk = () =>
  new Promise<KakaoSdk | null>((resolve) => {
    const existing = getKakaoSdk()

    if (existing) {
      resolve(existing)
      return
    }

    let elapsed = 0
    const timer = window.setInterval(() => {
      const sdk = getKakaoSdk()

      if (sdk) {
        window.clearInterval(timer)
        resolve(sdk)
        return
      }

      elapsed += SDK_POLL_INTERVAL_MS

      if (elapsed >= SDK_READY_TIMEOUT_MS) {
        window.clearInterval(timer)
        resolve(null)
      }
    }, SDK_POLL_INTERVAL_MS)
  })

export const isKakaoSdkConfigured = () => Boolean(resolveEnv('VITE_KAKAO_APP_KEY'))

// Ensures the Kakao SDK is loaded and initialized with the JavaScript app key.
// Returns the ready SDK, or null when the key is missing or the script never loads.
export const ensureKakaoInitialized = async (): Promise<KakaoSdk | null> => {
  const appKey = resolveEnv('VITE_KAKAO_APP_KEY')

  if (!appKey) {
    return null
  }

  const sdk = await waitForKakaoSdk()

  if (!sdk) {
    return null
  }

  if (!sdk.isInitialized()) {
    sdk.init(appKey)
  }

  return sdk.isInitialized() ? sdk : null
}
