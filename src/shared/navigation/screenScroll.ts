import { useCallback } from 'react'
import { useAppScreen } from '@stackflow/plugin-basic-ui'

/**
 * 화면 스크롤 — Stackflow에선 각 화면(AppScreen)이 **자기 스크롤 컨테이너**를 가진다.
 * window가 스크롤하지 않으므로 window.scrollTo는 무효다. 그 대신 화면별 스크롤 위치가 저절로 보존되어
 * 뒤로가기 시 스크롤 복원 코드가 필요 없어진다.
 */

let scrollActiveScreen: ((top: number) => void) | null = null

/** 활성 화면이 자기 스크롤 함수를 등록한다(스크린 래퍼가 호출). */
export const registerActiveScreenScroll = (scroll: (top: number) => void) => {
  scrollActiveScreen = scroll
  return () => {
    if (scrollActiveScreen === scroll) {
      scrollActiveScreen = null
    }
  }
}

/** 스택 밖(브리지 scroll.top 토픽 등)에서 현재 화면을 스크롤한다. */
export const scrollActiveScreenTo = (top = 0) => {
  scrollActiveScreen?.(top)
}

/** 화면 안에서 자기 스크롤을 제어한다 — window.scrollTo(0, 0)의 대체. */
export const useScreenScroll = () => {
  const { scroll } = useAppScreen()

  return useCallback(
    (top = 0) => {
      scroll({ top })
    },
    [scroll],
  )
}
