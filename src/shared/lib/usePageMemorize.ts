import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

interface PageMemorizeData {
  pathname: string;
  search: string;
  params: Record<string, string | undefined>;
  timestamp: number;
}

const SESSION_STORAGE_KEY = "ramenroad_page_memorize";
const ignorePathname = ["/login", "/register", "/oauth", "/oauth/naver", "/oauth/kakao", "/oauth/google", "/oauth/apple"];

export const usePageMemorize = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (ignorePathname.includes(location.pathname)) {
      return;
    }

    const pageData: PageMemorizeData = {
      pathname: location.pathname,
      search: location.search,
      params,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(pageData));
    } catch (error) {
      console.error("SessionStorage 저장 실패:", error);
    }
  }, [location.pathname, location.search, params]);

  const getStoredPageData = (): PageMemorizeData | null => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("SessionStorage 읽기 실패:", error);
      return null;
    }
  };

  const getPageDataByPath = (pathname: string): PageMemorizeData | null => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const pageData: PageMemorizeData = JSON.parse(stored);
      return pageData.pathname === pathname ? pageData : null;
    } catch (error) {
      console.error("SessionStorage 읽기 실패:", error);
      return null;
    }
  };

  const clearStoredPageData = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error("SessionStorage 삭제 실패:", error);
    }
  };

  const getCurrentPageData = (): PageMemorizeData => ({
    pathname: location.pathname,
    search: location.search,
    params,
    timestamp: Date.now(),
  });

  return {
    getStoredPageData,
    getPageDataByPath,
    clearStoredPageData,
    getCurrentPageData,
    currentPath: location.pathname,
    currentParams: params,
  };
};
