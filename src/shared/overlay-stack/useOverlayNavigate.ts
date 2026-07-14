import { useCallback } from 'react'
import { useNavigate, type NavigateOptions } from 'react-router-dom'
import { isInApp } from '@/shared/bridge'
import { isOverlayPath } from './patterns'
import { overlayStackStore } from './store'

/**
 * 오버레이 인지 네비게이션 (G6) — /my-calendar·/community/:id·/community/write(:id) 진입 전용.
 * - 앱(브리지 연결): 라우터 push 대신 레이어 push/replaceTop — 히스토리를 늘리지 않아
 *   iOS 스와이프 백 스냅샷 제스처가 발동하지 않고, 베이스 화면은 산 채로 레이어 밑에 유지된다.
 * - 순수 웹/구버전 앱: 기존 라우트 네비로 폴백(브라우저 제스처·딥링크 동작 유지).
 * 레이어 내부(MemoryRouter)에서 호출돼도 동일하게 동작한다 — 오버레이 경로면 스택 조작, 그 외엔
 * 내부 navigate → 캐치올 이스케이프로 외부 라우터에 전달된다.
 */
export function useOverlayNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (path: string, options?: NavigateOptions) => {
      if (isInApp() && isOverlayPath(path)) {
        if (options?.replace) {
          overlayStackStore.replaceTop(path)
        } else {
          overlayStackStore.push(path)
        }
        return
      }
      navigate(path, options)
    },
    [navigate],
  )
}
