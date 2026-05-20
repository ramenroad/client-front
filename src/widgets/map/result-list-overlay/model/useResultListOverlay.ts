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
import { MAP_RESULT_SHEET_HEIGHT_VALUES, MAP_RESULT_SHEET_HEIGHTS, type MapResultSheetHeight } from './sheetHeight'

interface UseResultListOverlayParams {
  currentHeight: MapResultSheetHeight
  itemIds: string[]
  selectedId?: string | null
  onHeightChange: (height: MapResultSheetHeight) => void
}

type DragStart = {
  pointerId: number
  startY: number
  startHeightPx: number
}

const getViewportHeight = () => window.visualViewport?.height || window.innerHeight

const dvhToPx = (dvh: string) => {
  const dvhValue = parseFloat(dvh.replace('dvh', ''))
  return (dvhValue / 100) * getViewportHeight()
}

const pxToDvh = (px: number) => `${(px / getViewportHeight()) * 100}dvh`

const clampSheetHeightPx = (heightPx: number) => {
  const minHeightPx = dvhToPx(MAP_RESULT_SHEET_HEIGHTS.COLLAPSED)
  const maxHeightPx = dvhToPx(MAP_RESULT_SHEET_HEIGHTS.EXPANDED)

  return Math.max(minHeightPx, Math.min(maxHeightPx, heightPx))
}

const getClosestSheetHeight = (heightPx: number) => {
  const closestHeight = MAP_RESULT_SHEET_HEIGHT_VALUES.reduce((closest, height) => {
    const closestDistance = Math.abs(dvhToPx(closest) - heightPx)
    const nextDistance = Math.abs(dvhToPx(height) - heightPx)

    return nextDistance < closestDistance ? height : closest
  }, MAP_RESULT_SHEET_HEIGHTS.COLLAPSED)

  return closestHeight
}

const getNextHeight = (currentHeight: MapResultSheetHeight) => {
  const currentIndex = MAP_RESULT_SHEET_HEIGHT_VALUES.indexOf(currentHeight)
  const nextIndex = Math.min(currentIndex + 1, MAP_RESULT_SHEET_HEIGHT_VALUES.length - 1)

  return MAP_RESULT_SHEET_HEIGHT_VALUES[nextIndex]
}

const getPreviousHeight = (currentHeight: MapResultSheetHeight) => {
  const currentIndex = MAP_RESULT_SHEET_HEIGHT_VALUES.indexOf(currentHeight)
  const nextIndex = Math.max(currentIndex - 1, 0)

  return MAP_RESULT_SHEET_HEIGHT_VALUES[nextIndex]
}

export const useResultListOverlay = ({
  currentHeight,
  itemIds,
  onHeightChange,
  selectedId,
}: UseResultListOverlayParams) => {
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())
  const dragStartRef = useRef<DragStart | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragHeight, setDragHeight] = useState<MapResultSheetHeight | string>(currentHeight)

  const itemIdsKey = useMemo(() => itemIds.join('|'), [itemIds])
  const activeHeight = isDragging ? dragHeight : currentHeight

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      height: activeHeight,
      transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
    [activeHeight, isDragging],
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
    (heightPx: number) => {
      const closestHeight = getClosestSheetHeight(heightPx)

      setIsDragging(false)
      setDragHeight(closestHeight)
      onHeightChange(closestHeight)
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
        startHeightPx: dvhToPx(currentHeight),
      }

      setIsDragging(true)
      setDragHeight(currentHeight)
    },
    [currentHeight],
  )

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const dragStart = dragStartRef.current

    if (!dragStart || dragStart.pointerId !== event.pointerId) {
      return
    }

    const nextHeightPx = clampSheetHeightPx(dragStart.startHeightPx + dragStart.startY - event.clientY)
    setDragHeight(pxToDvh(nextHeightPx))
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

      const nextHeightPx = clampSheetHeightPx(dragStart.startHeightPx + dragStart.startY - event.clientY)
      finishDrag(nextHeightPx)
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

      finishDrag(dragStart.startHeightPx)
    },
    [finishDrag],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        onHeightChange(getNextHeight(currentHeight))
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        onHeightChange(getPreviousHeight(currentHeight))
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
    dragHandleProps: {
      role: 'button',
      tabIndex: 0,
      'aria-label': '검색 결과 시트 높이 조절',
      onKeyDown: handleKeyDown,
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    registerItemRef,
  }
}
