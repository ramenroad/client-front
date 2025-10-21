import TopBar from "../../components/top-bar";
import RamenroadMainLogo from "../../assets/images/full-logo.png";
import tw from "twin.macro";
import { Line } from "../../components/common/Line";
import { IconKakao, IconNaver } from "../../components/Icon";
import styled from "@emotion/styled";
import { useKakaoSDK } from "../../hooks/common/useKakaoSDK";
import AppleLoginButton from "../../assets/images/apple/login-button.png";
import IconGoogle from "../../assets/images/google/icon.png";
import AppleLogin from "react-apple-login";

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

const Layout = tw.div`
  flex flex-col items-center
  w-full h-full
`;

const LogoWrapper = tw.div`
  flex flex-col items-center justify-center gap-8
  mt-200
`;

const LogoImage = tw.img`
  h-74
`;

const LoginText = tw.span`
  font-14-m text-gray-400 w-full
`;

const AppleLoginButtonImage = tw.img`
  w-310 h-46
  cursor-pointer
`;

const IconGoogleImage = tw.img`
  w-16 h-16
`;

const LoginActionWrapper = tw.div`
  flex flex-col items-center justify-center
  w-full mt-auto mb-80 px-40
  box-border
`;

const LoginTextWrapper = tw.div`
  flex items-center justify-center gap-8
  w-full
`;

const LoginButtonWrapper = tw.div`
  flex flex-col items-center justify-center gap-12
  w-full mt-20
`;

const LoginButton = styled.button(({ loginType }: { loginType: "kakao" | "naver" | "google" }) => [
  tw`
    flex items-center justify-center gap-8
    w-310 h-46
    rounded-50
    shadow-none
    outline-none
    border-none
    cursor-pointer
    focus:outline-none
    focus:ring-0
    focus:ring-offset-0
    active:shadow-none
    hover:shadow-none
  `,
  loginType === "kakao" && tw`bg-kakao`,
  loginType === "naver" && tw`bg-naver`,
  loginType === "google" && tw`bg-white border border-solid border-gray-200`,
]);

const LoginButtonText = styled.span(({ loginType }: { loginType: "kakao" | "naver" | "google" }) => [
  tw`
    font-18-m
  `,
  loginType === "kakao" && tw`text-black/85`,
  loginType === "naver" && tw`text-white`,
  loginType === "google" && tw`text-black`,
]);

export default LoginPage;
