import { LoadingLottie } from '@/shared/ui/lottie'
import NoStoreBox from '@/shared/ui/no-store-box'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { RamenyaListView } from '@/widgets/ramenya'
import { useGroupPage } from '../model/useGroupPage'

const GroupPage = () => {
  const { ramenyaGroup, ramenyaList, isLoading, isError } = useGroupPage()

  return (
    <Layout>
      <HeaderSection>
        <TopBar title={ramenyaGroup?.name || ''} />
      </HeaderSection>

      {ramenyaGroup?.descriptionImageUrl && (
        <HeaderImageSection>
          <HeaderImage src={ramenyaGroup.descriptionImageUrl} alt={ramenyaGroup.name} />
        </HeaderImageSection>
      )}

      {ramenyaGroup?.description && (
        <DescriptionSection>
          <DescriptionText size={14} weight="r">
            {ramenyaGroup.description}
          </DescriptionText>
        </DescriptionSection>
      )}

      <InformationWrapper>
        {isLoading && (
          <StateWrapper>
            <LoadingLottie />
            <StateText size={16} weight="m">
              그룹 정보를 불러오는 중이에요
            </StateText>
          </StateWrapper>
        )}

        {isError && (
          <StateWrapper>
            <StateText size={16} weight="m">
              그룹 정보를 불러오지 못했어요.
            </StateText>
          </StateWrapper>
        )}

        {!isLoading && !isError && <RamenyaListView ramenyas={ramenyaList} emptyContent={<NoStoreBox />} centered dividerInset isReview={false} />}
      </InformationWrapper>
    </Layout>
  )
}

const Layout = render.section('box-border flex min-h-[100dvh] w-full flex-col')

const HeaderSection = render.section('sticky top-0 z-20 w-full bg-white')

const HeaderImageSection = render.section('w-full shrink-0')

const HeaderImage = render.img('block h-auto w-full')

const DescriptionSection = render.section('box-border w-full px-20 py-16')

const DescriptionText = render.extend(RaisingText, 'whitespace-pre-wrap text-gray-700')

const InformationWrapper = render.section('flex min-h-0 flex-1 flex-col')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default GroupPage
