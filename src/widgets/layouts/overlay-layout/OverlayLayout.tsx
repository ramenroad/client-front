import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useImmersive } from '@/shared/app-env'
import render from '@/shared/ui/render'

/**
 * 오버레이 레이아웃 — 라멘 캘린더처럼 "특정 탭의 하위 페이지"가 아니라 앱 위에 새 창처럼 떠야 하는 화면용.
 * AppBarLayout 자식이 아니라 단독 라우트로 두어 의미상 독립 화면이 되고,
 * useImmersive로 네이티브 하단 탭바까지 덮어 화면을 가득 채운다. 닫기는 페이지 자체 TopBar(뒤로가기).
 */
const OverlayLayout = () => {
  useImmersive() // 마운트 동안 네이티브 탭바를 덮어 숨김. 순수 웹/구버전 앱에선 no-op.
  const [entered, setEntered] = useState(false)

  // 다음 프레임에 enter 상태로 전환 → 슬라이드업 등장(새 창이 올라오는 느낌).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <Panel data-entered={entered}>
      <Outlet />
    </Panel>
  )
}

// Popup(zIndex 200)/Toast(z-150)는 body 포털로 위에 뜨므로 그 아래(z-55)에 둔다 — 페이지/웹 AppBar(z-40) 위.
// fixed라 #root의 상단 안전영역 패딩을 못 받으므로 자체적으로 pt-[--safe-top]을 준다(앱에서만 실값).
const Panel = render.div(
  'fixed inset-0 z-[55] flex translate-y-full flex-col overflow-y-auto bg-background pt-[var(--safe-top)] transition-transform duration-300 ease-out data-[entered=true]:translate-y-0',
)

export default OverlayLayout
