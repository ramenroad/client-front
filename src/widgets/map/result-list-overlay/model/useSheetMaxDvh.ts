import { useLayoutEffect, useState } from 'react'
import { useAppEnv } from '@/shared/app-env'
import { MAP_RESULT_SHEET_MAX_DVH, MAP_RESULT_SHEET_MIN_DVH, SHEET_MAX_HEIGHT_CSS } from './sheetHeight'

/**
 * 시트가 검색바를 침범하지 않는 최대 높이(dvh)를 '측정'한다.
 *
 * 시트 컨테이너(MapScreen)는 100dvh - --app-bar-space 높이인데 시트 높이는 dvh(=100dvh 기준)라,
 * px로 재구성하면 --app-bar-space(웹 탭바)·세이프에어리어·dvh 오차를 놓치기 쉽다. 그래서 실제 CSS 식을
 * 담은 프로브를 브라우저가 계산하게 해, 안전 최대 높이를 100dvh 대비 비율(dvh)로 그대로 읽는다.
 */
const measureSheetMaxDvh = (): number => {
  if (typeof document === 'undefined' || !document.body) {
    return MAP_RESULT_SHEET_MAX_DVH
  }

  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;left:0;top:0;width:0;visibility:hidden;pointer-events:none'
  document.body.appendChild(probe)

  probe.style.height = SHEET_MAX_HEIGHT_CSS
  const maxHeightPx = probe.getBoundingClientRect().height
  probe.style.height = '100dvh'
  const viewportDvhPx = probe.getBoundingClientRect().height
  probe.remove()

  if (!(viewportDvhPx > 0)) {
    return MAP_RESULT_SHEET_MAX_DVH
  }

  // 시트 높이는 100dvh 기준이므로 측정한 최대 높이를 100dvh 대비 비율(dvh)로 환산한다.
  // floor로 내려 반올림 때문에 검색바를 다시 침범하지 않게 한다.
  const maxDvh = Math.floor((maxHeightPx / viewportDvhPx) * 100)
  return Math.min(MAP_RESULT_SHEET_MAX_DVH, Math.max(MAP_RESULT_SHEET_MIN_DVH, maxDvh))
}

export const useSheetMaxDvh = (): number => {
  // 세이프에어리어 인셋이 바뀌면(--map-search-top/--app-bar-space 갱신) 재측정하도록 트리거로 둔다.
  const { safeTop } = useAppEnv()
  const [maxSheetDvh, setMaxSheetDvh] = useState(MAP_RESULT_SHEET_MAX_DVH)

  useLayoutEffect(() => {
    const updateMaxSheetDvh = () => setMaxSheetDvh(measureSheetMaxDvh())

    updateMaxSheetDvh()
    window.addEventListener('resize', updateMaxSheetDvh)
    window.addEventListener('orientationchange', updateMaxSheetDvh)
    const visualViewport = window.visualViewport
    visualViewport?.addEventListener('resize', updateMaxSheetDvh)

    return () => {
      window.removeEventListener('resize', updateMaxSheetDvh)
      window.removeEventListener('orientationchange', updateMaxSheetDvh)
      visualViewport?.removeEventListener('resize', updateMaxSheetDvh)
    }
  }, [safeTop])

  return maxSheetDvh
}
