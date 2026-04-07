import TopBar from "@/shared/ui/top-bar";
import RamenroadMainLogo from "../../assets/images/full-logo.png";
import { Line } from "@/shared/ui/line";
import { IconKakao, IconNaver } from "@/shared/ui/icon";
import styled from "@emotion/styled";
import { useKakaoSDK } from "@/shared/lib/use-kakao-sdk";
import AppleLoginButton from "../../assets/images/apple/login-button.png";
import IconGoogle from "../../assets/images/google/icon.png";
import AppleLogin from "react-apple-login";
import render from "@/shared/ui/render";

const LoginPage = () => {
  const { Kakao } = useKakaoSDK();

  const handleLogin = (loginType: "kakao" | "naver" | "apple" | "google") => {
    switch (loginType) {
      case "kakao":
        Kakao?.Auth.authorize({
          redirectUri: `${window.location.origin}/oauth/kakao`,
        });
        break;
      case "naver":
        window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/naver&response_type=code&state=ramenroad`;
        break;
      case "apple":
        // react-apple-login 라이브러리를 통해 처리
        break;
      case "google":
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?
		client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}
		&redirect_uri=${window.origin}/oauth/google
		&response_type=token
		&scope=email profile`;
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
          <LoginButton loginType="kakao" onClick={() => handleLogin("kakao")}>
            <IconKakao />
            <LoginButtonText loginType="kakao">카카오로 계속하기</LoginButtonText>
          </LoginButton>
          <LoginButton loginType="naver" onClick={() => handleLogin("naver")}>
            <IconNaver />
            <LoginButtonText loginType="naver">네이버로 계속하기</LoginButtonText>
          </LoginButton>
          <AppleLogin
            clientId={import.meta.env.VITE_APPLE_CLIENT_ID}
            redirectURI={`${window.location.origin}/api/auth/apple`}
            responseType="code id_token"
            responseMode="form_post"
            state="raising"
            scope="email name"
            render={(props) => (
              <AppleLoginButtonImage src={AppleLoginButton} alt="apple-login-button" onClick={props.onClick} />
            )}
          />
          <LoginButton loginType="google" onClick={() => handleLogin("google")}>
            <IconGoogleImage src={IconGoogle} />
            <LoginButtonText loginType="google">Google로 계속하기</LoginButtonText>
          </LoginButton>
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

const LoginButton = styled.button(({ loginType }: { loginType: "kakao" | "naver" | "google" }) => [
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "310px",
    height: "46px",
    borderRadius: "50px",
    boxShadow: "none",
    outline: "none",
    border: "none",
    cursor: "pointer",
  },
  loginType === "kakao" && { backgroundColor: "#fee500" },
  loginType === "naver" && { backgroundColor: "#03c75a" },
  loginType === "google" && { backgroundColor: "#ffffff", border: "1px solid #cfcfcf" },
]);

const LoginButtonText = styled.span(({ loginType }: { loginType: "kakao" | "naver" | "google" }) => [
  {
    fontSize: "18px",
    lineHeight: "27px",
    fontWeight: 500,
  },
  loginType === "kakao" && { color: "rgb(17 17 17 / 0.85)" },
  loginType === "naver" && { color: "#ffffff" },
  loginType === "google" && { color: "#111111" },
]);

export default LoginPage;
