import { formatFullDate } from '@/shared/lib/date'
import { IconArrowRight } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { isNewNotice } from '../lib'
import type { Notice } from '../model'
import { NewBadge } from './NewBadge'

interface NoticeListViewProps {
  notices: Notice[]
  isLoading: boolean
  isError: boolean
  hasMore: boolean
  emptyText?: string
  onItemClick: (noticeId: string) => void
  onLoadMore: () => void
}

export const NoticeListView = ({
  notices,
  isLoading,
  isError,
  hasMore,
  emptyText = '등록된 글이 없어요.',
  onItemClick,
  onLoadMore,
}: NoticeListViewProps) => {
  if (isLoading) {
    return <StateText>불러오는 중...</StateText>
  }

  if (isError) {
    return <StateText>목록을 불러오지 못했어요.</StateText>
  }

  if (notices.length === 0) {
    return <EmptyText>{emptyText}</EmptyText>
  }

  return (
    <List>
      {notices.map((notice) => (
        <Item key={notice._id} type="button" onClick={() => onItemClick(notice._id)}>
          <ItemTitle>{notice.title}</ItemTitle>
          <ItemMeta>
            <ItemDate>{formatFullDate(notice.createdAt)}</ItemDate>
            {isNewNotice(notice.createdAt) && <NewBadge />}
          </ItemMeta>
        </Item>
      ))}

      {hasMore && (
        <LoadMoreButton type="button" onClick={onLoadMore}>
          더보기
          <ChevronDown />
        </LoadMoreButton>
      )}
    </List>
  )
}

const List = render.div('flex w-full flex-col')

const Item = render.button(
  'flex w-full cursor-pointer flex-col items-start gap-8 border-0 border-b border-solid border-gray-100 bg-transparent px-0 py-20 text-left shadow-none outline-none',
)

const ItemTitle = render.span('line-clamp-2 break-words font-16-m text-gray-900')

const ItemMeta = render.div('flex items-center gap-6')

const ItemDate = render.span('font-14-r text-gray-400')

const LoadMoreButton = render.button(
  'flex h-56 w-full cursor-pointer items-center justify-center gap-4 border-0 bg-transparent font-14-r text-gray-500 shadow-none outline-none',
)

const ChevronDown = render.extend(IconArrowRight, 'rotate-90')

const StateText = render.div('flex min-h-200 items-center justify-center font-16-m text-gray-400')

const EmptyText = render.div('flex min-h-200 items-center justify-center font-14-r text-gray-400')
