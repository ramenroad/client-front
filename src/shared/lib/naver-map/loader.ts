import type { NaverMaps } from './types'

const NAVER_MAP_SCRIPT_ID = 'naver-map-script'
const NAVER_MAP_SCRIPT_BASE_URL = 'https://oapi.map.naver.com/openapi/v3/maps.js'

let naverMapLoadPromise: Promise<NaverMaps> | null = null

const getConfiguredClientId = () => {
  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
  return typeof clientId === 'string' ? clientId.trim() : ''
}

const getLoadedNaverMaps = () => window.naver?.maps

const createNaverMapScriptUrl = (clientId: string) => {
  const searchParams = new URLSearchParams({
    ncpKeyId: clientId,
  })

  return `${NAVER_MAP_SCRIPT_BASE_URL}?${searchParams.toString()}`
}

export const loadNaverMapScript = (clientId = getConfiguredClientId()) => {
  const loadedMaps = getLoadedNaverMaps()

  if (loadedMaps) {
    return Promise.resolve(loadedMaps)
  }

  if (!clientId) {
    return Promise.reject(new Error('VITE_NAVER_MAP_CLIENT_ID is required.'))
  }

  if (naverMapLoadPromise) {
    return naverMapLoadPromise
  }

  naverMapLoadPromise = new Promise<NaverMaps>((resolve, reject) => {
    const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID) as HTMLScriptElement | null
    const script = existingScript ?? document.createElement('script')

    script.id = NAVER_MAP_SCRIPT_ID
    script.async = true
    script.src = createNaverMapScriptUrl(clientId)

    script.addEventListener(
      'load',
      () => {
        const maps = getLoadedNaverMaps()

        if (!maps) {
          reject(new Error('Naver Maps script loaded, but window.naver.maps is unavailable.'))
          return
        }

        resolve(maps)
      },
      { once: true },
    )

    script.addEventListener(
      'error',
      () => {
        naverMapLoadPromise = null
        reject(new Error('Failed to load Naver Maps script.'))
      },
      { once: true },
    )

    if (!existingScript) {
      document.head.appendChild(script)
    }
  })

  return naverMapLoadPromise
}
