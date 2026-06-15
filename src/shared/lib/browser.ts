import { BridgeMethods, has, invoke } from '@/shared/bridge'

const EXTERNAL_URL_PATTERN = /^https?:\/\//i

export const isExternalUrl = (url: string) => EXTERNAL_URL_PATTERN.test(url)

export const openUrl = (url: string) => {
  // 앱: 네이티브 openURL(전화/지도앱/외부 브라우저/딥링크). 미지원·실패 시 window.open 폴백(§2.8.3, W7).
  if (has(BridgeMethods.openURL)) {
    invoke(BridgeMethods.openURL, { url }).catch(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
    })
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
