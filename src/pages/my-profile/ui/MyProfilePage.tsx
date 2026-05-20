import { Button } from '@/shared/ui/button'
import { IconArrowRight, IconReview, IconUnSignInUser, IconUnSignInUserProfile } from '@/shared/ui/icon'
import { LoadingLottie } from '@/shared/ui/lottie'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { useMyProfilePage } from '../model/useMyProfilePage'

const MyProfilePage = () => {
  const { profile, isSignedIn, isLoading, isError, handleProfileClick, handleLoginClick, handleReviewClick } = useMyProfilePage()

  return (
    <Layout>
      <TopBar title="마이페이지" navigate="/" />

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
          <CardLayout type="button" onClick={handleProfileClick}>
            <CardLeftSection>
              <WelcomeText>반가워요!</WelcomeText>
              <UserInfoWrapper>
                <UserName>{profile.nickname}님</UserName>
                <IconArrowRight />
              </UserInfoWrapper>
            </CardLeftSection>

            <CardRightSection>
              {profile.profileImageUrl ? (
                <UserProfileImage src={profile.profileImageUrl} alt={`${profile.nickname} 프로필`} />
              ) : (
                <IconUnSignInUserProfile />
              )}
            </CardRightSection>
          </CardLayout>

          <MyReviewContainer type="button" onClick={handleReviewClick}>
            <IconReview />
            <MyReviewText size={16} weight="m">
              작성한 리뷰
            </MyReviewText>
            <ArrowRightForReview />
          </MyReviewContainer>
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

const Layout = render.section('box-border flex min-h-[100dvh] w-full flex-col items-center gap-20 px-20')

const SignedInContent = render.section('flex w-full flex-col items-center gap-20')

const CardLayout = render.button(
  'font-20-m flex h-112 w-full cursor-pointer items-center justify-between rounded-[8px] border border-solid border-gray-100 bg-white px-20 text-left shadow-none outline-none',
)

const CardLeftSection = render.section('flex flex-col gap-4')

const CardRightSection = render.section('flex flex-col items-center justify-center')

const WelcomeText = render.span('text-orange')

const UserName = render.span('text-inherit')

const UserInfoWrapper = render.section('flex items-center gap-4')

const UserProfileImage = render.img('h-64 w-64 rounded-full object-cover')

const SignInWrapper = render.section('mt-20 flex h-full w-full flex-col items-center')

const SignInDescription = render.section('mb-40 mt-24 flex flex-col items-center gap-4 text-gray-800')

const LoginText = render.span('font-20-m')

const LoginDescription = render.span('font-18-r')

const MyReviewContainer = render.button(
  'flex w-full cursor-pointer items-center gap-8 rounded-[8px] border-0 bg-[#F9F9F9] px-12 py-20 text-left shadow-none outline-none',
)

const MyReviewText = render.extend(RaisingText, 'text-gray-900')

const ArrowRightForReview = render.extend(IconArrowRight, 'ml-auto')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default MyProfilePage
