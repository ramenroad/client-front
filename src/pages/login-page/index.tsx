import TopBar from "../../components/common/TopBar";
import RamenroadMainLogo from "../../assets/images/ramenroad-main-logo.png";
import tw from "twin.macro";
import { Line } from "../../components/common/Line";
import { IconKakao } from "../../components/Icon";
import styled from "@emotion/styled";

const LoginPage = () => {
  const handleLogin = (loginType: "kakao" | "naver") => {
    switch (loginType) {
      case "kakao":
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/kakao&response_type=code`;
        break;
      case "naver":
        window.location.href =
          "https://nid.naver.com/oauth2.0/authorize?client_id=your_client_id&redirect_uri=your_redirect_uri&response_type=code";
        break;
    }
  };

  return (
    <Layout>
      <TopBar title="" />
      <LogoWrapper>
        <LogoImage src={RamenroadMainLogo} alt="ramenroad-main-logo" />
        <LogoText>라멘 맛집 찾는다면?</LogoText>
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
            <LoginButtonText loginType="kakao">
              카카오로 계속하기
            </LoginButtonText>
          </LoginButton>
          {/* <LoginButton loginType="naver" onClick={() => handleLogin("naver")}>
            <IconNaver />
            <LoginButtonText loginType="naver">
              네이버로 계속하기
            </LoginButtonText>
          </LoginButton> */}
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
  w-175
`;

const LogoText = tw.span`
  font-14-m text-gray-700
`;

const LoginText = tw.span`
  font-14-m text-gray-400 w-full
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
  flex flex-col items-center justify-center gap-10
  w-full mt-20
`;

const LoginButton = styled.button(
  ({ loginType }: { loginType: "kakao" | "naver" }) => [
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
  ]
);

const LoginButtonText = styled.span(
  ({ loginType }: { loginType: "kakao" | "naver" }) => [
    tw`
    font-14-m
  `,
    loginType === "kakao" && tw`text-black/85`,
    loginType === "naver" && tw`text-white`,
  ]
);

export default LoginPage;
