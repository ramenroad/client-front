import type { Notice } from '../model'

const NEW_BADGE_THRESHOLD_DAYS = 7
const DAY_IN_MS = 24 * 60 * 60 * 1000

// 작성일이 최근 N일 이내이면 '새 글(N)' 뱃지를 노출한다.
export const isNewNotice = (createdAt?: string) => {
  if (!createdAt) {
    return false
  }

  const created = new Date(createdAt).getTime()

  if (Number.isNaN(created)) {
    return false
  }

  const elapsed = Date.now() - created

  return elapsed >= 0 && elapsed <= NEW_BADGE_THRESHOLD_DAYS * DAY_IN_MS
}

// 서버가 정렬을 보장하지 않으므로 작성일 내림차순(최신순)으로 정렬한다.
export const sortNoticesByLatest = <T extends Pick<Notice, 'createdAt'>>(notices: T[]) =>
  [...notices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
