import { IconStar } from '@/shared/ui/icon'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RamenyaTag } from '@/shared/ui/tag'
import TopBar from '@/shared/ui/top-bar'
import { useMySearchPage } from '../model/useMySearchPage'

const MySearchPage = () => {
  const { recents, isLoading, onStoreClick, onBack } = useMySearchPage()

  return (
    <Wrapper variant="standalone">
      <Header>
        <TopBar title="내 탐색" onBackClick={onBack} />
      </Header>

      <SectionLabel>최근 본 매장</SectionLabel>

      {isLoading ? (
        <StateText>불러오는 중...</StateText>
      ) : recents.length === 0 ? (
        <EmptyText>최근 본 매장이 없어요.</EmptyText>
      ) : (
        <Grid>
          {recents.map((store) => (
            <StoreCard key={store._id} type="button" onClick={() => onStoreClick(store._id)}>
              <Thumbnail>
                {store.thumbnailUrl ? <ThumbnailImage src={store.thumbnailUrl} alt={store.name} /> : null}
              </Thumbnail>
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
            </StoreCard>
          ))}
        </Grid>
      )}
    </Wrapper>
  )
}

const Wrapper = render.extend(PageLayout, 'pb-40')

const Header = render.div('')

const SectionLabel = render.div('px-20 pb-8 pt-16 font-16-sb text-gray-900')

const StateText = render.div('flex min-h-200 items-center justify-center font-16-m text-gray-400')

const EmptyText = render.div('flex min-h-200 items-center justify-center font-14-r text-gray-400')

const Grid = render.div('grid grid-cols-2 gap-12 px-20 py-8')

const StoreCard = render.button(
  'flex cursor-pointer flex-col rounded-12 border-none bg-[#FAFAFA] p-10 text-left',
)

const Thumbnail = render.div('aspect-square w-full overflow-hidden rounded-8 bg-border')

const ThumbnailImage = render.img('h-full w-full object-cover')

const StoreName = render.div('mt-8 truncate font-16-sb text-gray-900')

const TagWrapper = render.div('mt-6 flex flex-wrap gap-4')

const RatingRow = render.div('mt-8 flex items-center gap-2')

const RatingValue = render.div('font-12-m text-gray-700')

export default MySearchPage
