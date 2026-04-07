export type OAuthProvider = "kakao" | "naver" | "google";

const getOAuthCallbackUrl = (provider: OAuthProvider) => `${window.location.origin}/oauth/${provider}`;

export const getOAuthAuthorizationUrl = (provider: OAuthProvider) => {
  switch (provider) {
    case "kakao":
      return `https://kauth.kakao.com/oauth/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
        redirect_uri: getOAuthCallbackUrl("kakao"),
        response_type: "code",
      }).toString()}`;
    case "naver":
      return `https://nid.naver.com/oauth2.0/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_NAVER_CLIENT_ID,
        redirect_uri: getOAuthCallbackUrl("naver"),
        response_type: "code",
        state: "ramenroad",
      }).toString()}`;
    case "google":
      return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirect_uri: getOAuthCallbackUrl("google"),
        response_type: "token",
        scope: "email profile",
      }).toString()}`;
  }
};

export const redirectToOAuthProvider = (provider: OAuthProvider) => {
  window.location.href = getOAuthAuthorizationUrl(provider);
};

export const authorizeKakaoLogin = (Kakao: typeof window.Kakao | null) => {
  if (Kakao) {
    Kakao.Auth.authorize({
      redirectUri: getOAuthCallbackUrl("kakao"),
    });
    return;
  }

  redirectToOAuthProvider("kakao");
};

export const getAppleRedirectUrl = () => `${window.location.origin}/api/auth/apple`;
