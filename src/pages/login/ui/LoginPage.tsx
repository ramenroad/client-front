import AppleLoginButton from '@/assets/images/apple/login-button.png'
import RamenroadMainLogo from '@/assets/images/full-logo.png'
import IconGoogleImageSource from '@/assets/images/google/icon.png'
import { SocialLoginButton } from '@/features/auth'
import { IconKakao, IconNaver } from '@/shared/ui/icon'
import { Line } from '@/shared/ui/line'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { useLoginPage } from '../model/useLoginPage'

const LoginPage = () => {
  const { handleLogin, handleBack } = useLoginPage()

  return (
    <Layout variant="standalone">
      <TopBar title="" onBackClick={handleBack} />
      <LogoWrapper>
        <LogoImage src={RamenroadMainLogo} alt="ramenroad-main-logo" />
      </LogoWrapper>
      <LoginActionWrapper>
        <LoginTextWrapper>
          <Line />
          <LoginText>로그인/회원가입</LoginText>
          <Line />
        </LoginTextWrapper>
        <LoginButtonWrapper>
          <SocialLoginButton provider="kakao" type="button" onClick={() => handleLogin('kakao')} icon={<IconKakao />}>
            카카오로 계속하기
          </SocialLoginButton>
          <SocialLoginButton provider="naver" type="button" onClick={() => handleLogin('naver')} icon={<IconNaver />}>
            네이버로 계속하기
          </SocialLoginButton>
          <AppleLoginButtonImage
            type="button"
            onClick={() => handleLogin('apple')}
            aria-label="Apple로 계속하기"
          >
            <AppleLoginImage src={AppleLoginButton} alt="Apple로 계속하기" />
          </AppleLoginButtonImage>
          <SocialLoginButton
            provider="google"
            type="button"
            onClick={() => handleLogin('google')}
            icon={<IconGoogleImage src={IconGoogleImageSource} alt="" />}
          >
            Google로 계속하기
          </SocialLoginButton>
        </LoginButtonWrapper>
      </LoginActionWrapper>
    </Layout>
  )
}

const Layout = render.extend(PageLayout, 'items-center')

const LogoWrapper = render.div('mt-200 flex flex-col items-center justify-center gap-8')

const LogoImage = render.img('h-74')

const LoginText = render.span('font-14-m w-full text-gray-400')

const AppleLoginButtonImage = render.button('h-46 w-310 cursor-pointer border-0 bg-transparent p-0 shadow-none outline-none')

const AppleLoginImage = render.img('h-46 w-310')

const IconGoogleImage = render.img('h-16 w-16')

const LoginActionWrapper = render.div('mb-80 mt-auto box-border flex w-full flex-col items-center justify-center px-40')

const LoginTextWrapper = render.div('flex w-full items-center justify-center gap-8')

const LoginButtonWrapper = render.div('mt-20 flex w-full flex-col items-center justify-center gap-12')

export default LoginPage
