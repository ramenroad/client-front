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

    // NCP 인증 실패(미등록 도메인/Referer 불일치/잘못된 키) 시 네이버가 이 콜백을 호출한다.
    // 핸들러가 없으면 지도가 조용히 안 뜨거나 maps 내부에서 크래시(x.LatLng)한다 — 명확한 에러로 바꿔 진단 가능하게 한다.
    // WebView는 페이지 origin(=WEB_BASE_URL)이 Referer로 가므로, 그 origin이 NCP 콘솔 'Web 서비스 URL'에 등록돼야 한다.
    ;(window as Window & { navermap_authFailure?: () => void }).navermap_authFailure = () => {
      naverMapLoadPromise = null
      console.error(
        `[NaverMap] 인증 실패 — 현재 origin(${window.location.origin})이 NCP 콘솔의 Web 서비스 URL에 등록됐는지 확인하세요.`,
      )
      reject(new Error('Naver Maps 인증 실패: 등록되지 않은 도메인이거나 키가 올바르지 않습니다.'))
    }

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
