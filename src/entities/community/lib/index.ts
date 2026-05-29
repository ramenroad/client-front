import type { CommunityBoardSummary } from '@/entities/community/model'

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

const formatDateLabel = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}.${month}.${day}`
}

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

  return formatDateLabel(new Date(targetTime))
}

export const getCommunityBoardPopularityScore = (
  board: Pick<CommunityBoardSummary, 'viewCount' | 'likeCount' | 'commentCount' | 'createdAt'>,
) => {
  const createdTime = board.createdAt ? new Date(board.createdAt).getTime() : Date.now()
  const diffDays = Math.floor((Date.now() - createdTime) / DAY_MS)
  const freshness = Math.max(1, 30 - diffDays)

  return board.commentCount * 12 + board.likeCount * 8 + board.viewCount + freshness
}
