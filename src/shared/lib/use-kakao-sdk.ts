import { useEffect, useState } from "react";

interface UseKakaoSDKReturn {
  isLoaded: boolean;
  isError: boolean;
  Kakao: typeof window.Kakao | null;
}

export const useKakaoSDK = (): UseKakaoSDKReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [Kakao, setKakao] = useState<typeof window.Kakao | null>(null);

  useEffect(() => {
    const loadKakaoSDK = async () => {
      try {
        if (window.Kakao && window.Kakao.isInitialized()) {
          setKakao(window.Kakao);
          setIsLoaded(true);
          return;
        }

        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
          setKakao(window.Kakao);
          setIsLoaded(true);
          return;
        }

        const existingScript = document.querySelector('script[src*="kakao.min.js"]');

        if (existingScript) {
          existingScript.addEventListener("load", () => {
            if (window.Kakao) {
              window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
              window.setTimeout(() => {
                if (window.Kakao && window.Kakao.isInitialized()) {
                  setKakao(window.Kakao);
                  setIsLoaded(true);
                }
              }, 100);
            }
          });
          return;
        }

        const script = document.createElement("script");
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js";
        script.integrity = "sha384-WAtVcQYcmTO/N+C1N+1m6Gp8qxh+3NlnP7X1U7qP6P5dQY/MsRBNTh+e1ahJrkEm";
        script.crossOrigin = "anonymous";
        script.async = true;
        script.onload = () => {
          if (window.Kakao) {
            window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
            window.setTimeout(() => {
              if (window.Kakao && window.Kakao.isInitialized()) {
                setKakao(window.Kakao);
                setIsLoaded(true);
              }
            }, 100);
          }
        };
        script.onerror = () => {
          setIsError(true);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error("카카오 SDK 로드 중 오류 발생:", error);
        setIsError(true);
      }
    };

    loadKakaoSDK();
  }, []);

  return { isLoaded, isError, Kakao };
};
