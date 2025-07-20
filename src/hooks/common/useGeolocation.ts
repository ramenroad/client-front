import { useState, useEffect, useCallback, useMemo } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean | null; // 권한 허용 여부 추가
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoFetch?: boolean; // 자동으로 위치 가져오기 여부
  requestPermissionFirst?: boolean; // 먼저 권한을 요청할지 여부
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
    permissionGranted: null, // 초기값은 null (아직 확인하지 않음)
  });

  // defaultOptions를 useMemo로 메모이제이션하여 불필요한 재생성 방지
  const defaultOptions = useMemo(
    () => ({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000, // 10분
      autoFetch: true, // 기본값: 자동으로 위치 가져오기
      requestPermissionFirst: false, // 기본값: 권한 요청을 먼저 하지 않음
      ...options,
    }),
    [
      options.enableHighAccuracy,
      options.timeout,
      options.maximumAge,
      options.autoFetch,
      options.requestPermissionFirst,
    ],
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
          setState((prev) => ({
            ...prev,
            permissionGranted: false,
            error: "Geolocation permission denied",
          }));
          return false;
        } else if (permission.state === "granted") {
          setState((prev) => ({
            ...prev,
            permissionGranted: true,
          }));
          return true;
        }
        // prompt 상태인 경우 사용자에게 직접 요청
      }

      // 권한 API가 지원되지 않거나 prompt 상태인 경우 직접 요청
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setState((prev) => ({
              ...prev,
              permissionGranted: true,
            }));
            resolve(true);
          },
          () => {
            setState((prev) => ({
              ...prev,
              permissionGranted: false,
              error: "Geolocation permission denied",
            }));
            resolve(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0,
          },
        );
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        permissionGranted: false,
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
        permissionGranted: true,
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
        permissionGranted: false,
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
          permissionGranted: true,
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
          permissionGranted: false,
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
      if (defaultOptions.requestPermissionFirst) {
        // 권한을 먼저 요청
        requestPermission().then((granted) => {
          if (granted) {
            getCurrentPosition();
          }
        });
      } else {
        // 바로 위치 가져오기 시도
        getCurrentPosition();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptions.autoFetch, defaultOptions.requestPermissionFirst]); // autoFetch와 requestPermissionFirst 옵션에만 의존

  return {
    latitude: state.latitude,
    longitude: state.longitude,
    loading: state.loading,
    error: state.error,
    permissionGranted: state.permissionGranted,
    requestPermission,
    getCurrentPosition,
    watchPosition,
  };
};
