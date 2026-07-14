import EmailImage from '@/assets/images/email/email.png'
import { LoadingLottie } from '@/shared/ui/lottie'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import { OAuthRecoveryActions } from './OAuthRecoveryActions'
import { useOAuthCallbackPage } from '../model/useOAuthCallbackPage'

const PROVIDER_LABEL: Record<string, string> = {
  kakao: '카카오',
  naver: '네이버',
  google: 'Google',
  apple: 'Apple',
}

const OAuthCallbackPage = () => {
  const { status, loginEmail, attemptedProvider, handleLogin, handleBack } = useOAuthCallbackPage()
  const attemptedLabel = attemptedProvider ? PROVIDER_LABEL[attemptedProvider] : undefined

  if (status === 'loading') {
    return (
      <Wrapper variant="standalone">
        <LoadingLottie />
        <LoadingText size={16} weight="m">
          로그인 작업 진행 중이에요
        </LoadingText>
      </Wrapper>
    )
  }

  if (status === 'email_conflict') {
    return (
      <Wrapper variant="standalone">
        <EmailIllustration src={EmailImage} alt="email" />

        <AlertContainer>
          <RaisingText size={20} weight="m">
            이미 가입된 이메일 주소입니다.
          </RaisingText>
          {/* 어느 계정으로 가입했는지 알려주지 않으면 사용자는 버튼을 찍어야 한다. 최소한 "이건 아니다"는 알려준다. */}
          <SubText size={14} weight="r">
            {attemptedLabel
              ? `${attemptedLabel}로 가입된 계정이 아니에요`
              : '다른 소셜 계정으로 가입되어 있어요'}
          </SubText>
          <SubText size={14} weight="r">
            가입에 사용한 계정으로 로그인해 주세요
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
      <Wrapper variant="standalone">
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
    <Wrapper variant="standalone">
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

const Wrapper = render.extend(PageLayout, 'items-center justify-center')

const LoadingText = render.extend(RaisingText, 'mt-12 text-gray-500')

const EmailIllustration = render.img('h-82 w-110')

const WithdrawInformationWrapper = render.div('box-border flex w-full flex-1 flex-col gap-8 px-20 pt-54')

const ErrorInformationWrapper = render.div('box-border flex w-full flex-1 flex-col gap-8 px-20 pt-154')

const SubText = render.extend(RaisingText, 'text-gray-400')

const AlertContainer = render.div('mt-20 flex w-full flex-col items-center justify-center gap-6')

const EmailBox = render.div('mt-32 flex h-90 w-350 items-center justify-center rounded-8 bg-[#f9f9f9]')

const WithdrawButtonWrapper = render.div('mb-154 flex w-full flex-col items-center justify-center gap-12')

const LoginButtonWrapper = render.div('mt-66 flex w-full flex-col items-center justify-center gap-12')

const WithdrawTitle = render.span('text-[24px] font-regular leading-36 tracking-[-2%] text-black')

const WithdrawDescription = render.div('font-16-r flex flex-col leading-24 tracking-[-2%] text-gray-500')

const WithdrawDescriptionLine = render.span('text-inherit')

export default OAuthCallbackPage
