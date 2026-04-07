import { IconKakao, IconNaver } from "@/shared/ui/icon";
import { RaisingText } from "@/shared/ui/text";
import { SocialLoginButton } from "@/features/auth/ui";
import render from "@/shared/ui/render";

interface OAuthRecoveryActionsProps {
  onBack: () => void;
  onLogin: (provider: "kakao" | "naver") => void;
}

export const OAuthRecoveryActions = ({ onBack, onLogin }: OAuthRecoveryActionsProps) => {
  return (
    <ActionsWrapper>
      <SocialLoginButton provider="kakao" type="button" onClick={() => onLogin("kakao")} icon={<IconKakao />}>
        카카오 계정으로 로그인
      </SocialLoginButton>
      <SocialLoginButton provider="naver" type="button" onClick={() => onLogin("naver")} icon={<IconNaver />}>
        네이버 계정으로 로그인
      </SocialLoginButton>
      <BackButton type="button" onClick={onBack}>
        <RaisingText size={14} weight="m">
          이전 화면으로 돌아가기
        </RaisingText>
      </BackButton>
    </ActionsWrapper>
  );
};

const ActionsWrapper = render.div("flex w-full flex-col items-center justify-center gap-12");

const BackButton = render.button(
  "flex h-46 w-310 cursor-pointer items-center justify-center gap-8 rounded-[50px] border border-solid border-gray-100 bg-white py-11 text-black shadow-none outline-none",
);
