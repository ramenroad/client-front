import EmailImage from '@/assets/images/email/email.png'
import { LoadingLottie } from '@/shared/ui/lottie'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import { OAuthRecoveryActions } from './OAuthRecoveryActions'
import { useOAuthCallbackPage } from '../model/useOAuthCallbackPage'

const OAuthCallbackPage = () => {
  const { status, loginEmail, handleLogin, handleBack } = useOAuthCallbackPage()

  if (status === 'loading') {
    return (
      <Wrapper>
        <LoadingLottie />
        <LoadingText size={16} weight="m">
          로그인 작업 진행 중이에요
        </LoadingText>
      </Wrapper>
    )
  }

  if (status === 'email_conflict') {
    return (
      <Wrapper>
        <EmailIllustration src={EmailImage} alt="email" />

        <AlertContainer>
          <RaisingText size={20} weight="m">
            이미 가입된 이메일 주소입니다.
          </RaisingText>
          <SubText size={14} weight="r">
            네이버 혹은 카카오 계정을 확인해 주세요
          </SubText>
        </AlertContainer>

        {loginEmail && (
          <EmailBox>
            <RaisingText size={16} weight="b">
              {loginEmail}
            </RaisingText>
          </EmailBox>
        )}

        <LoginButtonWrapper>
          <OAuthRecoveryActions onLogin={handleLogin} onBack={handleBack} />
        </LoginButtonWrapper>
      </Wrapper>
    )
  }

  if (status === 'withdrawn') {
    return (
      <Wrapper>
        <WithdrawInformationWrapper>
          <WithdrawTitle>이미 탈퇴한 계정입니다</WithdrawTitle>
          <WithdrawDescription>
            <WithdrawDescriptionLine>회원 탈퇴한 계정으로는 30일 내</WithdrawDescriptionLine>
            <WithdrawDescriptionLine>재가입이 불가능합니다</WithdrawDescriptionLine>
          </WithdrawDescription>
        </WithdrawInformationWrapper>

        <WithdrawButtonWrapper>
          <OAuthRecoveryActions onLogin={handleLogin} onBack={handleBack} />
        </WithdrawButtonWrapper>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <ErrorInformationWrapper>
        <WithdrawTitle>로그인에 실패했어요</WithdrawTitle>
        <WithdrawDescription>
          <WithdrawDescriptionLine>잠시 후 다시 시도해 주세요.</WithdrawDescriptionLine>
        </WithdrawDescription>
      </ErrorInformationWrapper>
      <WithdrawButtonWrapper>
        <OAuthRecoveryActions onLogin={handleLogin} onBack={handleBack} />
      </WithdrawButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = render.section('flex min-h-[100dvh] w-full flex-col items-center justify-center')

const LoadingText = render.extend(RaisingText, 'mt-12 text-gray-500')

const EmailIllustration = render.img('h-82 w-110')

const WithdrawInformationWrapper = render.div('box-border flex w-full flex-1 flex-col gap-8 px-20 pt-54')

const ErrorInformationWrapper = render.div('box-border flex w-full flex-1 flex-col gap-8 px-20 pt-154')

const SubText = render.extend(RaisingText, 'text-gray-400')

const AlertContainer = render.div('mt-20 flex w-full flex-col items-center justify-center gap-6')

const EmailBox = render.div('mt-32 flex h-90 w-350 items-center justify-center rounded-[8px] bg-[#f9f9f9]')

const WithdrawButtonWrapper = render.div('mb-154 flex w-full flex-col items-center justify-center gap-12')

const LoginButtonWrapper = render.div('mt-66 flex w-full flex-col items-center justify-center gap-12')

const WithdrawTitle = render.span('text-[24px] font-regular leading-36 tracking-[-2%] text-black')

const WithdrawDescription = render.div('font-16-r flex flex-col leading-24 tracking-[-2%] text-gray-500')

const WithdrawDescriptionLine = render.span('text-inherit')

export default OAuthCallbackPage
