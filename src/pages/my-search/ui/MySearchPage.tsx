import { IconStar } from '@/shared/ui/icon'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RamenyaTag } from '@/shared/ui/tag'
import TopBar from '@/shared/ui/top-bar'
import { useMySearchPage, type MySearchStore, type MySearchTab } from '../model/useMySearchPage'

const TABS: { key: MySearchTab; label: string }[] = [
  { key: 'saved', label: '저장한 매장' },
  { key: 'recent', label: '최근 본 매장' },
]

const MySearchPage = () => {
  const { activeTab, setActiveTab, saved, isSavedLoading, recents, isRecentLoading, onStoreClick, onBack } =
    useMySearchPage()

  return (
    <Wrapper variant="standalone">
      <Header>
        <TopBar title="내 탐색" onBackClick={onBack} />
      </Header>

      <TabList>
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? 'border-orange font-16-sb text-orange' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>

      {activeTab === 'saved' && (
        <StoreGrid
          stores={saved}
          isLoading={isSavedLoading}
          emptyText="저장한 매장이 없어요."
          onStoreClick={onStoreClick}
        />
      )}

      {activeTab === 'recent' && (
        <StoreGrid
          stores={recents}
          isLoading={isRecentLoading}
          emptyText="최근 본 매장이 없어요."
          onStoreClick={onStoreClick}
        />
      )}
    </Wrapper>
  )
}

const StoreGrid = ({
  stores,
  isLoading,
  emptyText,
  onStoreClick,
}: {
  stores: MySearchStore[]
  isLoading: boolean
  emptyText: string
  onStoreClick: (ramenyaId: string) => void
}) => {
  if (isLoading) {
    return <StateText>불러오는 중...</StateText>
  }

  if (stores.length === 0) {
    return <EmptyText>{emptyText}</EmptyText>
  }

  return (
    <Grid>
      {stores.map((store) => (
        <StoreCard key={store._id} type="button" onClick={() => onStoreClick(store._id)}>
          <Thumbnail>
            {store.thumbnailUrl ? <ThumbnailImage src={store.thumbnailUrl} alt={store.name} /> : null}
            <ThumbnailBorder />
          </Thumbnail>
          <StoreCardBody>
            <StoreName>{store.name}</StoreName>
            {store.genre.length > 0 ? (
              <TagWrapper>
                {store.genre.map((genre) => (
                  <RamenyaTag key={genre}>{genre}</RamenyaTag>
                ))}
              </TagWrapper>
            ) : null}
            <RatingRow>
              <IconStar size={14} />
              <RatingValue>{store.rating.toFixed(1)}</RatingValue>
            </RatingRow>
          </StoreCardBody>
        </StoreCard>
      ))}
    </Grid>
  )
}

const Wrapper = render.extend(PageLayout, 'pb-40')

const Header = render.div('')

const TabList = render.div('flex items-center border-0 border-b border-solid border-border px-8')

const TabButton = render.button(
  'h-44 flex-1 cursor-pointer border-0 border-b-[1.5px] border-solid border-transparent bg-transparent px-12 font-16-r text-gray-500',
)

const StateText = render.div('flex min-h-200 items-center justify-center font-16-m text-gray-400')

const EmptyText = render.div('flex min-h-200 items-center justify-center font-14-r text-gray-400')

const Grid = render.div('grid grid-cols-2 gap-10 px-20 py-16')

const StoreCard = render.button(
  'flex cursor-pointer flex-col overflow-hidden rounded-12 border-none bg-[#FAFAFA] p-0 text-left',
)

const Thumbnail = render.div('relative h-160 w-full overflow-hidden rounded-t-12 bg-white')

const ThumbnailImage = render.img('h-full w-full object-cover')

const ThumbnailBorder = render.div(
  'pointer-events-none absolute inset-0 rounded-t-12 shadow-[inset_0_0_0_1px_#F4F4F5]',
)

const StoreCardBody = render.div('flex flex-col px-10 pb-10 pt-8')

const StoreName = render.div('truncate font-16-sb text-gray-900')

const TagWrapper = render.div('mt-6 flex flex-wrap gap-4')

const RatingRow = render.div('mt-8 flex items-center gap-2')

const RatingValue = render.div('font-12-m text-gray-700')

export default MySearchPage
