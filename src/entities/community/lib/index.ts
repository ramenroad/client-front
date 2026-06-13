import { formatFullDate } from '@/shared/lib/date'

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export const getRelativeTimeLabel = (dateString?: string) => {
  if (!dateString) {
    return ''
  }

  const targetTime = new Date(dateString).getTime()

  if (!Number.isFinite(targetTime)) {
    return ''
  }

  const diff = Date.now() - targetTime

  if (diff < MINUTE_MS) {
    return '방금 전'
  }

  if (diff < HOUR_MS) {
    return `${Math.floor(diff / MINUTE_MS)}분 전`
  }

  if (diff < DAY_MS) {
    return `${Math.floor(diff / HOUR_MS)}시간 전`
  }

  if (diff < 7 * DAY_MS) {
    return `${Math.floor(diff / DAY_MS)}일 전`
  }

  return formatFullDate(dateString)
}
