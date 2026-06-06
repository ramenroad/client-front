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
  clampSheetDvh,
  MAP_RESULT_SHEET_COLLAPSE_DVH,
  MAP_RESULT_SHEET_MAX_DVH,
  MAP_RESULT_SHEET_MIN_DVH,
  parseSheetDvh,
  toSheetDvh,
} from './sheetHeight'

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
}

// 키보드 화살표 1회당 높이 변화량(dvh)
const KEYBOARD_STEP_DVH = 10

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
  const [isDragging, setIsDragging] = useState(false)
  const [dragHeightDvh, setDragHeightDvh] = useState(() => parseSheetDvh(currentHeight))

  const itemIdsKey = useMemo(() => itemIds.join('|'), [itemIds])
  const activeHeightDvh = isDragging ? dragHeightDvh : parseSheetDvh(currentHeight)
  const isContentCollapsed = activeHeightDvh <= MAP_RESULT_SHEET_COLLAPSE_DVH

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      height: `${activeHeightDvh}dvh`,
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

  const finishDrag = useCallback(
    (heightDvh: number) => {
      const clampedDvh = clampSheetDvh(heightDvh)

      setIsDragging(false)
      setDragHeightDvh(clampedDvh)
      onHeightChange(toSheetDvh(clampedDvh))
      dragStartRef.current = null
    },
    [onHeightChange],
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)

      dragStartRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startHeightPx: dvhToPx(parseSheetDvh(currentHeight)),
      }

      setIsDragging(true)
      setDragHeightDvh(parseSheetDvh(currentHeight))
    },
    [currentHeight],
  )

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const dragStart = dragStartRef.current

    if (!dragStart || dragStart.pointerId !== event.pointerId) {
      return
    }

    const nextHeightPx = dragStart.startHeightPx + dragStart.startY - event.clientY
    setDragHeightDvh(clampSheetDvh(pxToDvh(nextHeightPx)))
  }, [])

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const dragStart = dragStartRef.current

      if (!dragStart || dragStart.pointerId !== event.pointerId) {
        return
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      const nextHeightPx = dragStart.startHeightPx + dragStart.startY - event.clientY
      finishDrag(pxToDvh(nextHeightPx))
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

      finishDrag(pxToDvh(dragStart.startHeightPx))
    },
    [finishDrag],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        onHeightChange(toSheetDvh(clampSheetDvh(parseSheetDvh(currentHeight) + KEYBOARD_STEP_DVH)))
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        onHeightChange(toSheetDvh(clampSheetDvh(parseSheetDvh(currentHeight) - KEYBOARD_STEP_DVH)))
      }
    },
    [currentHeight, onHeightChange],
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
    isContentCollapsed,
    dragHandleProps: {
      role: 'slider',
      tabIndex: 0,
      'aria-label': '검색 결과 시트 높이 조절',
      'aria-orientation': 'vertical' as const,
      'aria-valuemin': MAP_RESULT_SHEET_MIN_DVH,
      'aria-valuemax': MAP_RESULT_SHEET_MAX_DVH,
      'aria-valuenow': Math.round(activeHeightDvh),
      onKeyDown: handleKeyDown,
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    registerItemRef,
  }
}
