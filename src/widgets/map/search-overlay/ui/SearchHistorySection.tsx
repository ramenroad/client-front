import { IconClose, IconComment, IconLocate } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface SearchHistoryItem {
  _id: string
  keyword: string
}

interface SearchHistorySectionProps {
  title: string
  items: SearchHistoryItem[]
  emptyMessage: string
  display: 'chip' | 'list'
  onClear: () => void
  onSelect: (item: SearchHistoryItem) => void
  onDelete: (item: SearchHistoryItem) => void
}

export const SearchHistorySection = ({
  title,
  items,
  emptyMessage,
  display,
  onClear,
  onSelect,
  onDelete,
}: SearchHistorySectionProps) => {
  return (
    <HistoryContainer>
      <HistoryHeader>
        <RaisingText size={16} weight="sb">
          {title}
        </RaisingText>
        <RemoveText size={12} weight="r" onClick={onClear}>
          전체 삭제
        </RemoveText>
      </HistoryHeader>

      {items.length === 0 ? (
        <NoHistoryWrapper>
          <IconComment />
          <NoHistoryText size={16} weight="r">
            {emptyMessage}
          </NoHistoryText>
        </NoHistoryWrapper>
      ) : display === 'chip' ? (
        <HistoryTagWrapper>
          {items.map((item) => (
            <KeywordHistoryTag key={item._id} onClick={() => onSelect(item)}>
              <RaisingText size={14} weight="r">
                {item.keyword}
              </RaisingText>
              <XIcon
                color="#A0A0A0"
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(item)
                }}
              />
            </KeywordHistoryTag>
          ))}
        </HistoryTagWrapper>
      ) : (
        <RamenyaHistoryWrapper>
          {items.map((item) => (
            <RamenyaHistoryRow key={item._id} onClick={() => onSelect(item)}>
              <IconLocate color="#A0A0A0" />
              <RaisingText size={16} weight="r">
                {item.keyword}
              </RaisingText>
              <RamenyaXIcon
                color="#A0A0A0"
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(item)
                }}
              />
            </RamenyaHistoryRow>
          ))}
        </RamenyaHistoryWrapper>
      )}
    </HistoryContainer>
  )
}

const HistoryContainer = render.div('flex flex-col gap-16')

const HistoryHeader = render.div('flex justify-between items-center w-full')

const RemoveText = render.extend(RaisingText, 'text-gray-400 cursor-pointer')

const HistoryTagWrapper = render.div('flex flex-wrap gap-8')

const KeywordHistoryTag = render.button(
  'flex items-center gap-8 box-border h-33 py-6 px-12 cursor-pointer border border-solid border-gray-200 rounded-full font-14-r text-gray-900 bg-transparent',
)

const RamenyaHistoryWrapper = render.div('flex flex-col')

const RamenyaHistoryRow = render.button('flex items-center gap-8 h-36 cursor-pointer border-none bg-transparent px-0 text-left')

const NoHistoryWrapper = render.div('flex flex-col items-center gap-8 cursor-pointer mt-12')

const NoHistoryText = render.extend(RaisingText, 'text-gray-400')

const RamenyaXIcon = render.extend(IconClose, 'ml-auto w-9 h-9 cursor-pointer')

const XIcon = render.extend(IconClose, 'w-9 h-9 cursor-pointer')
