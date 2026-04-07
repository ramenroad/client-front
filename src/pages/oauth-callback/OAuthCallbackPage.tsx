import { useOAuthCallbackPage } from "./model/useOAuthCallbackPage";
import { OAuthRecoveryActions } from "./ui/OAuthRecoveryActions";
import { RaisingText } from "@/shared/ui/text";
import EmailImage from "@/assets/images/email/email.png";
import render from "@/shared/ui/render";

const LoginCallbackPage = () => {
  const { status, loginEmail, handleLogin, handleBack } = useOAuthCallbackPage();

  if (status === "loading") {
    return <Wrapper>로그인 작업 진행 중</Wrapper>;
  }

  if (status === "email_conflict") {
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

        <EmailBox>
          <RaisingText size={16} weight="b">
            {loginEmail}
          </RaisingText>
        </EmailBox>

        <LoginButtonWrapper>
          <OAuthRecoveryActions onLogin={handleLogin} onBack={handleBack} />
        </LoginButtonWrapper>
      </Wrapper>
    );
  }

  if (status === "withdrawn") {
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
    );
  }
};

const Wrapper = render.div("flex flex-col items-center justify-center w-full h-full");

const EmailIllustration = render.img("w-110 h-82");

const WithdrawInformationWrapper = render.div("box-border flex flex-col gap-8 w-full flex-1 px-20 pt-54");

const SubText = render.extend(RaisingText, "text-gray-400");

const AlertContainer = render.div("mt-20 flex flex-col items-center justify-center gap-6 w-full");

const EmailBox = render.div("mt-32 flex h-90 w-350 items-center justify-center rounded-[8px] bg-[#f9f9f9]");

const WithdrawButtonWrapper = render.div("flex flex-col items-center justify-center gap-12 w-full mb-154");

const LoginButtonWrapper = render.div("flex flex-col items-center justify-center gap-12 w-full mt-66");

const WithdrawTitle = render.span("font-regular text-black text-[24px] leading-36 tracking-[-2%]");

const WithdrawDescription = render.div("flex flex-col font-16-r text-gray-500 tracking-[-2%] leading-24");

const WithdrawDescriptionLine = render.span("text-inherit");

export default LoginCallbackPage;
