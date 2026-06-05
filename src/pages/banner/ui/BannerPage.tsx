import { IconClose } from '@/shared/ui/icon'
import { LoadingLottie } from '@/shared/ui/lottie'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import { useBannerPage } from '../model/useBannerPage'

const BannerPage = () => {
  const { banners, isLoading, isError, handleBannerClick, handleCloseClick } = useBannerPage()

  return (
    <Wrapper variant="appBar">
      <Header>
        <Title>전체 보기</Title>
        <CloseButton type="button" onClick={handleCloseClick} aria-label="닫기">
          <IconClose width={14} height={14} />
        </CloseButton>
      </Header>
      {isLoading && (
        <StateWrapper>
          <LoadingLottie />
          <StateText size={16} weight="m">
            배너를 불러오는 중이에요
          </StateText>
        </StateWrapper>
      )}
      {isError && (
        <StateWrapper>
          <StateText size={16} weight="m">
            배너를 불러오지 못했어요.
          </StateText>
        </StateWrapper>
      )}
      {!isLoading && !isError && banners.length === 0 && (
        <StateWrapper>
          <StateText size={16} weight="m">
            등록된 배너가 없습니다.
          </StateText>
        </StateWrapper>
      )}
      {!isLoading && !isError && banners.length > 0 && (
        <BannerListContainer>
          {banners.map((banner) => (
            <BannerButton key={banner._id} type="button" onClick={() => handleBannerClick(banner)}>
              <BannerImage src={banner.bannerImageUrl} alt={banner.name || 'banner'} />
            </BannerButton>
          ))}
        </BannerListContainer>
      )}
    </Wrapper>
  )
}

const Wrapper = render.extend(PageLayout, 'items-center')

const Header = render.div('relative flex h-44 w-full items-center justify-center')

const Title = render.div('font-16-sb')

const CloseButton = render.button('absolute right-20 flex h-24 w-24 cursor-pointer items-center justify-center border-none bg-transparent p-0')

const BannerListContainer = render.div('flex flex-col items-center justify-center gap-20 px-20 pt-10')

const BannerButton = render.button('cursor-pointer border-none bg-transparent p-0')

const BannerImage = render.img('h-200 w-350 rounded-8 object-cover')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default BannerPage
