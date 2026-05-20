import { Button } from '@/shared/ui/button'
import { IconArrowRight, IconCamera, IconUnSignInUser, IconUnSignInUserProfile } from '@/shared/ui/icon'
import { LoadingLottie } from '@/shared/ui/lottie'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { useMyInformationPage } from '../model/useMyInformationPage'

const MyInformationPage = () => {
  const {
    profile,
    isSignedIn,
    isLoading,
    isError,
    isProfileImageUpdating,
    profileImageInputRef,
    handleProfileImageButtonClick,
    handleProfileImageChange,
    handleNicknameClick,
    handleLoginClick,
    handleWithdrawClick,
    handleLogoutClick,
  } = useMyInformationPage()

  return (
    <Layout>
      <TopBar title="내 정보" navigate="/mypage" />

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
        <Wrapper>
          <ProfileWrapper>
            <ProfileImageButton type="button" onClick={handleProfileImageButtonClick}>
              {profile.profileImageUrl ? (
                <ProfileImage src={profile.profileImageUrl} alt="profile" />
              ) : (
                <IconUnSignInUserProfile />
              )}
              <ProfileImageEditButton aria-hidden="true">
                <IconCamera />
              </ProfileImageEditButton>
              {isProfileImageUpdating && <ProfileImageDim>업로드 중</ProfileImageDim>}
            </ProfileImageButton>
            <ProfileImageInput
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
            <ProfileInfoWrapper>
              <ProfileInfo>{profile.nickname}</ProfileInfo>
            </ProfileInfoWrapper>
          </ProfileWrapper>

          <ProfileDescriptionWrapper>
            <ProfileDescription>
              <Label>닉네임</Label>
              <NicknameEditWrapper type="button" onClick={handleNicknameClick}>
                <LabelDescription>{profile.nickname}</LabelDescription>
                <IconArrowRight />
              </NicknameEditWrapper>
            </ProfileDescription>
            <ProfileDescription data-last>
              <Label>이메일</Label>
              <LabelDescription>{profile.email}</LabelDescription>
            </ProfileDescription>
          </ProfileDescriptionWrapper>

          <SignoutWrapper>
            <LogoutText type="button" onClick={handleLogoutClick}>
              로그아웃
            </LogoutText>
            <Divider />
            <LogoutText type="button" onClick={handleWithdrawClick}>
              회원탈퇴
            </LogoutText>
          </SignoutWrapper>
        </Wrapper>
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

const Layout = render.section('box-border flex min-h-[100dvh] w-full flex-col')

const Wrapper = render.div('box-border flex w-full flex-1 flex-col')

const ProfileWrapper = render.div('flex w-full flex-col items-center justify-center')

const ProfileImageButton = render.button('relative mb-22 mt-20 cursor-pointer border-0 bg-transparent p-0 shadow-none outline-none')

const ProfileImage = render.img('h-64 w-64 rounded-full bg-gray-100 object-cover')

const ProfileImageEditButton = render.div(
  'absolute bottom-0 right-0 flex h-22 w-22 items-center justify-center rounded-full border-2 border-solid border-white bg-gray-200',
)

const ProfileImageDim = render.span(
  'font-10-m absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-center text-white',
)

const ProfileImageInput = render.input('hidden')

const ProfileInfoWrapper = render.div('font-20-m flex w-full')

const ProfileInfo = render.div('flex h-full w-full flex-col items-center justify-center')

const ProfileDescriptionWrapper = render.div('mx-20 mt-32 rounded-[8px] border border-solid border-gray-100')

const ProfileDescription = render.div(
  'font-14-m box-border flex h-57 items-center justify-between border-0 border-b border-solid border-gray-100 px-20 data-[last=true]:border-b-0',
)

const NicknameEditWrapper = render.button('flex cursor-pointer items-center gap-4 border-0 bg-transparent p-0 shadow-none outline-none')

const Label = render.span('text-black')

const LabelDescription = render.span('text-gray-500')

const SignoutWrapper = render.div('mb-40 mt-auto flex w-full items-center justify-center gap-8')

const LogoutText = render.button('font-14-m cursor-pointer border-0 bg-transparent p-0 text-center text-gray-500')

const Divider = render.div('h-10 w-1 bg-gray-100')

const SignInWrapper = render.section('mx-20 mt-20 flex h-full flex-col items-center')

const SignInDescription = render.section('mb-40 mt-24 flex flex-col items-center gap-4 text-gray-800')

const LoginText = render.span('font-20-m')

const LoginDescription = render.span('font-18-r')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default MyInformationPage
