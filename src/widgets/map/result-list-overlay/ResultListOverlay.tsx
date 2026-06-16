import storeImage from '@/assets/images/store.png'
import { Fragment, useCallback, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  checkBusinessStatus,
  checkBusinessStatusSpecial,
  DAY_MAP,
  getTodayBusinessHour,
  OpenStatus,
  sortBusinessHoursByCurrentDay,
  type BusinessHour,
  type FilterOptions,
  type RamenyaDetail,
} from '@/entities/ramenya/model'
import { RamenyaCard, RamenyaOpenStatus } from '@/entities/ramenya/ui'
import type { Review } from '@/entities/review/model'
import { createSiteUrl } from '@/shared/config'
import type { Coordinate } from '@/shared/lib/naver-map'
import { formatNumber } from '@/shared/lib/number'
import {
  IconArrowRight,
  IconBar,
  IconBookmark,
  IconCall,
  IconDropDown,
  IconDropDownSelected,
  IconInstagram,
  IconLocate,
  IconShare,
  IconRamenCalendarOutline,
  IconStar,
  IconTag,
  IconTime,
} from '@/shared/ui/icon'
import { Line } from '@/shared/ui/line'
import { NoStoreBox } from '@/shared/ui/no-store-box'
import { RatingStars } from '@/shared/ui/rating'
import render from '@/shared/ui/render'
import { ShareModal } from '@/shared/ui/share-modal'
import { TopBar } from '@/shared/ui/top-bar'
import { useShare } from '@/shared/lib/useShare'
import { useResultListOverlay } from './model/useResultListOverlay'

export interface ResultListItem<T> {
  id: string
  name: string
  address: string
  latitude?: number
  longitude?: number
  genre: string[]
  thumbnailUrl: string
  rating: number
  reviewCount: number
  businessHours: BusinessHour[]
  ramenya: T
}

type FilterSectionComponent = ComponentType<{
  filterOptions: FilterOptions
  onFilterChange: (filterOptions: FilterOptions) => void
}>

type ReviewCardComponent = ComponentType<{
  review: Review
  editable: boolean
}>

interface ResultListOverlayProps<T> {
  FilterSection: FilterSectionComponent
  ReviewCard: ReviewCardComponent
  items: ResultListItem<T>[]
  height: string
  selectedId?: string | null
  currentLocation?: Coordinate | null
  filterOptions: FilterOptions
  detail?: RamenyaDetail | null
  detailReviews?: Review[]
  detailId?: string | null
  isDetailOpen: boolean
  isDetailLoading?: boolean
  isDetailError?: boolean
  isDetailReviewsLoading?: boolean
  isDetailReviewsError?: boolean
  searchBarBottomPx?: number
  bookmarkedIds?: ReadonlySet<string>
  onHeightChange: (height: string) => void
  onSearchBarOverlapChange?: (overlapping: boolean) => void
  onFilterChange: (filterOptions: FilterOptions) => void
  onSelect: (item: T) => void
  onOpenDetail: (item: T) => void
  onCloseDetail: () => void
  onBookmarkToggle?: (ramenyaId: string) => void
  onCalendarAddOpen?: (ramenya: CalendarAddRamenya) => void
}

type DetailContent = {
  id: string
  name: string
  address: string
  genre: string[]
  thumbnailUrl?: string
  rating?: number
  reviewCount?: number
  businessHours: BusinessHour[]
  contactNumber?: string
  instagramProfile?: string
  recommendedMenu?: RamenyaDetail['recommendedMenu']
}

type CalendarAddRamenya = {
  _id: string
  name: string
}

const MAP_RESULT_SCROLL_STORAGE_KEY = 'mapResultListScrollTop'

const getStoredScrollTop = (): number => {
  if (typeof window === 'undefined') {
    return 0
  }

  const storedScrollTop = Number(window.sessionStorage.getItem(MAP_RESULT_SCROLL_STORAGE_KEY))

  return Number.isFinite(storedScrollTop) ? storedScrollTop : 0
}

const saveScrollTop = (scrollTop: number) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(MAP_RESULT_SCROLL_STORAGE_KEY, String(scrollTop))
}

export const ResultListOverlay = <T,>({
  FilterSection,
  ReviewCard,
  height,
  items,
  selectedId,
  currentLocation,
  filterOptions,
  detail,
  detailReviews = [],
  detailId,
  isDetailOpen,
  isDetailLoading = false,
  isDetailError = false,
  isDetailReviewsLoading = false,
  isDetailReviewsError = false,
  searchBarBottomPx = 0,
  bookmarkedIds,
  onHeightChange,
  onSearchBarOverlapChange,
  onFilterChange,
  onSelect,
  onOpenDetail,
  onCloseDetail,
  onBookmarkToggle,
  onCalendarAddOpen,
}: ResultListOverlayProps<T>) => {
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLElement | null>(null)
  const listContentRef = useRef<HTMLElement | null>(null)
  const lastOverlapRef = useRef<boolean | null>(null)
  const initialScrollTop = useMemo(() => getStoredScrollTop(), [])
  const listScrollTopRef = useRef(initialScrollTop)
  const itemIds = useMemo(() => items.map((item) => item.id), [items])
  const selectedItem = useMemo(
    () => items.find((item) => item.id === (detailId ?? selectedId)) ?? null,
    [detailId, items, selectedId],
  )
  const { containerStyle, activeHeightDvh, isContentCollapsed, dragHandleProps, registerItemRef } = useResultListOverlay({
    currentHeight: height,
    itemIds,
    selectedId,
    onHeightChange,
  })

  // 시트가 검색창 영역을 침범하면 검색창을 숨기도록 상위에 알린다.
  // 주의: CSS height transition 도중 시트 자신의 getBoundingClientRect()는 시작 시점에 '이전 높이'를
  // 반환해 stale 하다. 그래서 transition 대상이 아닌 offsetParent(MapScreen)의 안정적 하단 +
  // 목표 높이(activeHeightDvh)로 시트 상단을 수학적으로 계산해, 드래그/프로그램 변경 모두에서 정확히 판정한다.
  useLayoutEffect(() => {
    if (!onSearchBarOverlapChange) {
      return
    }

    const evaluateOverlap = () => {
      const node = overlayRef.current
      const container = node?.offsetParent as HTMLElement | null

      if (!container) {
        return
      }

      const viewportHeight = window.innerHeight
      const overlayHeightPx = (activeHeightDvh / 100) * viewportHeight
      const overlayTop = container.getBoundingClientRect().bottom - overlayHeightPx
      const overlapping = overlayTop < searchBarBottomPx

      if (lastOverlapRef.current !== overlapping) {
        lastOverlapRef.current = overlapping
        onSearchBarOverlapChange(overlapping)
      }
    }

    evaluateOverlap()

    const visualViewport = window.visualViewport
    window.addEventListener('resize', evaluateOverlap)
    window.addEventListener('orientationchange', evaluateOverlap)
    visualViewport?.addEventListener('resize', evaluateOverlap)

    return () => {
      window.removeEventListener('resize', evaluateOverlap)
      window.removeEventListener('orientationchange', evaluateOverlap)
      visualViewport?.removeEventListener('resize', evaluateOverlap)
    }
  }, [activeHeightDvh, searchBarBottomPx, onSearchBarOverlapChange])

  const rememberListScrollTop = useCallback(() => {
    if (!listContentRef.current) {
      return
    }

    listScrollTopRef.current = listContentRef.current.scrollTop
    saveScrollTop(listScrollTopRef.current)
  }, [])

  const handleListContentRef = useCallback((node: unknown) => {
    if (!(node instanceof HTMLElement)) {
      listContentRef.current = null
      return
    }

    listContentRef.current = node
    node.scrollTop = listScrollTopRef.current
  }, [])

  const handleItemClick = (item: ResultListItem<T>) => {
    if (selectedId === item.id) {
      rememberListScrollTop()
      onOpenDetail(item.ramenya)
      return
    }

    onSelect(item.ramenya)
  }

  const handleDetailPageOpen = useCallback(
    (id: string) => {
      navigate(`/detail/${id}`)
    },
    [navigate],
  )

  return (
    <OverlayContainer ref={overlayRef} style={containerStyle}>
      <DragHandle {...dragHandleProps}>
        <Handle aria-hidden="true" />
      </DragHandle>

      {isContentCollapsed ? null : isDetailOpen ? (
        <MapDetailSheetContent
          key={detailId ?? selectedItem?.id ?? 'detail'}
          ReviewCard={ReviewCard}
          id={detailId ?? selectedItem?.id ?? ''}
          selectedItem={selectedItem}
          detail={detail}
          reviews={detailReviews}
          isLoading={isDetailLoading}
          isError={isDetailError}
          isReviewsLoading={isDetailReviewsLoading}
          isReviewsError={isDetailReviewsError}
          bookmarkedIds={bookmarkedIds}
          onBack={onCloseDetail}
          onDetailPageOpen={handleDetailPageOpen}
          onBookmarkToggle={onBookmarkToggle}
          onCalendarAddOpen={onCalendarAddOpen}
        />
      ) : (
        <>
          <FilterSection filterOptions={filterOptions} onFilterChange={onFilterChange} />

          <ListContentArea ref={handleListContentRef} onScroll={rememberListScrollTop}>
            {items.map((item) => (
              <ListItem key={item.id} ref={registerItemRef(item.id)}>
                <RamenyaCard
                  _id={item.id}
                  name={item.name}
                  address={item.address}
                  latitude={item.latitude}
                  longitude={item.longitude}
                  genre={item.genre}
                  thumbnailUrl={item.thumbnailUrl}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  businessHours={item.businessHours}
                  isSelected={selectedId === item.id}
                  currentLocation={currentLocation}
                  actionSlot={
                    onBookmarkToggle && (
                      <BookmarkToggleButton
                        type="button"
                        aria-pressed={Boolean(bookmarkedIds?.has(item.id))}
                        aria-label={bookmarkedIds?.has(item.id) ? `${item.name} 저장 해제` : `${item.name} 저장`}
                        onClick={(event) => {
                          event.stopPropagation()
                          onBookmarkToggle(item.id)
                        }}
                      >
                        <IconBookmark active={Boolean(bookmarkedIds?.has(item.id))} />
                      </BookmarkToggleButton>
                    )
                  }
                  onClick={() => handleItemClick(item)}
                />
                <LineWrapper>
                  <Line />
                </LineWrapper>
              </ListItem>
            ))}

            {items.length === 0 && <NoStoreBox type="map" />}
          </ListContentArea>
        </>
      )}
    </OverlayContainer>
  )
}

const createDetailContent = <T,>({
  id,
  selectedItem,
  detail,
}: {
  id: string
  selectedItem?: ResultListItem<T> | null
  detail?: RamenyaDetail | null
}): DetailContent | null => {
  if (detail) {
    return {
      id: detail._id ?? id,
      name: detail.name,
      address: detail.address,
      genre: detail.genre,
      thumbnailUrl: detail.thumbnailUrl,
      rating: detail.rating,
      reviewCount: detail.reviewCount,
      businessHours: detail.businessHours,
      contactNumber: detail.contactNumber,
      instagramProfile: detail.instagramProfile,
      recommendedMenu: detail.recommendedMenu,
    }
  }

  if (!selectedItem) {
    return null
  }

  return {
    id: selectedItem.id,
    name: selectedItem.name,
    address: selectedItem.address,
    genre: selectedItem.genre,
    thumbnailUrl: selectedItem.thumbnailUrl,
    rating: selectedItem.rating,
    reviewCount: selectedItem.reviewCount,
    businessHours: selectedItem.businessHours,
  }
}

const MapDetailSheetContent = <T,>({
  ReviewCard,
  id,
  selectedItem,
  detail,
  reviews,
  isLoading,
  isError,
  isReviewsLoading,
  isReviewsError,
  bookmarkedIds,
  onBack,
  onDetailPageOpen,
  onBookmarkToggle,
  onCalendarAddOpen,
}: {
  ReviewCard: ReviewCardComponent
  id: string
  selectedItem?: ResultListItem<T> | null
  detail?: RamenyaDetail | null
  reviews: Review[]
  isLoading: boolean
  isError: boolean
  isReviewsLoading: boolean
  isReviewsError: boolean
  bookmarkedIds?: ReadonlySet<string>
  onBack: () => void
  onDetailPageOpen: (id: string) => void
  onBookmarkToggle?: (ramenyaId: string) => void
  onCalendarAddOpen?: (ramenya: CalendarAddRamenya) => void
}) => {
  const [isTimeExpanded, setIsTimeExpanded] = useState(false)
  const content = useMemo(() => createDetailContent({ id, selectedItem, detail }), [detail, id, selectedItem])
  // 미니 상세뷰는 자체 URL이 없어, 공유는 해당 매장의 상세 페이지(/detail/:id)를 가리킨다.
  const share = useShare({
    title: content?.name ?? '라이징',
    url: content ? createSiteUrl(`/detail/${content.id}`) : undefined,
    description: content?.address ?? '',
    text: content?.address ?? '',
    imageUrl: content?.thumbnailUrl,
    buttonTitle: '매장 보러가기',
  })

  if (!content) {
    return (
      <DetailStateWrapper>
        <TopBar title="매장 상세" onBackClick={onBack} />
        <DetailStateText>
          {isLoading
            ? '매장 상세 정보를 불러오는 중입니다.'
            : isError
              ? '매장 상세 정보를 불러오지 못했습니다.'
              : '선택한 매장 정보를 확인하지 못했습니다.'}
        </DetailStateText>
      </DetailStateWrapper>
    )
  }

  const businessStatus = checkBusinessStatus(content.businessHours)
  const businessStatusSpecial = checkBusinessStatusSpecial(content.businessHours)
  const todayBusinessHour = getTodayBusinessHour(content.businessHours)
  const sortedBusinessHours = sortBusinessHoursByCurrentDay(content.businessHours)
  const operatingTimeText = todayBusinessHour?.isOpen
    ? todayBusinessHour.operatingTime
    : businessStatusSpecial.closeInformation
  const recommendedMenu = content.recommendedMenu ?? []
  const menuCount = recommendedMenu.length
  const hasRating = Boolean(content.reviewCount && content.reviewCount > 0)

  return (
    <>
      <TopBar title={content.name} onBackClick={onBack} icon={<IconShare />} onIconClick={share.openShare} />

      <ShareModal isOpen={share.isShareOpen} onClose={share.closeShare} onShare={share.handleShare} />

      <DetailContentArea>
        <ThumbnailContainer>
          {content.thumbnailUrl ? (
            <MarketThumbnail src={content.thumbnailUrl} alt={content.name} />
          ) : (
            <EmptyThumbnail src={storeImage} alt="" />
          )}
        </ThumbnailContainer>

        <InformationWrapper>
          <MarketDetailTitleRow>
            <MarketDetailTitle>{content.name}</MarketDetailTitle>
            <HeaderActionGroup>
              {onCalendarAddOpen && (
                <CalendarAddButton
                  type="button"
                  aria-label={`${content.name} 라멘 캘린더에 추가`}
                  onClick={() => onCalendarAddOpen({ _id: content.id, name: content.name })}
                >
                  <IconRamenCalendarOutline width={26} height={26} />
                  <CalendarAddBadge aria-hidden="true">
                    <CalendarAddPlusHorizontal />
                    <CalendarAddPlusVertical />
                  </CalendarAddBadge>
                </CalendarAddButton>
              )}
              {onBookmarkToggle && (
                <BookmarkButton
                  type="button"
                  aria-pressed={Boolean(bookmarkedIds?.has(content.id))}
                  aria-label={bookmarkedIds?.has(content.id) ? `${content.name} 저장 해제` : `${content.name} 저장`}
                  onClick={() => onBookmarkToggle(content.id)}
                >
                  <IconBookmark active={Boolean(bookmarkedIds?.has(content.id))} size={28} />
                </BookmarkButton>
              )}
            </HeaderActionGroup>
          </MarketDetailTitleRow>
          <MarketDetailBoxContainer>
            <MarketDetailBox>
              <DetailIconTag icon={<IconStar inactive />} text="평점" />
              <MarketDetailReviewBox>
                <RatingStars rating={hasRating ? content.rating ?? 0 : 0} />
                <MarketDetailReviewScore>{hasRating ? content.rating?.toFixed(1) : '-'}</MarketDetailReviewScore>
                <MarketDetailReviewCount>({content.reviewCount ?? 0})</MarketDetailReviewCount>
              </MarketDetailReviewBox>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconTag />} text="장르" />
              <MarketDetailGenreBox>
                {content.genre.map((genre, index) => (
                  <MarketDetailGenre key={genre}>
                    <MarketDetailGenreText>{genre}</MarketDetailGenreText>
                    {index < content.genre.length - 1 && <IconBar />}
                  </MarketDetailGenre>
                ))}
              </MarketDetailGenreBox>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconLocate />} text="주소" />
              <MarketDetailBoxText>{content.address}</MarketDetailBoxText>
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
                            <BusinessHoursDay>{DAY_MAP[businessHour.day] ?? businessHour.day}</BusinessHoursDay>
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
                <MarketDetailBoxText>{content.contactNumber || '미공개'}</MarketDetailBoxText>
              </MarketDetailBoxContent>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconInstagram />} text="인스타그램" />
              <MarketDetailBoxContent>
                {content.instagramProfile ? (
                  <InstagramLink href={content.instagramProfile} target="_blank" rel="noopener noreferrer">
                    {content.instagramProfile}
                  </InstagramLink>
                ) : (
                  <MarketDetailBoxText>미공개</MarketDetailBoxText>
                )}
              </MarketDetailBoxContent>
            </MarketDetailBox>
          </MarketDetailBoxContainer>
        </InformationWrapper>

        <Divider />

        <SectionWrapper>
          <SectionTitle>라이징 추천 메뉴</SectionTitle>
          <RecommendMenuContainer>
            {recommendedMenu.map((menu, index) => (
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

        <Divider />

        <MapReviewSection
          ReviewCard={ReviewCard}
          reviews={reviews}
          reviewCount={content.reviewCount ?? 0}
          isLoading={isReviewsLoading}
          isError={isReviewsError}
        />

        <DetailPageLinkSection>
          <DetailPageLinkButton
            type="button"
            onClick={() => onDetailPageOpen(content.id)}
            aria-label={`${content.name} 상세 페이지로 이동`}
          >
            상세 페이지로 이동
            <IconArrowRight color="currentColor" />
          </DetailPageLinkButton>
        </DetailPageLinkSection>
      </DetailContentArea>
    </>
  )
}

const MapReviewSection = ({
  ReviewCard,
  reviews,
  reviewCount,
  isLoading,
  isError,
}: {
  ReviewCard: ReviewCardComponent
  reviews: Review[]
  reviewCount: number
  isLoading: boolean
  isError: boolean
}) => {
  const hasReviews = reviews.length > 0

  return (
    <MapReviewWrapper>
      <MapReviewTitle>
        고객 리뷰
        <MapReviewCount>{reviewCount}개</MapReviewCount>
      </MapReviewTitle>

      {isLoading && !hasReviews && <ReviewStateBox>리뷰를 불러오는 중이에요</ReviewStateBox>}
      {isError && !hasReviews && <ReviewStateBox>리뷰를 불러오지 못했어요.</ReviewStateBox>}
      {!isLoading && !isError && !hasReviews && <ReviewStateBox>등록된 리뷰가 없습니다.</ReviewStateBox>}
      {hasReviews && (
        <MapReviewCardContainer>
          {reviews.map((review, index) => (
            <MapReviewItem key={review._id}>
              <ReviewCard review={review} editable={false} />
              {index < reviews.length - 1 && <Line />}
            </MapReviewItem>
          ))}
        </MapReviewCardContainer>
      )}
    </MapReviewWrapper>
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

const OverlayContainer = render.section(
  'absolute bottom-0 left-0 right-0 z-[110] flex min-h-0 flex-col overflow-hidden rounded-t-16 border border-solid border-divider/20 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.1)] [isolation:isolate] [transform:translateZ(0)] [will-change:transform]',
)

const DragHandle = render.div(
  'flex h-20 w-full cursor-grab touch-none select-none items-center justify-center outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-orange/40',
)

const Handle = render.div('h-4 w-36 rounded-full bg-divider')

// 앱: 마지막 카드가 네이티브 탭바에 가리지 않게 하단에 탭바 높이(--safe-bottom)만큼 여백. 웹은 0.
const ListContentArea = render.div('hide-scrollbar flex-1 overflow-y-auto pb-[var(--safe-bottom)]')

const ListItem = render.div('')

const BookmarkToggleButton = render.button(
  'flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none',
)

const LineWrapper = render.div('px-20')

const ThumbnailContainer = render.div('flex w-full items-center justify-center')

const EmptyThumbnail = render.img('w-190 object-contain')

const MarketThumbnail = render.img('h-190 w-full object-cover object-center')

const Divider = render.div('h-8 w-full bg-divider')

// 앱: 미니 상세뷰 하단(상세 페이지 이동 버튼 등)이 네이티브 탭바에 가리지 않게 탭바 높이(--safe-bottom)만큼 여백. 웹은 0.
const DetailContentArea = render.div('hide-scrollbar flex-1 overflow-y-auto pb-[var(--safe-bottom)]')

const InformationWrapper = render.section('flex flex-col gap-16 px-20 pt-20 pb-32')

const MarketDetailTitleRow = render.div('flex items-start justify-between gap-12')

const MarketDetailTitle = render.h1('m-0 min-w-0 flex-1 font-22-sb text-black')

const HeaderActionGroup = render.div('flex shrink-0 items-center gap-10')

const CalendarAddButton = render.button(
  'relative flex h-28 w-28 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none',
)

const CalendarAddBadge = render.span(
  'absolute -right-2 -bottom-2 flex h-13 w-13 items-center justify-center rounded-full border-2 border-solid border-white bg-gray-700',
)

const CalendarAddPlusHorizontal = render.span(
  'absolute left-1/2 top-1/2 h-[1.5px] w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white',
)

const CalendarAddPlusVertical = render.span(
  'absolute left-1/2 top-1/2 h-7 w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white',
)

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

const MarketDetailReviewCount = render.span('font-12-r text-gray-700')

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

const SectionTitle = render.h2('m-0 font-18-sb text-black')

const RecommendMenuContainer = render.div('flex flex-col gap-14')

const RecommendMenuBox = render.div('flex flex-col gap-2')

const RecommendMenuName = render.div('font-14-m text-black')

const RecommendMenuPrice = render.div('font-14-sb text-black')

const MapReviewWrapper = render.section('flex flex-col py-32')

const MapReviewTitle = render.h2('m-0 flex items-center gap-4 px-20 font-18-sb text-black')

const MapReviewCount = render.span('font-14-m text-orange')

const MapReviewCardContainer = render.div('flex flex-col')

const MapReviewItem = render.div('flex flex-col')

const ReviewStateBox = render.div('flex min-h-160 items-center justify-center px-20 text-center font-14-r text-gray-500')

const DetailPageLinkSection = render.section('px-20 pb-32')

const DetailPageLinkButton = render.button(
  'flex h-48 w-full cursor-pointer items-center justify-center gap-4 rounded-8 border-none bg-orange px-16 font-16-sb text-white shadow-none outline-none transition-colors active:bg-orange/90',
)

const DetailStateWrapper = render.div('flex flex-1 flex-col')

const DetailStateText = render.div('flex flex-1 items-center justify-center px-20 text-center font-15-r text-gray-500')
