import AppleLoginButton from '@/assets/images/apple/login-button.png'
import IconGoogleImageSource from '@/assets/images/google/icon.png'
import { SocialLoginButton, type OAuthProvider } from '@/features/auth'
import { IconKakao, IconNaver } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface OAuthRecoveryActionsProps {
  onBack: () => void
  onLogin: (provider: OAuthProvider) => void
}

/**
 * 로그인 실패·이메일 충돌·탈퇴 화면의 복구 수단.
 *
 * 어느 상태에서든 **로그인 페이지와 똑같이 4개 제공자를 모두** 보여준다. 한때 카카오·네이버만 있었는데,
 * 그러면 Apple·Google로 가입한 계정은 이 화면에서 빠져나갈 길이 아예 없었다.
 * "방금 실패한 제공자"는 버튼에서 빼지 않고 안내 문구로 알린다 — 화면마다 버튼 구성이 달라지면
 * 사용자가 "왜 내 로그인 방식이 안 보이지?"로 더 헤맨다.
 */
export const OAuthRecoveryActions = ({ onBack, onLogin }: OAuthRecoveryActionsProps) => {
  return (
    <ActionsWrapper>
      <SocialLoginButton provider="kakao" type="button" onClick={() => onLogin('kakao')} icon={<IconKakao />}>
        카카오 계정으로 로그인
      </SocialLoginButton>
      <SocialLoginButton provider="naver" type="button" onClick={() => onLogin('naver')} icon={<IconNaver />}>
        네이버 계정으로 로그인
      </SocialLoginButton>
      <AppleLoginButtonImage type="button" onClick={() => onLogin('apple')} aria-label="Apple 계정으로 로그인">
        <AppleLoginImage src={AppleLoginButton} alt="" />
      </AppleLoginButtonImage>
      <SocialLoginButton
        provider="google"
        type="button"
        onClick={() => onLogin('google')}
        icon={<IconGoogleImage src={IconGoogleImageSource} alt="" />}
      >
        Google 계정으로 로그인
      </SocialLoginButton>
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
