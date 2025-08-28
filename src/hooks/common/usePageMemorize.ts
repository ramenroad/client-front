import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

interface pageMemorizeData {
  pathname: string;
  search: string;
  params: Record<string, string | undefined>;
  timestamp: number;
}

const SESSION_STORAGE_KEY = "ramenroad_page_memorize";

const ignorePathname = ["/login", "/register", "/oauth", "/oauth/naver", "/oauth/kakao"];

export const usePageMemorize = () => {
  const location = useLocation();
  const params = useParams();

  // 현재 페이지 정보를 SessionStorage에 저장
  useEffect(() => {
    const pageData: pageMemorizeData = {
      pathname: location.pathname,
      search: location.search,
      params: params,
      timestamp: Date.now(),
    };

    if (ignorePathname.includes(location.pathname)) {
      return;
    }

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(pageData));
    } catch (error) {
      console.error("SessionStorage 저장 실패:", error);
    }
  }, [location.pathname, location.search, params]);

  // SessionStorage에서 페이지 정보 불러오기
  const getStoredPageData = (): pageMemorizeData | null => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("SessionStorage 읽기 실패:", error);
      return null;
    }
  };

  // 특정 경로의 페이지 정보 불러오기
  const getPageDataByPath = (pathname: string): pageMemorizeData | null => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;

      const pageData: pageMemorizeData = JSON.parse(stored);
      return pageData.pathname === pathname ? pageData : null;
    } catch (error) {
      console.error("SessionStorage 읽기 실패:", error);
      return null;
    }
  };

  // SessionStorage에서 페이지 정보 삭제
  const clearStoredPageData = (): void => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error("SessionStorage 삭제 실패:", error);
    }
  };

  // 현재 페이지 정보 반환
  const getCurrentPageData = (): pageMemorizeData => ({
    pathname: location.pathname,
    search: location.search,
    params: params,
    timestamp: Date.now(),
  });

  console.log(getStoredPageData());

  return {
    getStoredPageData,
    getPageDataByPath,
    clearStoredPageData,
    getCurrentPageData,
    currentPath: location.pathname,
    currentParams: params,
  };
};
