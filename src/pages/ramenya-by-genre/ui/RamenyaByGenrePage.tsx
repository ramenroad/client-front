import { IconTooltip } from '@/shared/ui/icon'
import { LoadingLottie } from '@/shared/ui/lottie'
import NoStoreBox from '@/shared/ui/no-store-box'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import Tooltip from '@/shared/ui/tooltip'
import { FilterSection, RamenyaListView } from '@/widgets/ramenya'
import { useRamenyaByGenrePage } from '../model/useRamenyaByGenrePage'

const RamenyaByGenrePage = () => {
  const { genre, genreDescription, filterOptions, setFilterOptions, ramenyas, isLoading, isError } = useRamenyaByGenrePage()

  return (
    <Layout>
      <HeaderContainer>
        <TopBar
          title={genre || ''}
          tooltip={genreDescription ? <Tooltip content={genreDescription}><IconTooltip /></Tooltip> : undefined}
        />
        <FilterSection filterOptions={filterOptions} onFilterChange={setFilterOptions} genre={genre} />
      </HeaderContainer>

      <InformationWrapper>
        {isLoading && (
          <StateWrapper>
            <LoadingLottie />
            <StateText size={16} weight="m">
              라멘야를 불러오는 중이에요
            </StateText>
          </StateWrapper>
        )}

        {isError && (
          <StateWrapper>
            <StateText size={16} weight="m">
              라멘야 목록을 불러오지 못했어요.
            </StateText>
          </StateWrapper>
        )}

        {!isLoading && !isError && <RamenyaListView ramenyas={ramenyas} emptyContent={<NoStoreBox />} centered dividerInset />}
      </InformationWrapper>
    </Layout>
  )
}

const Layout = render.section('box-border flex min-h-[100dvh] w-full flex-col')

const HeaderContainer = render.section('sticky top-0 z-20 flex w-full flex-col bg-white font-16-sb')

const InformationWrapper = render.section('box-border flex min-h-0 w-full flex-1 flex-col')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default RamenyaByGenrePage
