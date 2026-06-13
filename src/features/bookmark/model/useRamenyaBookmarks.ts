import { useMemo, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ramenyaQueryKeys } from '@/entities/ramenya/api'
import { useAuthSession } from '@/entities/session/model'
import { useToast } from '@/shared/ui/toast'
import {
  bookmarkQueryKeys,
  useAddBookmarkMutation,
  useMyBookmarksQuery,
  useRemoveBookmarkMutation,
} from '../api'
import type { MyBookmark } from './types'

type BookmarkSnapshot = MyBookmark[] | undefined

const createOptimisticBookmark = (ramenyaId: string): MyBookmark => ({
  _id: `optimistic-${ramenyaId}`,
  user: '',
  ramenya: {
    _id: ramenyaId,
    name: '',
    genre: [],
    rating: 0,
    reviewCount: 0,
  },
  createdAt: new Date().toISOString(),
})

/** 내 저장 매장 목록을 단일 소스로 두고, 저장/해제를 낙관적으로 토글한다. */
export const useRamenyaBookmarks = () => {
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const { isSignIn } = useAuthSession()
  const myBookmarksQuery = useMyBookmarksQuery({ enabled: isSignIn })
  const pendingIdsRef = useRef(new Set<string>())

  const bookmarkedIds = useMemo(
    () => new Set((myBookmarksQuery.data ?? []).map((bookmark) => bookmark.ramenya._id)),
    [myBookmarksQuery.data],
  )

  // 저장한 매장 목록(최신순). 낙관적 추가 stub은 위치 정보가 없어 지도/목록 소비처에서 걸러진다.
  const bookmarkedRamenyas = useMemo(
    () => (myBookmarksQuery.data ?? []).map((bookmark) => bookmark.ramenya),
    [myBookmarksQuery.data],
  )

  const applyOptimisticBookmark = async (ramenyaId: string, nextBookmarked: boolean) => {
    await queryClient.cancelQueries({ queryKey: bookmarkQueryKeys.my() })
    const previousBookmarks = queryClient.getQueryData<MyBookmark[]>(bookmarkQueryKeys.my())

    queryClient.setQueryData<MyBookmark[]>(bookmarkQueryKeys.my(), (bookmarks = []) => {
      const withoutTarget = bookmarks.filter((bookmark) => bookmark.ramenya._id !== ramenyaId)

      return nextBookmarked ? [createOptimisticBookmark(ramenyaId), ...withoutTarget] : withoutTarget
    })

    return previousBookmarks
  }

  const rollbackBookmarks = (previousBookmarks: BookmarkSnapshot) => {
    if (previousBookmarks) {
      queryClient.setQueryData(bookmarkQueryKeys.my(), previousBookmarks)
    }
  }

  const settleBookmark = (ramenyaId: string) => {
    pendingIdsRef.current.delete(ramenyaId)
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.my() })
    queryClient.invalidateQueries({ queryKey: ramenyaQueryKeys.detail(ramenyaId) })
  }

  const addBookmarkMutation = useAddBookmarkMutation<BookmarkSnapshot>({
    onMutate: (ramenyaId) => applyOptimisticBookmark(ramenyaId, true),
    onSuccess: () => {
      openToast('저장되었습니다')
    },
    onError: (_error, _ramenyaId, previousBookmarks) => {
      rollbackBookmarks(previousBookmarks)
      openToast('매장 저장에 실패했습니다.')
    },
    onSettled: (_data, _error, ramenyaId) => settleBookmark(ramenyaId),
  })

  const removeBookmarkMutation = useRemoveBookmarkMutation<BookmarkSnapshot>({
    onMutate: (ramenyaId) => applyOptimisticBookmark(ramenyaId, false),
    onSuccess: () => {
      openToast('저장이 해제되었습니다')
    },
    onError: (_error, _ramenyaId, previousBookmarks) => {
      rollbackBookmarks(previousBookmarks)
      openToast('매장 저장 해제에 실패했습니다.')
    },
    onSettled: (_data, _error, ramenyaId) => settleBookmark(ramenyaId),
  })

  const toggleBookmark = (ramenyaId: string) => {
    if (!ramenyaId || !isSignIn || pendingIdsRef.current.has(ramenyaId)) {
      return
    }

    pendingIdsRef.current.add(ramenyaId)

    if (bookmarkedIds.has(ramenyaId)) {
      removeBookmarkMutation.mutate(ramenyaId)
    } else {
      addBookmarkMutation.mutate(ramenyaId)
    }
  }

  return {
    isSignIn,
    bookmarkedIds,
    bookmarkedRamenyas,
    isBookmarksLoading: myBookmarksQuery.isLoading,
    toggleBookmark,
  }
}
