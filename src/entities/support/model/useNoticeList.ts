import { useMemo, useState } from 'react'
import { useNoticesQuery } from '../api'
import { sortNoticesByLatest } from '../lib'
import type { NoticeType } from './types'

const PAGE_SIZE = 10

// 공지사항/패치노트 목록을 최신순으로 정렬하고 '더보기' 페이지네이션을 관리한다.
export const useNoticeList = (type: NoticeType) => {
  const { data, isLoading, isError } = useNoticesQuery(type)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const notices = useMemo(() => sortNoticesByLatest(data ?? []), [data])

  return {
    visibleNotices: notices.slice(0, visibleCount),
    isLoading,
    isError,
    hasMore: notices.length > visibleCount,
    loadMore: () => setVisibleCount((count) => count + PAGE_SIZE),
  }
}
