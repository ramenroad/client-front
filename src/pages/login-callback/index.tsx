import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthMutation } from "../../hooks/mutation/useAuthMutation";
import tw from "twin.macro";
import { AxiosError } from "axios";
import { IconKakao, IconNaver } from "../../components/Icon";
import { RamenroadText } from "../../components/common/RamenroadText";
import styled from "@emotion/styled";
import EmailImage from "../../assets/images/email/email.png";

const LoginCallbackPage = () => {
  const { id } = useParams();
  const { login } = useAuthMutation();

  const navigate = useNavigate();

  const [isEmailAlreadyExists, setIsEmailAlreadyExists] = useState(true);
  const [loginEmail, setLoginEmail] = useState("test@test.com");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code && !login.isPending) {
      login.mutate(
        { id: id!, code: code },
        {
          onError: (error) => {
            if (error instanceof AxiosError) {
              if (error.response?.data.statusCode === 406) {
                // 이메일이 이미 가입된 경우 처리
                setIsEmailAlreadyExists(true);
                setLoginEmail(error.response?.data.email);
              }
            }
          },
        },
      );
    }
  }, [id]);

  const handleLogin = (loginType: "kakao" | "naver") => {
    switch (loginType) {
      case "kakao":
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/kakao&response_type=code`;
        break;
      case "naver":
        window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/naver&response_type=code&state=ramenroad`;
        break;
    }
  };

  return !isEmailAlreadyExists ? (
    <Wrapper>로그인 작업 진행 중</Wrapper>
  ) : (
    <Wrapper>
      <img src={EmailImage} alt="email" width={110} height={82} />

      <AlertContainer>
        <RamenroadText size={20} weight="m">
          이미 가입된 이메일 주소입니다.
        </RamenroadText>
        <SubText size={14} weight="r">
          네이버 혹은 카카오 계정을 확인해 주세요
        </SubText>
      </AlertContainer>

      <EmailBox>
        <RamenroadText size={16} weight="b">
          {loginEmail}
        </RamenroadText>
      </EmailBox>

      <LoginButtonWrapper>
        <LoginButton loginType="kakao" onClick={() => handleLogin("kakao")}>
          <IconKakao />
          <LoginButtonText loginType="kakao">카카오 계정으로 로그인</LoginButtonText>
        </LoginButton>
        <LoginButton loginType="naver" onClick={() => handleLogin("naver")}>
          <IconNaver />
          <LoginButtonText loginType="naver">네이버 계정으로 로그인</LoginButtonText>
        </LoginButton>
        <BackButton>
          <RamenroadText size={16} weight="m" onClick={() => navigate("/main")}>
            이전 화면으로 돌아가기
          </RamenroadText>
        </BackButton>
      </LoginButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center
  w-full h-full
`;

const SubText = tw(RamenroadText)`
  text-gray-400
`;

const AlertContainer = tw.div`
  mt-20
  flex flex-col items-center justify-center gap-6
  w-full
`;

const EmailBox = tw.div`
  mt-32
  w-350 h-90
  bg-[#f9f9f9]
  outline-none border-none
  rounded-8
  cursor-pointer
  flex items-center justify-center
`;

const LoginButtonWrapper = tw.div`
  flex flex-col items-center justify-center gap-10
  w-full mt-66
`;

const LoginButton = styled.button(({ loginType }: { loginType: "kakao" | "naver" }) => [
  tw`
    flex items-center justify-center gap-8
    py-11
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
]);

const BackButton = tw.button`
  py-11
  flex items-center justify-center gap-8
  w-310 h-46
  bg-white
  text-black
  border border-gray-100 border-solid
  rounded-50
  shadow-none
  outline-none
  cursor-pointer
`;

const LoginButtonText = styled.span(({ loginType }: { loginType: "kakao" | "naver" }) => [
  tw`
    font-16-m
  `,
  loginType === "kakao" && tw`text-black/85`,
  loginType === "naver" && tw`text-white`,
]);

export default LoginCallbackPage;
