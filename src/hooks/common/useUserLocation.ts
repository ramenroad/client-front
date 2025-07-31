import { useCallback } from "react";
import { useToast } from "../../components/toast/ToastProvider";

export const useUserLocation = () => {
  const { openToast } = useToast();

  const getUserPosition = useCallback(async (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!navigator.geolocation) {
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000,
        });
      });

      openToast("성공적으로 현재 위치를 불러왔습니다.");

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (_error) {
      console.error("위치 가져오기 실패:", _error);
      return null;
    }
  }, []);

  return {
    getUserPosition,
  };
};
