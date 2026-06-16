import { Button } from '@/shared/ui/button'
import {
  IconArrowRight,
  IconBookmark,
  IconFeedback,
  IconMyComment,
  IconMyPost,
  IconMyReview,
  IconPolicy,
  IconRamenCalendar,
  IconRecentStore,
  IconSavedPost,
  IconUnSignInUser,
  IconUnSignInUserProfile,
} from '@/shared/ui/icon'
import { LoadingLottie } from '@/shared/ui/lottie'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { useAppEnv } from '@/shared/app-env'
import { useMyProfilePage } from '../model/useMyProfilePage'

const MyProfilePage = () => {
  const {
    profile,
    isSignedIn,
    isLoading,
    isError,
    handleProfileClick,
    handleLoginClick,
    handleCalendarClick,
    handleActivityClick,
    handleSavedStoreClick,
    handleSearchClick,
    handleFeedbackClick,
    handlePolicyClick,
    handleNotReady,
  } = useMyProfilePage()

  // 앱에선 마이페이지가 탭 루트라 뒤로가기 불필요 → 숨김. 웹은 기존대로(홈으로).
  const { isApp } = useAppEnv()

  const activityItems = [
    { label: '라멘 캘린더', icon: <IconRamenCalendar />, onClick: handleCalendarClick },
    { label: '작성한 리뷰', icon: <IconMyReview />, onClick: () => handleActivityClick('review') },
    { label: '작성한 게시글', icon: <IconMyPost />, onClick: () => handleActivityClick('post') },
    { label: '작성한 댓글', icon: <IconMyComment />, onClick: () => handleActivityClick('comment') },
  ]

  const searchItems = [
    { label: '저장한 글', icon: <IconSavedPost />, onClick: handleNotReady },
    { label: '저장한 매장', icon: <IconBookmark active size={22} />, onClick: handleSavedStoreClick },
    { label: '최근 본 매장', icon: <IconRecentStore />, onClick: handleSearchClick },
  ]

  const supportItems = [
    // 공지사항/패치노트는 서버에 작성 기능이 없어 임시로 숨김.
    { label: '의견 남기기', icon: <IconFeedback />, onClick: handleFeedbackClick },
    { label: '약관 및 정책', icon: <IconPolicy />, onClick: handlePolicyClick },
  ]

  return (
    <Layout variant="appBar">
      <TopBar title="마이페이지" navigate="/" hideBack={isApp} />

      {isLoading && (
        <StateWrapper>
          <LoadingLottie />
          <StateText size={16} weight="m">
            내 정보를 불러오는 중이에요
          </StateText>
        </StateWrapper>
      )}

      {isError && (
        <StateWrapper>
          <StateText size={16} weight="m">
            내 정보를 불러오지 못했어요.
          </StateText>
        </StateWrapper>
      )}

      {!isLoading && !isError && isSignedIn && profile && (
        <SignedInContent>
          <ProfileCard type="button" onClick={handleProfileClick}>
            <CardLeft>
              <WelcomeText>반가워요!</WelcomeText>
              <NameRow>
                <UserName>{profile.nickname}님</UserName>
                <IconArrowRight />
              </NameRow>
            </CardLeft>
            <CardRight>
              {profile.profileImageUrl ? (
                <UserProfileImage src={profile.profileImageUrl} alt={`${profile.nickname} 프로필`} />
              ) : (
                <IconUnSignInUserProfile />
              )}
            </CardRight>
          </ProfileCard>

          <Section>
            <SectionLabel>내 활동</SectionLabel>
            <MenuList>
              {activityItems.map((item) => (
                <MenuItemButton key={item.label} type="button" onClick={item.onClick}>
                  <MenuIcon>{item.icon}</MenuIcon>
                  <MenuLabel>{item.label}</MenuLabel>
                  <MenuChevron />
                </MenuItemButton>
              ))}
            </MenuList>
          </Section>

          <Section>
            <SectionLabel>내 탐색</SectionLabel>
            <MenuList>
              {searchItems.map((item) => (
                <MenuItemButton key={item.label} type="button" onClick={item.onClick}>
                  <MenuIcon>{item.icon}</MenuIcon>
                  <MenuLabel>{item.label}</MenuLabel>
                  <MenuChevron />
                </MenuItemButton>
              ))}
            </MenuList>
          </Section>

          <SectionDivider />

          <Section>
            <SectionLabel>고객지원</SectionLabel>
            <MenuList>
              {supportItems.map((item) => (
                <MenuItemButton key={item.label} type="button" onClick={item.onClick}>
                  <MenuIcon>{item.icon}</MenuIcon>
                  <MenuLabel>{item.label}</MenuLabel>
                  <MenuChevron />
                </MenuItemButton>
              ))}
            </MenuList>
          </Section>
        </SignedInContent>
      )}

      {!isLoading && !isError && (!isSignedIn || !profile) && (
        <SignInWrapper>
          <IconUnSignInUser />
          <SignInDescription>
            <LoginText>로그인 후 이용해주세요.</LoginText>
            <LoginDescription>간편 로그인으로 쉽게 가능해요.</LoginDescription>
          </SignInDescription>
          <Button onClick={handleLoginClick}>로그인/회원가입</Button>
        </SignInWrapper>
      )}
    </Layout>
  )
}

const Layout = render.extend(PageLayout, 'items-center gap-20 px-20')

const SignedInContent = render.section('flex w-full flex-col pb-32')

const ProfileCard = render.button(
  'flex h-112 w-full cursor-pointer items-center justify-between rounded-12 border border-solid border-gray-100 bg-white px-20 text-left shadow-none outline-none',
)

const CardLeft = render.section('flex flex-col gap-4')

const CardRight = render.section('flex items-center justify-center')

const WelcomeText = render.span('font-18-m text-orange')

const NameRow = render.section('flex items-center gap-4')

const UserName = render.span('font-20-m text-gray-900')

const UserProfileImage = render.img('h-64 w-64 rounded-full object-cover')

const Section = render.section('mt-24 flex w-full flex-col')

const SectionLabel = render.span('mb-4 font-14-r text-gray-400')

const MenuList = render.div('flex flex-col')

const MenuItemButton = render.button(
  'flex h-56 w-full cursor-pointer items-center gap-12 border-none bg-transparent px-0 text-left shadow-none outline-none',
)

const MenuIcon = render.div('flex h-24 w-24 shrink-0 items-center justify-center')

const MenuLabel = render.span('font-16-m text-gray-900')

const MenuChevron = render.extend(IconArrowRight, 'ml-auto')

const SectionDivider = render.div('mt-24 h-1 w-full bg-gray-100')

const SignInWrapper = render.section('mt-20 flex h-full w-full flex-col items-center')

const SignInDescription = render.section('mb-40 mt-24 flex flex-col items-center gap-4 text-gray-800')

const LoginText = render.span('font-20-m')

const LoginDescription = render.span('font-18-r')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default MyProfilePage
