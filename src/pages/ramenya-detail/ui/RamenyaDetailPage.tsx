import emptyImage from '@/assets/images/empty-images.png'
import emptyReview from '@/assets/images/empty-review.png'
import storeImage from '@/assets/images/store.png'
import { Fragment, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteMenuBoardMutation } from '@/entities/menu-board/api'
import { MenuBoardDetail } from '@/entities/menu-board/ui'
import { ramenyaQueryKeys } from '@/entities/ramenya/api'
import type { BusinessHour, RamenyaDetail, RamenyaMenuBoard } from '@/entities/ramenya/model'
import { checkBusinessStatus, checkBusinessStatusSpecial, DAY_MAP, OpenStatus } from '@/entities/ramenya/model'
import { RamenyaOpenStatus } from '@/entities/ramenya/ui'
import type { Review } from '@/entities/review/model'
import type { MyInfo } from '@/entities/viewer/model'
import type { NaverMapMarker } from '@/widgets/map/naver-map'
import { NaverMap } from '@/widgets/map/naver-map'
import { ReviewCard } from '@/widgets/review'
import {
  IconArrowRight,
  IconBar,
  IconBookmark,
  IconCall,
  IconDropDown,
  IconDropDownSelected,
  IconInstagram,
  IconLocate,
  IconMap,
  IconMenuBoard,
  IconShare,
  IconStar,
  IconTag,
  IconTime,
} from '@/shared/ui/icon'
import { ImagePopup } from '@/shared/ui/image-popup'
import { Line } from '@/shared/ui/line'
import { LoadingLottie } from '@/shared/ui/lottie'
import { Modal } from '@/shared/ui/modal'
import { PageLayout } from '@/shared/ui/page-layout'
import { RatingStars } from '@/shared/ui/rating'
import render from '@/shared/ui/render'
import { ShareModal } from '@/shared/ui/share-modal'
import { TopBar } from '@/shared/ui/top-bar'
import { useToast } from '@/shared/ui/toast'
import { formatNumber } from '@/shared/lib/number'
import { useRamenyaDetailPage, type MapButton } from '../model/useRamenyaDetailPage'

const REVIEW_RATING = [1, 2, 3, 4, 5] as const
const RAISING_MAP_ICON_SRC = '/favicon.svg'

const RamenyaDetailPage = () => {
  const {
    id,
    detail,
    detailQuery,
    isSignIn,
    isBookmarked,
    handleBookmarkClick,
    isShareOpen,
    openShare,
    closeShare,
    handleShare,
    myInfo,
    reviewImages,
    reviews,
    isTimeExpanded,
    setIsTimeExpanded,
    selectedRating,
    selectedImageIndex,
    setSelectedImageIndex,
    selectedImages,
    isLoginModalOpen,
    todayBusinessHour,
    sortedBusinessHours,
    mapButtons,
    handleStarClick,
    handleOpenImagePopup,
    handleCloseImagePopup,
    handleNavigateReviewCreatePage,
    handleNavigateAllReviewsPage,
    handleNavigateLoginPage,
    handleCloseLoginModal,
    handleNavigateMenuBoardSubmitPage,
    handleNavigateMenuBoardImagesPage,
    handleNavigateReviewImagesPage,
    handleOpenMapUrl,
    handleNavigateRaisingMap,
  } = useRamenyaDetailPage()

  if (detailQuery.isLoading) {
    return <DetailLoading />
  }

  if (detailQuery.isError || !detail) {
    return <DetailError />
  }

  return (
    <PageWrapper variant="appBar">
      <PageContainer>
        <HeaderBox>
          <TopBar title={detail.name} icon={<IconShare />} onIconClick={openShare} />
          <ThumbnailSection detail={detail} />
        </HeaderBox>

        <InformationSection
          detail={detail}
          isBookmarked={isBookmarked}
          onBookmarkClick={handleBookmarkClick}
          isTimeExpanded={isTimeExpanded}
          setIsTimeExpanded={setIsTimeExpanded}
          sortedBusinessHours={sortedBusinessHours}
          todayBusinessHour={todayBusinessHour}
        />

        <Divider />

        <RecommendedMenuSection recommendedMenu={detail.recommendedMenu ?? []} />

        <Divider />

        <MenuBoardSection
          ramenyaId={id}
          menuBoard={detail.menuBoard ?? []}
          myInfo={myInfo}
          onNavigateMenuBoardImagesPage={handleNavigateMenuBoardImagesPage}
          onNavigateMenuBoardSubmitPage={handleNavigateMenuBoardSubmitPage}
        />

        <Divider />

        <ReviewPhotoSection
          reviewImages={reviewImages}
          onNavigateReviewImagesPage={handleNavigateReviewImagesPage}
          onOpenImagePopup={handleOpenImagePopup}
        />

        <Divider />

        <ReviewSection
          myInfo={myInfo}
          isSignIn={isSignIn}
          selectedRating={selectedRating}
          reviews={reviews}
          onStarClick={handleStarClick}
          onLoginClick={handleNavigateLoginPage}
          onNavigateAllReviewsPage={handleNavigateAllReviewsPage}
          onNavigateReviewCreatePage={handleNavigateReviewCreatePage}
        />

        <Divider />

        <DetailMapSection
          detail={detail}
          id={id}
          mapButtons={mapButtons}
          onOpenMapUrl={handleOpenMapUrl}
          onOpenRaisingMap={handleNavigateRaisingMap}
        />
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

      <ShareModal isOpen={isShareOpen} onClose={closeShare} onShare={handleShare} />

      <Modal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>로그인이 필요해요</ModalTitle>
            <ModalText>로그인 하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton type="button" onClick={handleCloseLoginModal}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton type="button" onClick={handleNavigateLoginPage}>
              확인
            </ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>
    </PageWrapper>
  )
}

const DetailLoading = () => {
  return (
    <StateWrapper variant="appBar">
      <StateContent>
        <LoadingLottie className="h-80 w-80" />
        <StateText>매장 정보를 불러오는 중</StateText>
      </StateContent>
    </StateWrapper>
  )
}

const DetailError = () => {
  return (
    <StateWrapper variant="appBar">
      <TopBar title="매장 상세" />
      <StateContent>
        <StateText>매장 정보를 불러오지 못했습니다.</StateText>
      </StateContent>
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
  isBookmarked,
  onBookmarkClick,
  isTimeExpanded,
  setIsTimeExpanded,
  sortedBusinessHours,
  todayBusinessHour,
}: {
  detail: RamenyaDetail
  isBookmarked: boolean
  onBookmarkClick: () => void
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
      <MarketDetailTitleRow>
        <MarketDetailTitle>{detail.name}</MarketDetailTitle>
        <BookmarkButton
          type="button"
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? `${detail.name} 저장 해제` : `${detail.name} 저장`}
          onClick={onBookmarkClick}
        >
          <IconBookmark active={isBookmarked} size={28} />
        </BookmarkButton>
      </MarketDetailTitleRow>
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

const RecommendedMenuSection = ({ recommendedMenu }: { recommendedMenu: RamenyaDetail['recommendedMenu'] }) => {
  const menuCount = recommendedMenu?.length ?? 0

  return (
    <SectionWrapper>
      <SectionTitle>라이징 추천 메뉴</SectionTitle>
      <RecommendMenuContainer>
        {recommendedMenu?.map((menu, index) => (
          <Fragment key={menu.name}>
            <RecommendMenuBox>
              <RecommendMenuName>{menu.name}</RecommendMenuName>
              <RecommendMenuPrice>{formatNumber(menu.price)}원</RecommendMenuPrice>
            </RecommendMenuBox>
            {index !== menuCount - 1 && <Line />}
          </Fragment>
        ))}
      </RecommendMenuContainer>
    </SectionWrapper>
  )
}

const MenuBoardSection = ({
  ramenyaId,
  menuBoard,
  myInfo,
  onNavigateMenuBoardImagesPage,
  onNavigateMenuBoardSubmitPage,
}: {
  ramenyaId: string
  menuBoard: RamenyaMenuBoard[]
  myInfo?: MyInfo
  onNavigateMenuBoardImagesPage: () => void
  onNavigateMenuBoardSubmitPage: () => void
}) => {
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const [selectedMenuBoardIndex, setSelectedMenuBoardIndex] = useState<number | null>(null)
  const [isRemoveMenuBoardModalOpen, setIsRemoveMenuBoardModalOpen] = useState(false)
  const menuBoardImages = menuBoard.map((menu) => menu.imageUrl)
  const selectedMenuBoard = selectedMenuBoardIndex === null ? undefined : menuBoard[selectedMenuBoardIndex]
  const deleteMenuBoardMutation = useDeleteMenuBoardMutation({
    onSuccess: () => {
      openToast('메뉴판 삭제 성공')
      queryClient.invalidateQueries({ queryKey: ramenyaQueryKeys.detail(ramenyaId) })
      setSelectedMenuBoardIndex((currentIndex) => {
        if (currentIndex === null) {
          return null
        }

        return currentIndex === 0 ? 0 : currentIndex - 1
      })
      setIsRemoveMenuBoardModalOpen(false)
    },
    onError: () => {
      openToast('메뉴판 삭제에 실패했습니다.')
    },
  })

  const closeImagePopup = () => {
    setSelectedMenuBoardIndex(null)
  }

  const closeRemoveMenuBoardModal = () => {
    if (deleteMenuBoardMutation.isPending) {
      return
    }

    setIsRemoveMenuBoardModalOpen(false)
  }

  const handleRemoveMenuBoard = () => {
    if (!selectedMenuBoard) {
      return
    }

    deleteMenuBoardMutation.mutate({
      ramenyaId,
      menuBoardId: selectedMenuBoard._id,
    })
  }

  return (
    <>
      <SectionWrapper className="gap-14">
        <SectionHeader>
          <SectionTitle>메뉴판</SectionTitle>
          {menuBoard.length > 0 && <SmallActionButton onClick={onNavigateMenuBoardSubmitPage}>등록하기</SmallActionButton>}
        </SectionHeader>
        {menuBoard.length === 0 ? (
          <EmptyBox>
            <IconMenuBoard />
            <EmptyTitle className="pt-8">등록된 메뉴판이 없습니다</EmptyTitle>
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
                  onClick={() => setSelectedMenuBoardIndex(index)}
                />
              ))}
            </HorizontalImageList>
            <Line />
            <MenuBoardViewAllButton type="button" onClick={onNavigateMenuBoardImagesPage}>
              <ButtonText>전체 메뉴판 보기</ButtonText>
              <IconArrowRight color="#888888" />
            </MenuBoardViewAllButton>
          </MenuBoardContainer>
        )}
      </SectionWrapper>

      <Modal isOpen={selectedMenuBoardIndex !== null} onClose={closeImagePopup}>
        {selectedMenuBoardIndex !== null && selectedMenuBoard && (
          <ImagePopup
            isOpen
            images={menuBoardImages}
            selectedIndex={selectedMenuBoardIndex}
            onClose={closeImagePopup}
            onIndexChange={setSelectedMenuBoardIndex}
          >
            <MenuBoardDetail
              profileImage={selectedMenuBoard.userId.profileImageUrl}
              nickname={selectedMenuBoard.userId.nickname}
              createdAt={selectedMenuBoard.createdAt}
              description={selectedMenuBoard.description}
              isMine={myInfo?._id === selectedMenuBoard.userId._id}
              onDelete={() => setIsRemoveMenuBoardModalOpen(true)}
            />
          </ImagePopup>
        )}
      </Modal>

      <Modal isOpen={isRemoveMenuBoardModalOpen} onClose={closeRemoveMenuBoardModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>메뉴판 삭제</ModalTitle>
            <ModalText>메뉴판을 삭제하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton type="button" onClick={closeRemoveMenuBoardModal} disabled={deleteMenuBoardMutation.isPending}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton type="button" onClick={handleRemoveMenuBoard} disabled={deleteMenuBoardMutation.isPending}>
              확인
            </ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>
    </>
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
          <EmptyStateImage src={emptyImage} alt="" />
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
  myInfo,
  isSignIn,
  selectedRating,
  reviews,
  onStarClick,
  onLoginClick,
  onNavigateAllReviewsPage,
  onNavigateReviewCreatePage,
}: {
  myInfo?: MyInfo
  isSignIn: boolean
  selectedRating: number
  reviews: Review[]
  onStarClick: (rating: number) => void
  onLoginClick: () => void
  onNavigateAllReviewsPage: () => void
  onNavigateReviewCreatePage: (rating?: number) => void
}) => {
  return (
    <ReviewWrapper>
      <ReviewHeader>
        <ReviewHeaderTitle>
          {isSignIn ? (
            <>
              <ReviewerName>{myInfo?.nickname}</ReviewerName>님 리뷰를 남겨주세요
            </>
          ) : (
            '로그인 후 리뷰를 남겨주세요'
          )}
        </ReviewHeaderTitle>
        <LargeStarContainer>
          {REVIEW_RATING.map((rating) => (
            <ReviewStarButton key={rating} type="button" onClick={() => onStarClick(rating)}>
              <IconStar inactive={rating > selectedRating} size={36} />
            </ReviewStarButton>
          ))}
        </LargeStarContainer>
        {!isSignIn && (
          <LoginButton type="button" onClick={onLoginClick}>
            로그인하기
          </LoginButton>
        )}
      </ReviewHeader>
      <ReviewDivider />

      <ReviewContent>
        <ReviewContentTitle>고객 리뷰</ReviewContentTitle>
        {reviews.length === 0 ? (
          <EmptyBox>
            <EmptyStateImage src={emptyReview} alt="" />
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
                <ReviewCard review={review} editable={myInfo?._id === review.userId._id} />
                {index < reviews.length - 1 && <Line />}
              </ReviewListItem>
            ))}
            <AllReviewButtonWrapper>
              <GrayActionButton type="button" className="mt-10" onClick={onNavigateAllReviewsPage}>
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

const DetailMapSection = ({
  detail,
  id,
  mapButtons,
  onOpenMapUrl,
  onOpenRaisingMap,
}: {
  detail: RamenyaDetail
  id: string
  mapButtons: MapButton[]
  onOpenMapUrl: (url: string) => void
  onOpenRaisingMap: () => void
}) => {
  const hasLocation = Boolean(detail.latitude && detail.longitude)
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
      {hasLocation && (
        <LocationWrapper>
          <SectionTitle>위치</SectionTitle>
          <StaticMapContainer>
            <NaverMap
              initialCenter={{ latitude: detail.latitude, longitude: detail.longitude }}
              initialZoom={16}
              markers={markers}
              selectedMarkerId={id}
            />
          </StaticMapContainer>
        </LocationWrapper>
      )}

      <MapRedirectButtonContainer>
        {hasLocation && (
          <MapRedirectButton type="button" onClick={onOpenRaisingMap}>
            <RaisingMapIcon src={RAISING_MAP_ICON_SRC} alt="" aria-hidden="true" />
            <MapRedirectLabel>라이징 지도 바로가기</MapRedirectLabel>
            <StyledIconArrowRight color="#888888" />
          </MapRedirectButton>
        )}

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

const PageWrapper = render.extend(PageLayout, 'items-center justify-center pb-40')

const PageContainer = render.div('flex w-full max-w-390 flex-col bg-white')

const HeaderBox = render.div('flex flex-col')

const ThumbnailContainer = render.div('flex w-full items-center justify-center')

const EmptyThumbnail = render.img('w-190 object-contain')

const MarketThumbnail = render.img('h-190 w-full object-cover object-center')

const Divider = render.div('h-8 w-full bg-divider')

const StateWrapper = render.extend(PageLayout)

const StateContent = render.div('flex min-h-0 flex-1 flex-col items-center justify-center gap-8 text-center')

const StateText = render.span('font-16-r text-gray-500')

const InformationWrapper = render.section('flex flex-col gap-16 px-20 pt-20 pb-32')

const MarketDetailTitleRow = render.div('flex items-start justify-between gap-12')

const MarketDetailTitle = render.h1('m-0 min-w-0 flex-1 font-22-sb text-black')

const BookmarkButton = render.button(
  'flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none',
)

const MarketDetailBoxContainer = render.div('flex flex-col gap-12')

const MarketDetailBox = render.div('flex items-start gap-16')

const DetailIconTagWrapper = render.div('flex items-center justify-center gap-4')

const DetailIconWrapper = render.div('flex items-center justify-center')

const DetailIconText = render.div('w-60 whitespace-nowrap font-14-r text-gray-400')

const MarketDetailReviewBox = render.div('flex items-center gap-4')

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

const BusinessHoursDay = render.span('shrink-0')

const BusinessHoursTime = render.div('flex flex-col gap-4')

const BusinessHoursTextGroup = render.div('flex flex-col gap-4')

const BusinessHoursTextLine = render.div('text-inherit')

const BreakTimeText = render.div('flex items-center gap-4')

const BreakTimeValue = render.span('text-inherit')

const InstagramLink = render.a('font-14-r text-blue')

const SectionWrapper = render.section('flex flex-col gap-16 px-20 py-32')

const SectionHeader = render.div('flex items-center justify-between')

const SectionTitle = render.h2('m-0 font-18-sb text-black')

const EmptyDescription = render.div('font-14-r text-gray-700')

const RecommendMenuContainer = render.div('flex flex-col gap-14')

const RecommendMenuBox = render.div('flex flex-col')

const RecommendMenuName = render.div('font-14-m text-black')

const RecommendMenuPrice = render.div('font-14-sb text-black')

const SmallActionButton = render.button(
  'flex h-18 w-61 cursor-pointer items-center justify-center rounded-full border border-solid border-border bg-transparent font-12-m text-gray-500 shadow-none outline-none',
)

const EmptyBox = render.div('flex flex-col items-center justify-center text-center')

const EmptyStateImage = render.img('w-80 pb-8')

const EmptyTitle = render.div('pb-4 font-16-r text-black')

const PrimaryPillButton = render.button(
  'mt-16 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-bright-orange px-32 py-10 font-16-m text-orange shadow-none outline-none',
)

const MenuBoardContainer = render.div('flex flex-col gap-10')

const HorizontalImageList = render.div('flex w-full gap-10 overflow-x-auto rounded-8')

const MenuBoardImage = render.img('h-110 w-110 cursor-pointer rounded-8 object-cover')

const GrayActionButton = render.button(
  'flex w-full cursor-pointer items-center justify-center gap-2 rounded-8 border-none bg-border py-10 font-14-m text-black shadow-none outline-none',
)

const MenuBoardViewAllButton = render.button(
  'flex h-48 w-full cursor-pointer items-center justify-center gap-2 rounded-8 border-none bg-border py-12 font-16-sb text-gray-900 shadow-none outline-none',
)

const ButtonText = render.span('text-inherit')

const ImageGrid = render.div('grid w-full grid-cols-3 overflow-hidden rounded-8 gap-1')

const ReviewImageButton = render.button('h-116 w-full cursor-pointer border-none bg-transparent p-0 shadow-none outline-none')

const ReviewImage = render.img('h-full w-full object-cover')

const MoreImageButton = render.button(
  'relative h-116 w-full cursor-pointer border-none bg-transparent p-0 shadow-none outline-none',
)

const MoreOverlay = render.div('absolute inset-0 flex items-center justify-center bg-black/50')

const MoreText = render.span('font-14-m text-white')

const ReviewWrapper = render.section('flex flex-col py-32')

const ReviewHeader = render.div('mb-32 flex flex-col items-center gap-10 px-20')

const ReviewHeaderTitle = render.div('flex items-center font-18-r text-black')

const ReviewerName = render.span('text-orange')

const LargeStarContainer = render.div('flex cursor-pointer items-center gap-2')

const ReviewStarButton = render.button('cursor-pointer border-none bg-transparent p-0 shadow-none outline-none')

const LoginButton = render.button(
  'mt-16 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-bright-orange px-32 py-10 font-16-m text-orange shadow-none outline-none',
)

const ModalContent = render.div('flex w-290 flex-col items-center justify-center gap-16 rounded-12 bg-white pt-32')

const ModalTextBox = render.div('flex flex-col')

const ModalTitle = render.div('text-center font-16-sb text-gray-900')

const ModalText = render.div('text-center font-16-r text-gray-900')

const ModalButtonBox = render.div('flex h-60 w-full')

const ModalCancelButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-black disabled:text-gray-200')

const ModalConfirmButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-orange disabled:text-gray-200')

const ReviewDivider = render.div('h-1 w-full bg-divider')

const ReviewContent = render.div('flex flex-col')

const ReviewContentTitle = render.div('pl-20 pt-20 font-18-sb text-black')

const ReviewCardContainer = render.div('flex flex-col')

const ReviewListItem = render.div('flex flex-col')

const AllReviewButtonWrapper = render.div('px-20')

const MapWrapper = render.section('flex flex-col gap-16 px-20 py-32')

const LocationWrapper = render.div('flex flex-col gap-16')

const StaticMapContainer = render.div('h-210 w-full overflow-hidden rounded-8 border border-solid border-border')

const MapRedirectButtonContainer = render.div('flex flex-col gap-8')

const MapRedirectButton = render.button(
  'flex h-52 cursor-pointer items-center gap-10 rounded-8 border border-solid border-gray-100 bg-transparent px-20 py-14 font-14-r text-black shadow-none outline-none',
)

const RaisingMapIcon = render.img('h-24 w-24 rounded-4 object-contain')

const MapRedirectLabel = render.span('text-inherit')

const StyledIconArrowRight = render.extend(IconArrowRight, 'ml-auto')

export default RamenyaDetailPage
