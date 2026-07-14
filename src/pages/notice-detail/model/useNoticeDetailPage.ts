import { useAppLocation, useAppParams } from '@/shared/navigation'
import { useNoticeQuery } from '@/entities/support/api'

export const useNoticeDetailPage = () => {
  const { id } = useAppParams<{ id: string }>()
  const { pathname } = useAppLocation()
  const { data, isLoading, isError } = useNoticeQuery(id ?? '')

  return {
    // 상세 응답에는 type이 없으므로 진입 경로로 헤더 타이틀을 구분한다.
    title: pathname.startsWith('/patch-note') ? '패치노트' : '공지사항',
    notice: data,
    isLoading,
    isError,
  }
}
