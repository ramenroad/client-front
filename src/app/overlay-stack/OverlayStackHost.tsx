import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { router } from '@/app/router'
import { useImmersive } from '@/shared/app-env'
import { isOverlayPath, overlayStackStore, useOverlayLayers, type OverlayLayer } from '@/shared/overlay-stack'
import { LoadingLottie } from '@/shared/ui/lottie'
import render from '@/shared/ui/render'
import { useEdgeSwipeBack } from './useEdgeSwipeBack'

// 라우터(index.tsx)와 동일 specifier — Vite가 같은 청크로 디듀프하므로 번들 중복 없음.
const MyCalendarPage = lazy(() => import('@/pages/my-calendar'))
const CommunityDetailPage = lazy(() => import('@/pages/community-detail'))
const CommunityWritePage = lazy(() => import('@/pages/community-write'))

/** 레이어 내부 히스토리의 바닥 엔트리 — 여기로 pop되면(TopBar의 navigate(-1) 등) "레이어 닫기"로 해석한다. */
const SENTINEL_PATH = '/__overlay-close__'

/** 센티널 도달 = 페이지 자체 뒤로가기 → 최상단 레이어 닫힘 시작. requestPop이 멱등이라 StrictMode 안전. */
const SentinelClose = () => {
  useEffect(() => {
    overlayStackStore.requestPop()
  }, [])
  return null
}

/**
 * 레이어 내부에서 오버레이 라우트 밖으로 나가는 네비게이션의 탈출구(캐치올 '*').
 * - 다른 오버레이 경로(상세→글수정 push, 글등록→상세 replace): 스택 조작으로 변환.
 * - 그 외(/detail·/login 등): 레이어 전부 닫고 실제 라우터로 전달 — 베이스가 같은 경로면 닫기만 한다.
 * 페이지 코드는 일반 useNavigate를 그대로 쓰면 되고, 여기서 의미를 복원한다.
 */
const EscapeForwarder = () => {
  const location = useLocation()
  const navigationType = useNavigationType()
  const innerNavigate = useNavigate()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) {
      return
    }
    handledRef.current = true

    const target = `${location.pathname}${location.search}`

    if (isOverlayPath(target)) {
      if (navigationType === 'REPLACE') {
        overlayStackStore.replaceTop(target)
        return
      }
      overlayStackStore.push(target)
      innerNavigate(-1) // 이 레이어는 '*'에 머물지 않고 원래 화면으로 복귀(새 레이어가 닫혔을 때 대비)
      return
    }

    overlayStackStore.clear()
    const base = router.state.location
    if (`${base.pathname}${base.search}` !== target) {
      router.navigate(target).catch(() => undefined)
    }
  }, [innerNavigate, location.pathname, location.search, navigationType])

  return null
}

/** 레이어 내부 라우팅(캘린더 날짜 쿼리 등)을 스택 경로에 반영 — replaceState URL/새로고침 복원 정확도 유지. */
const LayerLocationSync = ({ layerKey }: { layerKey: number }) => {
  const location = useLocation()

  useEffect(() => {
    const path = `${location.pathname}${location.search}`
    if (isOverlayPath(path)) {
      overlayStackStore.updatePath(layerKey, path)
    }
  }, [layerKey, location.pathname, location.search])

  return null
}

const OverlayLayerRoutes = ({ layer }: { layer: OverlayLayer }) => (
  <MemoryRouter initialEntries={[SENTINEL_PATH, layer.path]} initialIndex={1}>
    <LayerLocationSync layerKey={layer.key} />
    <Suspense
      fallback={
        <LayerFallback>
          <LoadingLottie />
        </LayerFallback>
      }
    >
      <Routes>
        <Route path={SENTINEL_PATH} element={<SentinelClose />} />
        <Route path="/my-calendar" element={<MyCalendarPage />} />
        <Route path="/community/write" element={<CommunityWritePage />} />
        <Route path="/community/write/:id" element={<CommunityWritePage />} />
        <Route path="/community/:id" element={<CommunityDetailPage />} />
        <Route path="*" element={<EscapeForwarder />} />
      </Routes>
    </Suspense>
  </MemoryRouter>
)

interface OverlayLayerPanelProps {
  layer: OverlayLayer
  isTop: boolean
}

const OverlayLayerPanel = ({ layer, isTop }: OverlayLayerPanelProps) => {
  useImmersive() // 라우트 모드(OverlayLayout)와 동일하게 마운트 동안 네이티브 탭바를 덮는다.
  const panelRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  // OverlayLayout과 동일한 push 진입 — 다음 프레임에 enter로 전환해 오른쪽에서 밀려 들어온다.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // 닫힘: data-entered=false로 되밀고 transitionend에 실제 제거(스와이프 커밋은 훅이 직접 finalize).
  useEffect(() => {
    if (!layer.closing) {
      return
    }
    const panel = panelRef.current
    if (!panel) {
      overlayStackStore.finalizePop(layer.key)
      return
    }
    panel.style.transition = ''
    panel.style.transform = '' // 드래그 잔여 인라인 값 제거 → 클래스 전환 규칙으로 복귀
    const finalize = () => overlayStackStore.finalizePop(layer.key)
    panel.addEventListener('transitionend', finalize, { once: true })
    const timer = window.setTimeout(finalize, 400) // transitionend 유실 대비
    return () => {
      panel.removeEventListener('transitionend', finalize)
      window.clearTimeout(timer)
    }
  }, [layer.closing, layer.key])

  useEdgeSwipeBack(panelRef, {
    enabled: isTop && !layer.closing,
    onCommit: () => overlayStackStore.finalizePop(layer.key),
  })

  return (
    <Panel ref={panelRef} data-entered={entered && !layer.closing} data-closing={layer.closing}>
      <OverlayLayerRoutes layer={layer} />
    </Panel>
  )
}

/**
 * 오버레이 레이어 호스트 (G6) — 앱(브리지 연결)에서 /my-calendar·/community/:id·/community/write(:id)를
 * 라우트 스왑 대신 베이스 화면 위 레이어로 렌더한다. 베이스는 산 채로 밑에 남아 자체 엣지 스와이프가
 * 라이브 화면을 드러낸다. 순수 웹은 useOverlayNavigate 폴백으로 레이어가 생기지 않아 항상 비어 있다.
 * RouterProvider 밖에 마운트되며(레이어는 자체 MemoryRouter 보유), Query/Toast/Popup 컨텍스트 안이어야 한다.
 */
export const OverlayStackHost = () => {
  const layers = useOverlayLayers()

  if (layers.length === 0) {
    return null
  }

  return (
    <>
      {layers.map((layer, index) => (
        <OverlayLayerPanel key={layer.key} layer={layer} isTop={index === layers.length - 1} />
      ))}
    </>
  )
}

// OverlayLayout(라우트 모드)과 동일 시각 사양 + 스크롤 체이닝 차단(overscroll) — z-55: Popup(200)/Toast(150) 아래, 페이지 위.
const Panel = render.div(
  'fixed inset-0 z-[55] flex translate-x-full flex-col overflow-y-auto overscroll-y-contain bg-background pt-[var(--safe-top)] transition-transform duration-300 ease-out data-[entered=true]:translate-x-0 data-[closing=true]:pointer-events-none',
)

const LayerFallback = render.div('flex flex-1 flex-col items-center justify-center')
