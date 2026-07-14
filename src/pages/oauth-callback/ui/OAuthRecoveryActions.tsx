import AppleLoginButton from '@/assets/images/apple/login-button.png'
import IconGoogleImageSource from '@/assets/images/google/icon.png'
import { SocialLoginButton, type OAuthProvider } from '@/features/auth'
import { IconKakao, IconNaver } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface OAuthRecoveryActionsProps {
  onBack: () => void
  onLogin: (provider: OAuthProvider) => void
  /**
   * 방금 실패한 제공자 — 이메일 충돌(406)에서만 넘긴다.
   *
   * 406은 "이 이메일은 **다른** 제공자로 가입돼 있다"는 뜻이므로 같은 제공자를 다시 누르면 또 406이다.
   * 제공자엔 이미 세션·동의가 있어 동의 화면도 없이 즉시 되돌아오니, 사용자 눈엔 "눌러도 같은 화면"만 반복된다.
   * 탈퇴(403)·일시 오류에선 같은 제공자 재시도가 정상이므로 넘기지 않는다.
   */
  excludeProvider?: OAuthProvider
}

export const OAuthRecoveryActions = ({ onBack, onLogin, excludeProvider }: OAuthRecoveryActionsProps) => {
  const isVisible = (provider: OAuthProvider) => provider !== excludeProvider

  return (
    <ActionsWrapper>
      {isVisible('kakao') && (
        <SocialLoginButton provider="kakao" type="button" onClick={() => onLogin('kakao')} icon={<IconKakao />}>
          카카오 계정으로 로그인
        </SocialLoginButton>
      )}
      {isVisible('naver') && (
        <SocialLoginButton provider="naver" type="button" onClick={() => onLogin('naver')} icon={<IconNaver />}>
          네이버 계정으로 로그인
        </SocialLoginButton>
      )}
      {/* 로그인 페이지에는 Apple·Google이 있는데 이 화면엔 없어서, 그 둘로 가입한 계정은 빠져나갈 길이 없었다. */}
      {isVisible('apple') && (
        <AppleLoginButtonImage type="button" onClick={() => onLogin('apple')} aria-label="Apple 계정으로 로그인">
          <AppleLoginImage src={AppleLoginButton} alt="" />
        </AppleLoginButtonImage>
      )}
      {isVisible('google') && (
        <SocialLoginButton
          provider="google"
          type="button"
          onClick={() => onLogin('google')}
          icon={<IconGoogleImage src={IconGoogleImageSource} alt="" />}
        >
          Google 계정으로 로그인
        </SocialLoginButton>
      )}
      <BackButton type="button" onClick={onBack}>
        <RaisingText size={14} weight="m">
          이전 화면으로 돌아가기
        </RaisingText>
      </BackButton>
    </ActionsWrapper>
  )
}

const ActionsWrapper = render.div('flex w-full flex-col items-center justify-center gap-12')

const AppleLoginButtonImage = render.button(
  'h-46 w-310 cursor-pointer border-0 bg-transparent p-0 shadow-none outline-none',
)

const AppleLoginImage = render.img('h-46 w-310')

const IconGoogleImage = render.img('h-16 w-16')

const BackButton = render.button(
  'flex h-46 w-310 cursor-pointer items-center justify-center gap-8 rounded-full border border-solid border-gray-100 bg-white py-11 text-black shadow-none outline-none',
)
