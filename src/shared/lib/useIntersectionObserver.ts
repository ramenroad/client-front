import { useEffect, useRef } from 'react'

type UseIntersectionObserverOptions = {
  onIntersect: () => void
  enabled?: boolean
  rootMargin?: string
  threshold?: number
}

export const useIntersectionObserver = ({
  onIntersect,
  enabled = true,
  rootMargin = '0px',
  threshold = 0.1,
}: UseIntersectionObserverOptions) => {
  const targetRef = useRef<HTMLDivElement>(null)
  const onIntersectRef = useRef(onIntersect)

  useEffect(() => {
    onIntersectRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    const target = targetRef.current

    if (!target || !enabled) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onIntersectRef.current()
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [enabled, rootMargin, threshold])

  return targetRef
}
