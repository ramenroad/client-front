import { useState, useEffect, useCallback, useMemo } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoFetch?: boolean; // 자동으로 위치 가져오기 여부
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  // defaultOptions를 useMemo로 메모이제이션하여 불필요한 재생성 방지
  const defaultOptions = useMemo(
    () => ({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000, // 10분
      autoFetch: true, // 기본값: 자동으로 위치 가져오기
      ...options,
    }),
    [options.enableHighAccuracy, options.timeout, options.maximumAge, options.autoFetch],
  );

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      // 권한 API가 지원되는 경우 권한 확인
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({ name: "geolocation" });

        if (permission.state === "denied") {
          throw new Error("Geolocation permission denied");
        }
      }

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Permission check failed",
      }));
      return false;
    }
  }, []);

  const getCurrentPosition = useCallback(async (): Promise<void> => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: defaultOptions.enableHighAccuracy,
          timeout: defaultOptions.timeout,
          maximumAge: defaultOptions.maximumAge,
        });
      });

      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = "Unable to retrieve location";

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
            break;
        }
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [defaultOptions.enableHighAccuracy, defaultOptions.timeout, defaultOptions.maximumAge]);

  const watchPosition = useCallback((): (() => void) => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
      }));
      return () => {};
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
            break;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: defaultOptions.enableHighAccuracy,
        timeout: defaultOptions.timeout,
        maximumAge: defaultOptions.maximumAge,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [defaultOptions.enableHighAccuracy, defaultOptions.timeout, defaultOptions.maximumAge]);

  // autoFetch 옵션에 따라 컴포넌트 마운트 시 위치 가져오기
  useEffect(() => {
    if (defaultOptions.autoFetch) {
      getCurrentPosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptions.autoFetch]); // autoFetch 옵션에만 의존

  return {
    latitude: state.latitude,
    longitude: state.longitude,
    loading: state.loading,
    error: state.error,
    requestPermission,
    getCurrentPosition,
    watchPosition,
  };
};
