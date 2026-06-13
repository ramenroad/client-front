import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { MyBookmark } from '../model/types'
import { bookmarkQueryKeys } from './query-keys'
import { bookmarkApi } from './requests'

export function useMyBookmarksQuery(options?: ApiQueryOptions<MyBookmark[]>) {
  return useApiQuery<MyBookmark[]>({
    queryKey: bookmarkQueryKeys.my(),
    queryFn: bookmarkApi.getMyBookmarks,
    ...options,
  })
}
