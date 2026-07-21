import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import {
  clampSheetDvhTo,
  getSheetDetentsDvh,
  parseSheetDvh,
  projectSheetDetentDvh,
  SHEET_MAX_HEIGHT_CSS,
  SHEET_MIN_HEIGHT_CSS,
  toSheetDvh,
} from './sheetHeight'
import { useSheetBounds } from './useSheetBounds'

interface UseResultListOverlayParams {
  currentHeight: string
  itemIds: string[]
  selectedId?: string | null
  onHeightChange: (height: string) => void
}

type DragStart = {
  pointerId: number
  startY: number
  startHeightPx: number
  // 속도(플릭) 추정용 최근 표본과 누적 속도(dvh/ms, +면 확장 방향)
  lastY: number
  lastTime: number
  velocityDvhPerMs: number
}

// 리스트 최상단에서 시작한 제스처를 시트 드래그로 승격시키기 위한 후보 정보
type ContentDragCandidate = {
  pointerId: number
  startY: number
  startTime: number
  engaged: boolean
}

// 키보드 화살표 1회당 높이 변화량(dvh)
const KEYBOARD_STEP_DVH = 10
// 시트 높이 속도 평활(EMA) 계수(0~1). 클수록 순간적으로 튀는 속도에 둔감하다.
const SHEET_VELOCITY_SMOOTHING = 0.6
// 이 시간(ms)보다 오래 손이 멈춘 뒤 놓으면 플릭이 아니라 '정지 후 놓기'로 보고 속도를 0으로 처리한다.
const SHEET_VELOCITY_STILL_MS = 100
// 리스트 최상단에서 아래로 이만큼(px) 끌면 네이티브 스크롤 대신 시트 접기로 전환한다.
const SHEET_CONTENT_DRAG_THRESHOLD_PX = 8

const getViewportHeight = () => window.visualViewport?.height || window.innerHeight

const dvhToPx = (dvh: number) => (dvh / 100) * getViewportHeight()

const pxToDvh = (px: number) => (px / getViewportHeight()) * 100

export const useResultListOverlay = ({
  currentHeight,
  itemIds,
  onHeightChange,
  selectedId,
}: UseResultListOverlayParams) => {
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())
  const dragStartRef = useRef<DragStart | null>(null)
  const contentDragRef = useRef<ContentDragCandidate | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragHeightDvh, setDragHeightDvh] = useState(() => parseSheetDvh(currentHeight))

  // 시트 높이의 하한(손잡이+필터 헤더)·상한(검색바 아래)을 측정. 화면 크기에 따라 달라진다.
  // 리사이즈 때만 바뀌므로, 드래그 콜백이 이 값을 의존성으로 받아도 드래그 도중엔 안정적으로 유지된다.
  const { minDvh, maxDvh } = useSheetBounds()
  const detents = useMemo(() => getSheetDetentsDvh(minDvh, maxDvh), [minDvh, maxDvh])

  const itemIdsKey = useMemo(() => itemIds.join('|'), [itemIds])
  // 드래그 중이 아니어도(프로그램 값 등) 하한/상한을 벗어나지 않도록 렌더 높이를 클램프한다.
  const activeHeightDvh = clampSheetDvhTo(isDragging ? dragHeightDvh : parseSheetDvh(currentHeight), minDvh, maxDvh)
  // 최소 높이(하한 근처)에선 필터 헤더까지만 보이고 리스트는 렌더링하지 않는다.
  const isListCollapsed = activeHeightDvh <= minDvh + 1

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      // 렌더 높이도 CSS 하한/상한으로 감싼다 — 측정 지연·반올림·초기 프레임에도 필터 헤더는 보이고 검색바는 안 넘게.
      height: `clamp(${SHEET_MIN_HEIGHT_CSS}, ${activeHeightDvh}dvh, ${SHEET_MAX_HEIGHT_CSS})`,
      transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
    [activeHeightDvh, isDragging],
  )

  const registerItemRef = useCallback((id: string) => {
    return (node: unknown) => {
      if (node instanceof HTMLElement) {
        itemRefs.current.set(id, node)
        return
      }

      itemRefs.current.delete(id)
    }
  }, [])

  // 드래그 시작: 앵커(startY/시작 높이)와 속도 추정 표본을 초기화한다.
  const beginDrag = useCallback(
    (startY: number, pointerId: number, startTime: number) => {
      // 앵커를 '보이는' 높이(하한/상한 클램프 반영)로 잡아, 경계에서 끌 때 데드존이 생기지 않게 한다.
      const startHeightDvh = clampSheetDvhTo(parseSheetDvh(currentHeight), minDvh, maxDvh)

      dragStartRef.current = {
        pointerId,
        startY,
        startHeightPx: dvhToPx(startHeightDvh),
        lastY: startY,
        lastTime: startTime,
        velocityDvhPerMs: 0,
      }

      setIsDragging(true)
      setDragHeightDvh(startHeightDvh)
    },
    [currentHeight, minDvh, maxDvh],
  )

  // 드래그 종료: 놓은 높이에 릴리스 속도를 반영해 가장 가까운 detent로 스냅한다.
  const finishDrag = useCallback(
    (heightDvh: number, velocityDvhPerMs: number) => {
      const snappedDvh = projectSheetDetentDvh(heightDvh, velocityDvhPerMs, detents)

      setIsDragging(false)
      setDragHeightDvh(snappedDvh)
      onHeightChange(toSheetDvh(snappedDvh))
      dragStartRef.current = null
    },
    [detents, onHeightChange],
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      beginDrag(event.clientY, event.pointerId, event.timeStamp)
    },
    [beginDrag],
  )

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const dragStart = dragStartRef.current

    if (!dragStart || dragStart.pointerId !== event.pointerId) {
      return
    }

    // 최근 표본과의 차이로 순간 속도를 구해 EMA로 누적한다(위로 끌면 +).
    const elapsed = event.timeStamp - dragStart.lastTime

    if (elapsed > 0) {
      const instantaneousVelocity = pxToDvh(dragStart.lastY - event.clientY) / elapsed
      dragStart.velocityDvhPerMs =
        dragStart.velocityDvhPerMs * SHEET_VELOCITY_SMOOTHING +
        instantaneousVelocity * (1 - SHEET_VELOCITY_SMOOTHING)
      dragStart.lastY = event.clientY
      dragStart.lastTime = event.timeStamp
    }

    const nextHeightPx = dragStart.startHeightPx + dragStart.startY - event.clientY
    setDragHeightDvh(clampSheetDvhTo(pxToDvh(nextHeightPx), minDvh, maxDvh))
  }, [minDvh, maxDvh])

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const dragStart = dragStartRef.current

      if (!dragStart || dragStart.pointerId !== event.pointerId) {
        return
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      // 손이 멈춘 채로 놓았으면(표본이 오래됨) 플릭이 아니라 정지로 보고 속도를 버린다.
      const isStale = event.timeStamp - dragStart.lastTime > SHEET_VELOCITY_STILL_MS
      const nextHeightPx = dragStart.startHeightPx + dragStart.startY - event.clientY
      finishDrag(pxToDvh(nextHeightPx), isStale ? 0 : dragStart.velocityDvhPerMs)
    },
    [finishDrag],
  )

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const dragStart = dragStartRef.current

      if (!dragStart || dragStart.pointerId !== event.pointerId) {
        return
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      finishDrag(pxToDvh(dragStart.startHeightPx), 0)
    },
    [finishDrag],
  )

  // 리스트 콘텐츠 제스처: 기본은 네이티브 스크롤에 맡기고,
  // 최상단에서 아래로 끌 때만 시트 드래그(접기)로 승격시킨다.
  const handleContentPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    contentDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startTime: event.timeStamp,
      engaged: false,
    }
  }, [])

  const handleContentPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const candidate = contentDragRef.current

      if (!candidate || candidate.pointerId !== event.pointerId) {
        return
      }

      if (candidate.engaged) {
        handlePointerMove(event)
        return
      }

      const movedDown = event.clientY - candidate.startY
      const isAtTop = event.currentTarget.scrollTop <= 0

      // 최상단 + 아래로 임계값 이상 끌었을 때만 시트 드래그로 승격(그 외엔 네이티브 스크롤 유지).
      if (isAtTop && movedDown > SHEET_CONTENT_DRAG_THRESHOLD_PX) {
        candidate.engaged = true
        event.currentTarget.setPointerCapture(event.pointerId)
        beginDrag(candidate.startY, event.pointerId, candidate.startTime)
        handlePointerMove(event)
      }
    },
    [beginDrag, handlePointerMove],
  )

  const handleContentPointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const candidate = contentDragRef.current

      if (!candidate || candidate.pointerId !== event.pointerId) {
        return
      }

      contentDragRef.current = null

      if (candidate.engaged) {
        handlePointerUp(event)
      }
    },
    [handlePointerUp],
  )

  const handleContentPointerCancel = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const candidate = contentDragRef.current

      if (!candidate || candidate.pointerId !== event.pointerId) {
        return
      }

      contentDragRef.current = null

      if (candidate.engaged) {
        handlePointerCancel(event)
      }
    },
    [handlePointerCancel],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        onHeightChange(toSheetDvh(clampSheetDvhTo(parseSheetDvh(currentHeight) + KEYBOARD_STEP_DVH, minDvh, maxDvh)))
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        onHeightChange(toSheetDvh(clampSheetDvhTo(parseSheetDvh(currentHeight) - KEYBOARD_STEP_DVH, minDvh, maxDvh)))
      }
    },
    [currentHeight, minDvh, maxDvh, onHeightChange],
  )

  useEffect(() => {
    if (!selectedId) {
      return
    }

    const selectedItem = itemRefs.current.get(selectedId)

    if (!selectedItem) {
      return
    }

    const scrollSelectedItem = () => {
      selectedItem.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
    }
    const frameId = window.requestAnimationFrame(scrollSelectedItem)
    const transitionFallbackId = window.setTimeout(scrollSelectedItem, 320)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(transitionFallbackId)
    }
  }, [itemIdsKey, selectedId])

  return {
    containerStyle,
    activeHeightDvh,
    isListCollapsed,
    dragHandleProps: {
      role: 'slider',
      tabIndex: 0,
      'aria-label': '검색 결과 시트 높이 조절',
      'aria-orientation': 'vertical' as const,
      'aria-valuemin': Math.round(minDvh),
      'aria-valuemax': Math.round(maxDvh),
      'aria-valuenow': Math.round(activeHeightDvh),
      onKeyDown: handleKeyDown,
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    contentDragProps: {
      onPointerCancel: handleContentPointerCancel,
      onPointerDown: handleContentPointerDown,
      onPointerMove: handleContentPointerMove,
      onPointerUp: handleContentPointerUp,
    },
    registerItemRef,
  }
}
