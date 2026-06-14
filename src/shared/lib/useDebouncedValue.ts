import { useEffect, useState } from 'react'

/**
 * 입력값이 delay(ms) 동안 더 바뀌지 않을 때까지 이전 값을 유지한다.
 * 자동완성처럼 매 키 입력마다 쿼리가 나가는 걸 막는 용도.
 */
export const useDebouncedValue = <T>(value: T, delay = 250): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay)

    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
