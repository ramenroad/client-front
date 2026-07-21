import { useLayoutEffect, useState } from 'react'
import { useAppEnv } from '@/shared/app-env'
import {
  MAP_RESULT_SHEET_MAX_DVH,
  MAP_RESULT_SHEET_MIN_DVH,
  SHEET_MAX_HEIGHT_CSS,
  SHEET_MIN_HEIGHT_CSS,
} from './sheetHeight'

type SheetBoundsDvh = {
  minDvh: number
  maxDvh: number
}

const DEFAULT_BOUNDS: SheetBoundsDvh = {
  minDvh: MAP_RESULT_SHEET_MIN_DVH,
  maxDvh: MAP_RESULT_SHEET_MAX_DVH,
}

/**
 * 시트 높이의 하한(손잡이+필터 헤더)·상한(검색바 아래)을 dvh로 '측정'한다.
 *
 * 시트 높이는 dvh(=100dvh 기준)인데 컨테이너는 100dvh - --app-bar-space라, px로 재구성하면
 * 웹 탭바·세이프에어리어·dvh 오차를 놓치기 쉽다. 그래서 실제 CSS 식을 담은 프로브를 브라우저가
 * 계산하게 해, 하한/상한 px을 100dvh 대비 비율(dvh)로 그대로 읽는다.
 */
const measureSheetBounds = (): SheetBoundsDvh => {
  if (typeof document === 'undefined' || !document.body) {
    return DEFAULT_BOUNDS
  }

  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;left:0;top:0;width:0;visibility:hidden;pointer-events:none'
  document.body.appendChild(probe)

  probe.style.height = SHEET_MIN_HEIGHT_CSS
  const minHeightPx = probe.getBoundingClientRect().height
  probe.style.height = SHEET_MAX_HEIGHT_CSS
  const maxHeightPx = probe.getBoundingClientRect().height
  probe.style.height = '100dvh'
  const viewportDvhPx = probe.getBoundingClientRect().height
  probe.remove()

  if (!(viewportDvhPx > 0)) {
    return DEFAULT_BOUNDS
  }

  // 하한: 헤더 높이에 정확히 맞도록 반올림하지 않는다(dvh로 반올림하면 1~2px 빈틈이 생긴다).
  // 상한: 검색바를 침범하지 않도록 내림(floor).
  const minDvh = (minHeightPx / viewportDvhPx) * 100
  const safeMaxDvh = Math.floor((maxHeightPx / viewportDvhPx) * 100)
  // 상한은 [minDvh, 80]. 화면이 너무 낮아 '검색바 아래' 상한이 하한보다 작으면 하한을 택한다(필터 노출 우선).
  const maxDvh = Math.min(MAP_RESULT_SHEET_MAX_DVH, Math.max(minDvh, safeMaxDvh))

  return { minDvh: Math.min(minDvh, maxDvh), maxDvh }
}

export const useSheetBounds = (): SheetBoundsDvh => {
  // 세이프에어리어 인셋이 바뀌면(--map-search-top/--app-bar-space 갱신) 재측정하도록 트리거로 둔다.
  const { safeTop } = useAppEnv()
  const [bounds, setBounds] = useState<SheetBoundsDvh>(DEFAULT_BOUNDS)

  useLayoutEffect(() => {
    const updateBounds = () => {
      const next = measureSheetBounds()
      // 값이 그대로면 새 객체로 리렌더를 유발하지 않는다(visualViewport resize가 잦으므로).
      setBounds((prev) => (prev.minDvh === next.minDvh && prev.maxDvh === next.maxDvh ? prev : next))
    }

    updateBounds()
    window.addEventListener('resize', updateBounds)
    window.addEventListener('orientationchange', updateBounds)
    const visualViewport = window.visualViewport
    visualViewport?.addEventListener('resize', updateBounds)

    return () => {
      window.removeEventListener('resize', updateBounds)
      window.removeEventListener('orientationchange', updateBounds)
      visualViewport?.removeEventListener('resize', updateBounds)
    }
  }, [safeTop])

  return bounds
}
