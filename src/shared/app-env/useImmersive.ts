/**
 * 풀스크린 커버(A안) — 마운트된 동안 네이티브 하단 탭바를 숨겨 화면이 탭바를 "덮게" 한다.
 * 라우트 변경이 아닌 인페이지 오버레이/모달(이미지 뷰어·글쓰기·풀 바텀시트 등)에서도 동작하며,
 * 언마운트 시 자동 복원. 순수 웹/구버전 앱에선 no-op(emit 내부에서 isInApp 가드).
 *
 * 탭바가 사라진 잔여 인셋(홈인디케이터만)은 네이티브가 SAFE_AREA_INSETS로 재방출 → --safe-bottom 자동 갱신.
 * 웹에서 추가 인셋 계산 불필요.
 */
import { useEffect } from 'react'
import { BridgeTopics, emit, isInApp } from '@/shared/bridge'

// 커버 화면 중첩(모달 위 모달)에도 안전하도록 요청 수를 세고, 0→1·1→0 경계에서만 상태가 바뀐다(멱등).
let coverCount = 0
const sync = () => emit(BridgeTopics.setTabBar, { hidden: coverCount > 0 })

/**
 * @param active false면 일시적으로 커버 해제(예: 모달 닫힘 애니메이션 중). 기본 true.
 */
export function useImmersive(active = true) {
  useEffect(() => {
    if (!active || !isInApp()) {
      return
    }
    coverCount += 1
    sync()
    return () => {
      coverCount -= 1
      sync()
    }
  }, [active])
}
