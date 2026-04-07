import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { redirectToOAuthProvider } from "@/features/auth/lib";
import { useAuthMutation } from "@/features/auth/model";
import { setUserInformation, type UserInformation, useSignInStore } from "@/entities/viewer/model";
import { useToast } from "@/shared/ui/toast";

type OAuthCallbackStatus = "loading" | "email_conflict" | "withdrawn";

const getOAuthSearchParams = () => new URLSearchParams(window.location.search);

const getAppleCallbackParams = () => {
  const searchParams = getOAuthSearchParams();

  return {
    accessToken: searchParams.get("accessToken"),
    refreshToken: searchParams.get("refreshToken"),
    type: searchParams.get("type"),
  };
};

const getOAuthCallbackCode = () => {
  const searchParams = getOAuthSearchParams();
  const hashParams = new URLSearchParams(window.location.hash.substring(1));

  return {
    code: searchParams.get("code"),
    accessToken: hashParams.get("access_token"),
  };
};

export const useOAuthCallbackPage = () => {
  const { id } = useParams();
  const { add: login } = useAuthMutation();
  const { setTokens } = useSignInStore();
  const { openToast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState<OAuthCallbackStatus>("loading");
  const [loginEmail, setLoginEmail] = useState("");
  const processedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    if (id === "apple") {
      const { accessToken, refreshToken, type } = getAppleCallbackParams();

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
          navigate(type === "signup" ? "/register" : "/");
        } catch (error) {
          console.error(error);
          openToast("로그인 실패");
          navigate("/login");
        }
      }

      return;
    }

    const { code, accessToken } = getOAuthCallbackCode();
    const callbackKey = `${id ?? ""}:${code ?? ""}:${accessToken ?? ""}`;

    if (!(code || accessToken) || login.isPending || processedKeyRef.current === callbackKey) {
      return;
    }

    processedKeyRef.current = callbackKey;
    login.mutate(
      { id, code: accessToken || code || "" },
      {
        onError: (error) => {
          console.error(error);

          if (!(error instanceof AxiosError)) {
            return;
          }

          if (error.response?.data.statusCode === 406) {
            setStatus("email_conflict");
            setLoginEmail(error.response?.data.email);
          }

          if (error.response?.data.statusCode === 403) {
            setStatus("withdrawn");
          }
        },
      },
    );
  }, [id, login, navigate, openToast, setTokens]);

  const handleLogin = (loginType: "kakao" | "naver") => {
    redirectToOAuthProvider(loginType);
  };

  const handleBack = () => {
    navigate("/");
  };

  return {
    status,
    loginEmail,
    handleLogin,
    handleBack,
  };
};
