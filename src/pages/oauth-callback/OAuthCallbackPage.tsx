import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthMutation } from "@/features/auth/model";
import { AxiosError } from "axios";
import { IconKakao, IconNaver } from "@/shared/ui/icon";
import { RaisingText } from "@/shared/ui/text";
import styled from "@emotion/styled";
import EmailImage from "../../assets/images/email/email.png";
import { UserInformation } from "@/entities/viewer/model";
import { jwtDecode } from "jwt-decode";
import { setUserInformation } from "@/entities/viewer/model";
import { useSignInStore } from "@/entities/viewer/model";
import { useToast } from "@/shared/ui/toast";
import render from "@/shared/ui/render";

const LoginCallbackPage = () => {
  const { id } = useParams();
  const { add: login } = useAuthMutation();
  const { setTokens } = useSignInStore();

  const { openToast } = useToast();

  const navigate = useNavigate();

  const [isEmailAlreadyExists, setIsEmailAlreadyExists] = useState(false);
  const [isWithdrawUser, setIsWithdrawUser] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  useEffect(() => {
    if (!id) return;

    if (id === "apple") {
      const accessToken = new URLSearchParams(window.location.search).get("accessToken");
      const refreshToken = new URLSearchParams(window.location.search).get("refreshToken");
      const type = new URLSearchParams(window.location.search).get("type");

      if (accessToken && refreshToken && type) {
        try {
          const decodedToken: UserInformation = jwtDecode(accessToken);

          setUserInformation({
            id: decodedToken.id,
            email: decodedToken.email,
            nickname: decodedToken.nickname,
          });

          setTokens({ accessToken, refreshToken });

          openToast("로그인 성공");

          if (type === "signup") {
            navigate("/register");
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error(error);
          openToast("로그인 실패");
          navigate("/login");
        }
      }
      return;
    } // 애플 예외 케이스

    const code = new URLSearchParams(window.location.search).get("code");

    // URL fragment에서 access_token 추출 (Google OAuth용)
    const hash = window.location.hash.substring(1); // # 제거
    const hashParams = new URLSearchParams(hash);
    const access_token = hashParams.get("access_token");

    if ((code || access_token) && !login.isPending) {
      login.mutate(
        { id: id!, code: access_token || code || "" },
        {
          onError: (error) => {
            console.error(error);
            if (error instanceof AxiosError) {
              if (error.response?.data.statusCode === 406) {
                // 이메일이 이미 가입된 경우 처리
                setIsEmailAlreadyExists(true);
                setLoginEmail(error.response?.data.email);
              }

              if (error.response?.data.statusCode === 403) {
                setIsWithdrawUser(true);
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

  if (!isEmailAlreadyExists && !isWithdrawUser) {
    return <Wrapper>로그인 작업 진행 중</Wrapper>;
  }

  if (isEmailAlreadyExists) {
    return (
      <Wrapper>
        <img src={EmailImage} alt="email" width={110} height={82} />

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
          <LoginButton loginType="kakao" onClick={() => handleLogin("kakao")}>
            <IconKakao />
            <LoginButtonText loginType="kakao">카카오 계정으로 로그인</LoginButtonText>
          </LoginButton>
          <LoginButton loginType="naver" onClick={() => handleLogin("naver")}>
            <IconNaver />
            <LoginButtonText loginType="naver">네이버 계정으로 로그인</LoginButtonText>
          </LoginButton>
          <BackButton>
            <RaisingText size={14} weight="m" onClick={() => navigate("/")}>
              이전 화면으로 돌아가기
            </RaisingText>
          </BackButton>
        </LoginButtonWrapper>
      </Wrapper>
    );
  }

  if (isWithdrawUser) {
    return (
      <Wrapper>
        <WithdrawInformationWrapper>
          <WithdrawTitle>이미 탈퇴한 계정입니다</WithdrawTitle>
          <WithdrawDescription>
            회원 탈퇴한 계정으로는 30일 내<br />
            재가입이 불가능합니다
          </WithdrawDescription>
        </WithdrawInformationWrapper>

        <WithdrawButtonWrapper>
          <LoginButton loginType="kakao" onClick={() => handleLogin("kakao")}>
            <IconKakao />
            <LoginButtonText loginType="kakao">카카오 계정으로 로그인</LoginButtonText>
          </LoginButton>
          <LoginButton loginType="naver" onClick={() => handleLogin("naver")}>
            <IconNaver />
            <LoginButtonText loginType="naver">네이버 계정으로 로그인</LoginButtonText>
          </LoginButton>
          <BackButton>
            <RaisingText size={14} weight="m" onClick={() => navigate("/")}>
              이전 화면으로 돌아가기
            </RaisingText>
          </BackButton>
        </WithdrawButtonWrapper>
      </Wrapper>
    );
  }
};

const Wrapper = render.div("flex flex-col items-center justify-center w-full h-full");

const WithdrawInformationWrapper = render.div("box-border flex flex-col gap-8 w-full flex-1 px-20 pt-54");

const SubText = render.extend(RaisingText, "text-gray-400");

const AlertContainer = render.div("mt-20 flex flex-col items-center justify-center gap-6 w-full");

const EmailBox = render.div(
  "mt-32 w-350 h-90 bg-[#f9f9f9] outline-none border-none rounded-[8px] cursor-pointer flex items-center justify-center",
);

const WithdrawButtonWrapper = render.div("flex flex-col items-center justify-center gap-12 w-full mb-154");

const LoginButtonWrapper = render.div("flex flex-col items-center justify-center gap-12 w-full mt-66");

const LoginButton = styled.button(({ loginType }: { loginType: "kakao" | "naver" }) => [
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
]);

const BackButton = render.button(
  "py-11 flex items-center justify-center gap-8 w-310 h-46 bg-white text-black border border-gray-100 border-solid rounded-[50px] shadow-none outline-none cursor-pointer",
);

const LoginButtonText = styled.span(({ loginType }: { loginType: "kakao" | "naver" }) => [
  {
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 500,
  },
  loginType === "kakao" && { color: "rgb(17 17 17 / 0.85)" },
  loginType === "naver" && { color: "#ffffff" },
]);

const WithdrawTitle = render.span("font-regular text-black text-[24px] leading-36 tracking-[-2%]");

const WithdrawDescription = render.span("font-16-r text-gray-500 tracking-[-2%] leading-24");

export default LoginCallbackPage;
