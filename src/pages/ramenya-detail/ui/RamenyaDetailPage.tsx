import storeImage from '@/assets/images/store.png'
import type { ReactNode } from 'react'
import type { BusinessHour, RamenyaDetail, RamenyaEmbeddedReview, RamenyaMenuBoard } from '@/entities/ramenya/model'
import { checkBusinessStatus, checkBusinessStatusSpecial, DAY_MAP, OpenStatus } from '@/entities/ramenya/model'
import { RamenyaOpenStatus } from '@/entities/ramenya/ui'
import type { NaverMapMarker } from '@/widgets/map/naver-map'
import { NaverMap } from '@/widgets/map/naver-map'
import {
  IconArrowRight,
  IconBar,
  IconCall,
  IconDropDown,
  IconDropDownSelected,
  IconInstagram,
  IconLocate,
  IconMap,
  IconMenuBoard,
  IconStar,
  IconTag,
  IconTime,
} from '@/shared/ui/icon'
import { ImagePopup } from '@/shared/ui/image-popup'
import { Line } from '@/shared/ui/line'
import { LoadingLottie } from '@/shared/ui/lottie'
import { Modal } from '@/shared/ui/modal'
import render from '@/shared/ui/render'
import { TopBar } from '@/shared/ui/top-bar'
import { formatNumber } from '@/shared/lib/number'
import { useRamenyaDetailPage, type MapButton } from '../model/useRamenyaDetailPage'

const REVIEW_RATING = [1, 2, 3, 4, 5] as const

const RamenyaDetailPage = () => {
  const {
    id,
    detail,
    detailQuery,
    reviewImages,
    reviews,
    isTimeExpanded,
    setIsTimeExpanded,
    selectedImageIndex,
    setSelectedImageIndex,
    selectedImages,
    todayBusinessHour,
    sortedBusinessHours,
    mapButtons,
    handleOpenImagePopup,
    handleCloseImagePopup,
    handleNavigateReviewCreatePage,
    handleNavigateAllReviewsPage,
    handleNavigateMenuBoardSubmitPage,
    handleNavigateMenuBoardImagesPage,
    handleNavigateReviewImagesPage,
    handleOpenMapUrl,
  } = useRamenyaDetailPage()

  if (detailQuery.isLoading) {
    return <DetailLoading />
  }

  if (detailQuery.isError || !detail) {
    return <DetailError />
  }

  return (
    <PageWrapper>
      <PageContainer>
        <HeaderBox>
          <TopBar title={detail.name} />
          <ThumbnailSection detail={detail} />
        </HeaderBox>

        <InformationSection
          detail={detail}
          isTimeExpanded={isTimeExpanded}
          setIsTimeExpanded={setIsTimeExpanded}
          sortedBusinessHours={sortedBusinessHours}
          todayBusinessHour={todayBusinessHour}
        />

        <Divider />

        <RamenroadReviewSection detail={detail} />

        <Divider />

        <RecommendedMenuSection recommendedMenu={detail.recommendedMenu ?? []} />

        <Divider />

        <MenuBoardSection
          menuBoard={detail.menuBoard ?? []}
          onNavigateMenuBoardImagesPage={handleNavigateMenuBoardImagesPage}
          onNavigateMenuBoardSubmitPage={handleNavigateMenuBoardSubmitPage}
          onOpenImagePopup={handleOpenImagePopup}
        />

        <Divider />

        <ReviewPhotoSection
          reviewImages={reviewImages}
          onNavigateReviewImagesPage={handleNavigateReviewImagesPage}
          onOpenImagePopup={handleOpenImagePopup}
        />

        <Divider />

        <ReviewSection
          reviews={reviews}
          reviewCount={detail.reviewCount}
          onNavigateAllReviewsPage={handleNavigateAllReviewsPage}
          onNavigateReviewCreatePage={handleNavigateReviewCreatePage}
          onOpenImagePopup={handleOpenImagePopup}
        />

        <Divider />

        <DetailMapSection detail={detail} id={id} mapButtons={mapButtons} onOpenMapUrl={handleOpenMapUrl} />
      </PageContainer>

      <Modal isOpen={selectedImageIndex !== null && selectedImages.length > 0} onClose={handleCloseImagePopup}>
        {selectedImageIndex !== null && selectedImages.length > 0 && (
          <ImagePopup
            isOpen
            images={selectedImages}
            selectedIndex={selectedImageIndex}
            onClose={handleCloseImagePopup}
            onIndexChange={setSelectedImageIndex}
          />
        )}
      </Modal>
    </PageWrapper>
  )
}

const DetailLoading = () => {
  return (
    <StateWrapper>
      <LoadingLottie className="h-80 w-80" />
      <StateText>매장 정보를 불러오는 중</StateText>
    </StateWrapper>
  )
}

const DetailError = () => {
  return (
    <StateWrapper>
      <TopBar title="매장 상세" />
      <StateText>매장 정보를 불러오지 못했습니다.</StateText>
    </StateWrapper>
  )
}

const ThumbnailSection = ({ detail }: { detail: RamenyaDetail }) => {
  return (
    <ThumbnailContainer>
      {detail.thumbnailUrl ? (
        <MarketThumbnail src={detail.thumbnailUrl} alt={detail.name} />
      ) : (
        <EmptyThumbnail src={storeImage} alt="" />
      )}
    </ThumbnailContainer>
  )
}

const RatingStars = ({ rating, size = 14 }: { rating: number; size?: number }) => {
  return (
    <StarContainer>
      {REVIEW_RATING.map((star) => {
        if (rating >= star) {
          return <IconStar key={star} size={size} />
        }

        if (rating >= star - 0.5) {
          return <IconStar key={star} size={size} isHalf />
        }

        return <IconStar key={star} size={size} inactive />
      })}
    </StarContainer>
  )
}

const DetailIconTag = ({ icon, text }: { icon: ReactNode; text: string }) => {
  return (
    <DetailIconTagWrapper>
      <DetailIconWrapper>{icon}</DetailIconWrapper>
      <DetailIconText>{text}</DetailIconText>
    </DetailIconTagWrapper>
  )
}

const InformationSection = ({
  detail,
  isTimeExpanded,
  setIsTimeExpanded,
  sortedBusinessHours,
  todayBusinessHour,
}: {
  detail: RamenyaDetail
  isTimeExpanded: boolean
  setIsTimeExpanded: (expanded: boolean) => void
  sortedBusinessHours: BusinessHour[]
  todayBusinessHour?: BusinessHour
}) => {
  const businessStatus = checkBusinessStatus(detail.businessHours)
  const businessStatusSpecial = checkBusinessStatusSpecial(detail.businessHours)
  const operatingTimeText = todayBusinessHour?.isOpen
    ? todayBusinessHour.operatingTime
    : businessStatusSpecial.closeInformation

  return (
    <InformationWrapper>
      <MarketDetailTitle>{detail.name}</MarketDetailTitle>
      <MarketDetailBoxContainer>
        <MarketDetailBox>
          <DetailIconTag icon={<IconStar inactive />} text="평점" />
          <MarketDetailReviewBox>
            <RatingStars rating={detail.reviewCount === 0 ? 0 : detail.rating} />
            <MarketDetailReviewScore>{detail.rating?.toFixed(1) ?? '0.0'}</MarketDetailReviewScore>
          </MarketDetailReviewBox>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconTag />} text="장르" />
          <MarketDetailGenreBox>
            {detail.genre.map((genre, index) => (
              <MarketDetailGenre key={genre}>
                <MarketDetailGenreText>{genre}</MarketDetailGenreText>
                {index < detail.genre.length - 1 && <IconBar />}
              </MarketDetailGenre>
            ))}
          </MarketDetailGenreBox>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconLocate />} text="주소" />
          <MarketDetailBoxText>{detail.address}</MarketDetailBoxText>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconTime />} text="운영시간" />
          <MarketDetailBoxContent>
            <OperatingTimeTextContainer>
              <RamenyaOpenStatus status={businessStatus.status} />
              <TimeHeader>
                <TimeHeaderText>{operatingTimeText ?? '운영시간 미공개'}</TimeHeaderText>
                {isTimeExpanded ? (
                  <StyledIconDropDownSelected onClick={() => setIsTimeExpanded(false)} />
                ) : (
                  <StyledIconDropDown onClick={() => setIsTimeExpanded(true)} />
                )}
              </TimeHeader>
              {isTimeExpanded && (
                <BusinessHoursWrapper>
                  {businessStatusSpecial.daily.allSame ? (
                    <BusinessHoursContainer data-today="true">
                      <BusinessHoursDay>매일</BusinessHoursDay>
                      <BusinessHoursTime>
                        <BusinessHoursTextLine>
                          {businessStatusSpecial.daily.operatingTime ?? '운영 정보 없음'}
                        </BusinessHoursTextLine>
                        {businessStatusSpecial.daily.breakTime && (
                          <BusinessHoursTextLine>
                            {businessStatusSpecial.daily.breakTime} {OpenStatus.BREAK}
                          </BusinessHoursTextLine>
                        )}
                      </BusinessHoursTime>
                    </BusinessHoursContainer>
                  ) : (
                    sortedBusinessHours.map((businessHour) => (
                      <BusinessHoursContainer
                        key={businessHour.day}
                        data-today={todayBusinessHour?.day === businessHour.day}
                      >
                        <BusinessHoursDay>{DAY_MAP[businessHour.day]}</BusinessHoursDay>
                        <BusinessHoursTime>
                          {businessHour.isOpen ? (
                            <BusinessHoursTextGroup>
                              <BusinessHoursTextLine>
                                {businessHour.operatingTime ?? '운영 정보 없음'}
                              </BusinessHoursTextLine>
                              {businessHour.breakTime && (
                                <BreakTimeText>
                                  <BreakTimeValue>{businessHour.breakTime}</BreakTimeValue>
                                  <BreakTimeValue>{OpenStatus.BREAK}</BreakTimeValue>
                                </BreakTimeText>
                              )}
                            </BusinessHoursTextGroup>
                          ) : (
                            <BusinessHoursTextLine>매주 휴무</BusinessHoursTextLine>
                          )}
                        </BusinessHoursTime>
                      </BusinessHoursContainer>
                    ))
                  )}
                </BusinessHoursWrapper>
              )}
            </OperatingTimeTextContainer>
          </MarketDetailBoxContent>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconCall />} text="전화번호" />
          <MarketDetailBoxContent>
            <MarketDetailBoxText>{detail.contactNumber || '미공개'}</MarketDetailBoxText>
          </MarketDetailBoxContent>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconInstagram />} text="인스타그램" />
          <MarketDetailBoxContent>
            {detail.instagramProfile ? (
              <InstagramLink href={detail.instagramProfile} target="_blank" rel="noopener noreferrer">
                {detail.instagramProfile}
              </InstagramLink>
            ) : (
              <MarketDetailBoxText>미공개</MarketDetailBoxText>
            )}
          </MarketDetailBoxContent>
        </MarketDetailBox>
      </MarketDetailBoxContainer>
    </InformationWrapper>
  )
}

const RamenroadReviewSection = ({ detail }: { detail: RamenyaDetail }) => {
  const hasReview = Boolean(detail.ramenroadReview?.oneLineReview || detail.ramenroadReview?.description)

  if (!hasReview) {
    return (
      <CommentWrapper>
        <SectionTitle>라이징 코멘트</SectionTitle>
        <EmptyDescription>아직 등록된 코멘트가 없습니다.</EmptyDescription>
      </CommentWrapper>
    )
  }

  return (
    <CommentWrapper>
      <SectionTitle>라이징 코멘트</SectionTitle>
      {detail.ramenroadReview.oneLineReview && <CommentTitle>{detail.ramenroadReview.oneLineReview}</CommentTitle>}
      {detail.ramenroadReview.description && <CommentDescription>{detail.ramenroadReview.description}</CommentDescription>}
    </CommentWrapper>
  )
}

const RecommendedMenuSection = ({ recommendedMenu }: { recommendedMenu: RamenyaDetail['recommendedMenu'] }) => {
  return (
    <SectionWrapper>
      <SectionTitle>라이징 추천 메뉴</SectionTitle>
      {recommendedMenu && recommendedMenu.length > 0 ? (
        <RecommendMenuContainer>
          {recommendedMenu.map((menu) => (
            <RecommendMenuBox key={menu.name}>
              <RecommendMenuName>{menu.name}</RecommendMenuName>
              <RecommendMenuPrice>{formatNumber(menu.price)}원</RecommendMenuPrice>
            </RecommendMenuBox>
          ))}
        </RecommendMenuContainer>
      ) : (
        <EmptyDescription>추천 메뉴가 아직 등록되지 않았습니다.</EmptyDescription>
      )}
    </SectionWrapper>
  )
}

const MenuBoardSection = ({
  menuBoard,
  onNavigateMenuBoardImagesPage,
  onNavigateMenuBoardSubmitPage,
  onOpenImagePopup,
}: {
  menuBoard: RamenyaMenuBoard[]
  onNavigateMenuBoardImagesPage: () => void
  onNavigateMenuBoardSubmitPage: () => void
  onOpenImagePopup: (index: number, images: string[]) => void
}) => {
  const menuBoardImages = menuBoard.map((menu) => menu.imageUrl)

  return (
    <SectionWrapper>
      <SectionHeader>
        <SectionTitle>메뉴판</SectionTitle>
        {menuBoard.length > 0 && <SmallActionButton onClick={onNavigateMenuBoardSubmitPage}>등록하기</SmallActionButton>}
      </SectionHeader>
      {menuBoard.length === 0 ? (
        <EmptyBox>
          <IconMenuBoard />
          <EmptyTitle>등록된 메뉴판이 없습니다</EmptyTitle>
          <EmptyDescription>첫 등록의 주인공이 되어주세요!</EmptyDescription>
          <PrimaryPillButton type="button" onClick={onNavigateMenuBoardSubmitPage}>
            등록하기
          </PrimaryPillButton>
        </EmptyBox>
      ) : (
        <MenuBoardContainer>
          <HorizontalImageList>
            {menuBoard.slice(0, 10).map((menu, index) => (
              <MenuBoardImage
                key={menu._id}
                src={menu.imageUrl}
                alt={`${index + 1}번째 메뉴판`}
                onClick={() => onOpenImagePopup(index, menuBoardImages)}
              />
            ))}
          </HorizontalImageList>
          <Line />
          <GrayActionButton type="button" onClick={onNavigateMenuBoardImagesPage}>
            <ButtonText>전체 메뉴판 보기</ButtonText>
            <IconArrowRight color="#888888" />
          </GrayActionButton>
        </MenuBoardContainer>
      )}
    </SectionWrapper>
  )
}

const ReviewPhotoSection = ({
  reviewImages,
  onNavigateReviewImagesPage,
  onOpenImagePopup,
}: {
  reviewImages: string[]
  onNavigateReviewImagesPage: () => void
  onOpenImagePopup: (index: number, images: string[]) => void
}) => {
  const previewImages = reviewImages.slice(0, 5)
  const moreImage = reviewImages[5]

  return (
    <SectionWrapper>
      <SectionTitle>사진</SectionTitle>
      {reviewImages.length === 0 ? (
        <EmptyBox>
          <EmptyThumbnail src={storeImage} alt="" />
          <EmptyTitle>등록된 사진이 없습니다.</EmptyTitle>
          <EmptyDescription>리뷰를 작성하고 사진을 등록해주세요!</EmptyDescription>
        </EmptyBox>
      ) : (
        <ImageGrid>
          {previewImages.map((image, index) => (
            <ReviewImageButton key={image} type="button" onClick={() => onOpenImagePopup(index, previewImages)}>
              <ReviewImage src={image} alt={`${index + 1}번째 리뷰 사진`} />
            </ReviewImageButton>
          ))}
          {moreImage && (
            <MoreImageButton type="button" onClick={onNavigateReviewImagesPage}>
              <ReviewImage src={moreImage} alt="더보기 리뷰 사진" />
              <MoreOverlay>
                <MoreText>더보기</MoreText>
                <IconArrowRight color="#FFFFFF" />
              </MoreOverlay>
            </MoreImageButton>
          )}
        </ImageGrid>
      )}
    </SectionWrapper>
  )
}

const ReviewSection = ({
  reviews,
  reviewCount,
  onNavigateAllReviewsPage,
  onNavigateReviewCreatePage,
  onOpenImagePopup,
}: {
  reviews: RamenyaEmbeddedReview[]
  reviewCount: number
  onNavigateAllReviewsPage: () => void
  onNavigateReviewCreatePage: (rating?: number) => void
  onOpenImagePopup: (index: number, images: string[]) => void
}) => {
  return (
    <ReviewWrapper>
      <ReviewHeader>
        <ReviewHeaderTitle>리뷰를 남겨주세요</ReviewHeaderTitle>
        <LargeStarContainer>
          {REVIEW_RATING.map((rating) => (
            <ReviewStarButton key={rating} type="button" onClick={() => onNavigateReviewCreatePage(rating)}>
              <IconStar inactive size={36} />
            </ReviewStarButton>
          ))}
        </LargeStarContainer>
      </ReviewHeader>
      <ReviewDivider />

      <ReviewContent>
        <ReviewContentTitle>고객 리뷰 {reviewCount > 0 && `(${reviewCount})`}</ReviewContentTitle>
        {reviews.length === 0 ? (
          <EmptyBox>
            <EmptyThumbnail src={storeImage} alt="" />
            <EmptyTitle>등록된 리뷰가 없습니다.</EmptyTitle>
            <EmptyDescription>방문하셨나요? 평가를 남겨보세요!</EmptyDescription>
            <PrimaryPillButton type="button" onClick={() => onNavigateReviewCreatePage()}>
              리뷰 작성하기
            </PrimaryPillButton>
          </EmptyBox>
        ) : (
          <ReviewCardContainer>
            {reviews.map((review, index) => (
              <ReviewListItem key={review._id}>
                <ReviewPreviewCard review={review} onOpenImagePopup={onOpenImagePopup} />
                {index < reviews.length - 1 && <Line />}
              </ReviewListItem>
            ))}
            <AllReviewButtonWrapper>
              <GrayActionButton type="button" onClick={onNavigateAllReviewsPage}>
                <ButtonText>모든 리뷰 보기</ButtonText>
                <IconArrowRight />
              </GrayActionButton>
            </AllReviewButtonWrapper>
          </ReviewCardContainer>
        )}
      </ReviewContent>
    </ReviewWrapper>
  )
}

const ReviewPreviewCard = ({
  review,
  onOpenImagePopup,
}: {
  review: RamenyaEmbeddedReview
  onOpenImagePopup: (index: number, images: string[]) => void
}) => {
  const createdAt = review.createdAt ? new Date(review.createdAt) : null
  const dateText = createdAt ? `${String(createdAt.getFullYear()).slice(2)}.${createdAt.getMonth() + 1}.${createdAt.getDate()}` : ''

  return (
    <ReviewCardWrapper>
      <ReviewCardHeader>
        <ReviewerInfo>
          <ReviewerProfileImage src={review.userId.profileImageUrl || storeImage} alt={review.userId.nickname} />
          <ReviewerName>{review.userId.nickname}</ReviewerName>
        </ReviewerInfo>
        <ReviewDate>{dateText}</ReviewDate>
      </ReviewCardHeader>
      <ReviewMetaRow>
        <RatingStars rating={review.rating} />
        <ReviewMenuList>
          {review.menus?.map((menu, index) => (
            <ReviewMenu key={`${menu}-${index}`}>
              <ReviewMenuText>{menu}</ReviewMenuText>
              {index !== review.menus.length - 1 && <MenuSeparator />}
            </ReviewMenu>
          ))}
        </ReviewMenuList>
      </ReviewMetaRow>
      <ReviewText>{review.review}</ReviewText>
      {review.reviewImageUrls.length > 0 && (
        <ReviewImageList>
          {review.reviewImageUrls.slice(0, 4).map((image, index) => (
            <ReviewCardImageButton key={image} type="button" onClick={() => onOpenImagePopup(index, review.reviewImageUrls)}>
              <ReviewCardImage src={image} alt={`${review.userId.nickname} 리뷰 이미지`} />
            </ReviewCardImageButton>
          ))}
        </ReviewImageList>
      )}
    </ReviewCardWrapper>
  )
}

const DetailMapSection = ({
  detail,
  id,
  mapButtons,
  onOpenMapUrl,
}: {
  detail: RamenyaDetail
  id: string
  mapButtons: MapButton[]
  onOpenMapUrl: (url: string) => void
}) => {
  const markers: NaverMapMarker<RamenyaDetail>[] = [
    {
      id,
      title: detail.name,
      position: {
        latitude: detail.latitude,
        longitude: detail.longitude,
      },
      data: detail,
    },
  ]

  return (
    <MapWrapper>
      <SectionTitle>위치</SectionTitle>
      <StaticMapContainer>
        <NaverMap
          initialCenter={{ latitude: detail.latitude, longitude: detail.longitude }}
          initialZoom={16}
          markers={markers}
          selectedMarkerId={id}
        />
      </StaticMapContainer>

      <MapRedirectButtonContainer>
        {mapButtons
          .filter((button) => button.url)
          .map((button) => (
            <MapRedirectButton
              key={button.type}
              type="button"
              onClick={() => {
                if (button.url) {
                  onOpenMapUrl(button.url)
                }
              }}
            >
              <IconMap type={button.type} />
              <MapRedirectLabel>{button.label}</MapRedirectLabel>
              <StyledIconArrowRight color="#888888" />
            </MapRedirectButton>
          ))}
      </MapRedirectButtonContainer>
    </MapWrapper>
  )
}

const PageWrapper = render.div('flex w-full flex-col items-center justify-center pb-40')

const PageContainer = render.div('flex w-full max-w-390 flex-col bg-white')

const HeaderBox = render.div('flex flex-col')

const ThumbnailContainer = render.div('flex w-full items-center justify-center bg-gray-50')

const EmptyThumbnail = render.img('w-110 object-contain')

const MarketThumbnail = render.img('h-190 w-full object-cover object-center')

const Divider = render.div('h-8 w-full bg-divider')

const StateWrapper = render.div('flex min-h-[60dvh] w-full flex-col items-center justify-center gap-8 text-center')

const StateText = render.span('font-16-r text-gray-500')

const InformationWrapper = render.section('flex flex-col gap-16 px-20 pt-20 pb-32')

const MarketDetailTitle = render.h1('m-0 font-22-sb text-black')

const MarketDetailBoxContainer = render.div('flex flex-col gap-12')

const MarketDetailBox = render.div('flex items-start gap-16')

const DetailIconTagWrapper = render.div('flex items-center justify-center gap-4')

const DetailIconWrapper = render.div('flex items-center justify-center')

const DetailIconText = render.div('w-60 whitespace-nowrap font-14-r text-gray-400')

const MarketDetailReviewBox = render.div('flex items-center gap-4')

const StarContainer = render.div('flex items-center gap-2')

const MarketDetailReviewScore = render.div('font-14-r text-black')

const MarketDetailGenreBox = render.div('flex flex-wrap items-center gap-8 font-14-r text-black')

const MarketDetailGenre = render.div('flex items-center gap-8 font-14-r')

const MarketDetailGenreText = render.span('text-inherit')

const MarketDetailBoxText = render.div('font-14-r text-black')

const MarketDetailBoxContent = render.div('max-w-254 break-words font-14-r')

const OperatingTimeTextContainer = render.div('flex flex-col items-start gap-6')

const TimeHeader = render.div('flex items-center gap-4')

const TimeHeaderText = render.span('text-inherit')

const StyledIconDropDown = render.extend(IconDropDown, 'cursor-pointer')

const StyledIconDropDownSelected = render.extend(IconDropDownSelected, 'cursor-pointer')

const BusinessHoursWrapper = render.div('flex flex-col gap-8')

const BusinessHoursContainer = render.div('flex gap-7 data-[today=true]:font-semibold')

const BusinessHoursDay = render.span('w-20')

const BusinessHoursTime = render.div('flex flex-col gap-4')

const BusinessHoursTextGroup = render.div('flex flex-col gap-4')

const BusinessHoursTextLine = render.div('text-inherit')

const BreakTimeText = render.div('flex items-center gap-4')

const BreakTimeValue = render.span('text-inherit')

const InstagramLink = render.a('font-14-r text-blue')

const SectionWrapper = render.section('flex flex-col gap-16 px-20 py-32')

const SectionHeader = render.div('flex items-center justify-between')

const SectionTitle = render.h2('m-0 font-18-sb text-black')

const CommentWrapper = render.section('flex flex-col gap-8 px-20 py-32')

const CommentTitle = render.div('font-16-sb text-orange')

const CommentDescription = render.p('m-0 whitespace-pre-line font-14-r text-gray-700')

const EmptyDescription = render.div('font-14-r text-gray-500')

const RecommendMenuContainer = render.div('flex flex-col gap-14')

const RecommendMenuBox = render.div('flex flex-col gap-2')

const RecommendMenuName = render.div('font-14-m text-black')

const RecommendMenuPrice = render.div('font-14-sb text-black')

const SmallActionButton = render.button(
  'flex h-22 cursor-pointer items-center justify-center rounded-[100px] border border-solid border-border bg-transparent px-10 font-12-m text-gray-500 shadow-none outline-none',
)

const EmptyBox = render.div('flex flex-col items-center justify-center py-8 text-center')

const EmptyTitle = render.div('pt-8 pb-4 font-16-r text-black')

const PrimaryPillButton = render.button(
  'mt-16 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-[100px] border-none bg-bright-orange px-32 py-10 font-16-m text-orange shadow-none outline-none',
)

const MenuBoardContainer = render.div('flex flex-col gap-10')

const HorizontalImageList = render.div('flex w-full gap-10 overflow-x-auto rounded-[8px]')

const MenuBoardImage = render.img('h-110 w-110 cursor-pointer rounded-[8px] object-cover')

const GrayActionButton = render.button(
  'flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] border-none bg-border py-10 font-14-m text-black shadow-none outline-none',
)

const ButtonText = render.span('text-inherit')

const ImageGrid = render.div('grid w-full grid-cols-3 overflow-hidden rounded-[8px] gap-1')

const ReviewImageButton = render.button('h-116 w-full cursor-pointer border-none bg-transparent p-0 shadow-none outline-none')

const ReviewImage = render.img('h-full w-full object-cover')

const MoreImageButton = render.button(
  'relative h-116 w-full cursor-pointer border-none bg-transparent p-0 shadow-none outline-none',
)

const MoreOverlay = render.div('absolute inset-0 flex items-center justify-center bg-black/50')

const MoreText = render.span('font-14-m text-white')

const ReviewWrapper = render.section('flex flex-col py-32')

const ReviewHeader = render.div('mb-32 flex flex-col items-center gap-10 px-20')

const ReviewHeaderTitle = render.div('font-18-r text-black')

const LargeStarContainer = render.div('flex items-center gap-2')

const ReviewStarButton = render.button('cursor-pointer border-none bg-transparent p-0 shadow-none outline-none')

const ReviewDivider = render.div('h-1 w-full bg-divider')

const ReviewContent = render.div('flex flex-col')

const ReviewContentTitle = render.div('pl-20 pt-20 font-18-sb text-black')

const ReviewCardContainer = render.div('flex flex-col')

const ReviewListItem = render.div('flex flex-col')

const AllReviewButtonWrapper = render.div('px-20')

const ReviewCardWrapper = render.article('flex flex-col p-20')

const ReviewCardHeader = render.div('flex items-center justify-between')

const ReviewerInfo = render.div('flex items-center gap-10')

const ReviewerProfileImage = render.img('h-36 w-36 rounded-full object-cover')

const ReviewerName = render.div('font-14-sb text-black')

const ReviewDate = render.div('font-12-r text-gray-500')

const ReviewMetaRow = render.div('mt-10 flex items-center gap-8 text-gray-500')

const ReviewMenuList = render.div('flex flex-1 items-center gap-4 overflow-hidden')

const ReviewMenu = render.div('flex items-center gap-4 font-12-r')

const ReviewMenuText = render.span('truncate text-inherit')

const MenuSeparator = render.span('h-10 w-1 bg-gray-100')

const ReviewText = render.p('m-0 mt-12 whitespace-pre-line font-14-r leading-21 text-black')

const ReviewImageList = render.div('mt-12 flex gap-1 overflow-x-auto')

const ReviewCardImageButton = render.button(
  'h-96 w-96 min-w-96 cursor-pointer border-none bg-transparent p-0 shadow-none outline-none',
)

const ReviewCardImage = render.img('h-full w-full rounded-[8px] object-cover')

const MapWrapper = render.section('flex flex-col gap-16 px-20 py-32')

const StaticMapContainer = render.div('h-210 w-full overflow-hidden rounded-[8px] border border-solid border-border')

const MapRedirectButtonContainer = render.div('flex flex-col gap-8')

const MapRedirectButton = render.button(
  'flex h-52 cursor-pointer items-center gap-10 rounded-[8px] border border-solid border-gray-100 bg-transparent px-20 py-14 font-14-r text-black shadow-none outline-none',
)

const MapRedirectLabel = render.span('text-inherit')

const StyledIconArrowRight = render.extend(IconArrowRight, 'ml-auto')

export default RamenyaDetailPage
