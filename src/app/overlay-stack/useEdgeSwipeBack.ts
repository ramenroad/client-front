import { useEffect, type RefObject } from 'react'

// iOS 관성 감각에 맞춘 임계값 — 폭 1/3 이상 끌었거나 빠르게 튕기면 닫힘으로 커밋.
const EDGE_START_ZONE_PX = 28
const DIRECTION_LOCK_PX = 10
const COMMIT_DISTANCE_RATIO = 0.34
const COMMIT_VELOCITY_PX_PER_MS = 0.55
const SETTLE_TRANSITION = 'transform 240ms ease-out'
const SETTLE_FALLBACK_MS = 320

interface EdgeSwipeBackOptions {
  enabled: boolean
  /** 커밋 확정(패널이 화면 밖까지 밀려난 뒤) 시 호출 — 호출부가 레이어를 실제 제거한다. */
  onCommit: () => void
}

/**
 * iOS 스타일 엣지 스와이프 백 (G6) — 왼쪽 가장자리에서 시작한 수평 드래그로 레이어 패널을 밀어 닫는다.
 * 드러나는 건 스냅샷이 아니라 레이어 밑에 살아있는 베이스 화면. 오버레이는 히스토리를 늘리지 않으므로
 * WKWebView 네이티브 back 제스처(back 항목 필요)와 충돌하지 않는다.
 * 세로 스크롤과의 경합은 방향 잠금(수평 우세일 때만 드래그 시작 + preventDefault)으로 해소한다.
 */
export function useEdgeSwipeBack(panelRef: RefObject<HTMLElement | null>, { enabled, onCommit }: EdgeSwipeBackOptions) {
  useEffect(() => {
    const panel = panelRef.current
    if (!enabled || !panel) {
      return
    }

    let tracking = false
    let dragging = false
    let startX = 0
    let startY = 0
    // 플릭 판정용 최근 두 샘플(전체 평균은 마지막 튕김을 과소평가한다).
    let lastX = 0
    let lastTime = 0
    let prevX = 0
    let prevTime = 0
    let settleTimer: number | null = null

    const settle = (transform: string, done?: () => void) => {
      let finished = false
      const finish = () => {
        if (finished) {
          return
        }
        finished = true
        panel.removeEventListener('transitionend', finish)
        if (settleTimer != null) {
          window.clearTimeout(settleTimer)
          settleTimer = null
        }
        done?.()
      }
      panel.style.transition = SETTLE_TRANSITION
      panel.style.transform = transform
      panel.addEventListener('transitionend', finish, { once: true })
      settleTimer = window.setTimeout(finish, SETTLE_FALLBACK_MS) // transitionend 유실 대비
    }

    const clearInlineStyles = () => {
      panel.style.transition = ''
      panel.style.transform = ''
    }

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (event.touches.length !== 1 || !touch || touch.clientX > EDGE_START_ZONE_PX) {
        return
      }
      tracking = true
      dragging = false
      startX = lastX = prevX = touch.clientX
      startY = touch.clientY
      lastTime = prevTime = performance.now()
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!tracking || !touch) {
        return
      }
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY

      if (!dragging) {
        if (Math.abs(dy) > DIRECTION_LOCK_PX && Math.abs(dy) >= Math.abs(dx)) {
          tracking = false // 세로 스크롤 의도 — 이 터치는 포기
          return
        }
        if (dx <= DIRECTION_LOCK_PX || Math.abs(dx) <= Math.abs(dy)) {
          return
        }
        dragging = true
        panel.style.transition = 'none'
      }

      event.preventDefault() // 드래그 확정 후에만 스크롤 차단(passive: false 필요)
      panel.style.transform = `translateX(${Math.max(0, dx)}px)`
      prevX = lastX
      prevTime = lastTime
      lastX = touch.clientX
      lastTime = performance.now()
    }

    const handleTouchEnd = () => {
      if (!tracking) {
        return
      }
      tracking = false
      if (!dragging) {
        return
      }
      dragging = false

      const distance = lastX - startX
      const velocity = (lastX - prevX) / Math.max(1, lastTime - prevTime)
      const shouldCommit = distance > panel.offsetWidth * COMMIT_DISTANCE_RATIO || velocity > COMMIT_VELOCITY_PX_PER_MS

      if (shouldCommit) {
        settle('translateX(100%)', onCommit)
      } else {
        settle('translateX(0px)', clearInlineStyles)
      }
    }

    const handleTouchCancel = () => {
      if (!tracking) {
        return
      }
      tracking = false
      if (dragging) {
        dragging = false
        settle('translateX(0px)', clearInlineStyles)
      }
    }

    panel.addEventListener('touchstart', handleTouchStart, { passive: true })
    panel.addEventListener('touchmove', handleTouchMove, { passive: false })
    panel.addEventListener('touchend', handleTouchEnd)
    panel.addEventListener('touchcancel', handleTouchCancel)

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart)
      panel.removeEventListener('touchmove', handleTouchMove)
      panel.removeEventListener('touchend', handleTouchEnd)
      panel.removeEventListener('touchcancel', handleTouchCancel)
      if (settleTimer != null) {
        window.clearTimeout(settleTimer)
      }
    }
  }, [enabled, onCommit, panelRef])
}
