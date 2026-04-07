import TopBar from "@/shared/ui/top-bar";
import RamenroadMainLogo from "@/assets/images/full-logo.png";
import AppleLoginButton from "@/assets/images/apple/login-button.png";
import IconGoogle from "@/assets/images/google/icon.png";
import { authorizeKakaoLogin, getAppleRedirectUrl, redirectToOAuthProvider } from "@/features/auth/lib";
import { SocialLoginButton } from "@/features/auth/ui";
import { Line } from "@/shared/ui/line";
import { IconKakao, IconNaver } from "@/shared/ui/icon";
import { useKakaoSDK } from "@/shared/lib/use-kakao-sdk";
import AppleLogin from "react-apple-login";
import render from "@/shared/ui/render";

const LoginPage = () => {
  const { Kakao } = useKakaoSDK();

  const handleLogin = (loginType: "kakao" | "naver" | "apple" | "google") => {
    switch (loginType) {
      case "kakao":
        authorizeKakaoLogin(Kakao);
        break;
      case "naver":
        redirectToOAuthProvider("naver");
        break;
      case "apple":
        // react-apple-login 라이브러리를 통해 처리
        break;
      case "google":
        redirectToOAuthProvider("google");
    }
  };

  return (
    <Layout>
      <TopBar title="" />
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
          <SocialLoginButton provider="kakao" type="button" onClick={() => handleLogin("kakao")} icon={<IconKakao />}>
            카카오로 계속하기
          </SocialLoginButton>
          <SocialLoginButton provider="naver" type="button" onClick={() => handleLogin("naver")} icon={<IconNaver />}>
            네이버로 계속하기
          </SocialLoginButton>
          <AppleLogin
            clientId={import.meta.env.VITE_APPLE_CLIENT_ID}
            redirectURI={getAppleRedirectUrl()}
            responseType="code id_token"
            responseMode="form_post"
            state="raising"
            scope="email name"
            render={(props) => (
              <AppleLoginButtonImage src={AppleLoginButton} alt="apple-login-button" onClick={props.onClick} />
            )}
          />
          <SocialLoginButton
            provider="google"
            type="button"
            onClick={() => handleLogin("google")}
            icon={<IconGoogleImage src={IconGoogle} alt="" />}
          >
            Google로 계속하기
          </SocialLoginButton>
        </LoginButtonWrapper>
      </LoginActionWrapper>
    </Layout>
  );
};

const Layout = render.div("flex flex-col items-center w-full h-full");

const LogoWrapper = render.div("flex flex-col items-center justify-center gap-8 mt-200");

const LogoImage = render.img("h-74");

const LoginText = render.span("font-14-m text-gray-400 w-full");

const AppleLoginButtonImage = render.img("w-310 h-46 cursor-pointer");

const IconGoogleImage = render.img("w-16 h-16");

const LoginActionWrapper = render.div(
  "flex flex-col items-center justify-center w-full mt-auto mb-80 px-40 box-border",
);

const LoginTextWrapper = render.div("flex items-center justify-center gap-8 w-full");

const LoginButtonWrapper = render.div("flex flex-col items-center justify-center gap-12 w-full mt-20");

export default LoginPage;
