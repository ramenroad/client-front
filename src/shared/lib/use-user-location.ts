import { useCallback } from "react";

type UserPosition = {
  latitude: number;
  longitude: number;
};

export type UserPositionErrorCode =
  | "permission_denied"
  | "position_unavailable"
  | "timeout"
  | "unsupported"
  | "unknown";

type GetUserPositionOptions = {
  timeoutMs?: number;
};

type GetUserPositionResult = {
  position: UserPosition | null;
  errorCode: UserPositionErrorCode | null;
};

type LocationAttempt = PositionOptions;

const LOCATION_ATTEMPTS: LocationAttempt[] = [
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 7000,
  },
  {
    enableHighAccuracy: false,
    maximumAge: 300000,
    timeout: 5000,
  },
];

const getLocationAttempts = (timeoutMs?: number): LocationAttempt[] => {
  if (!timeoutMs) {
    return LOCATION_ATTEMPTS;
  }

  const attemptCount = LOCATION_ATTEMPTS.length;
  const baseTimeout = Math.max(1, Math.floor(timeoutMs / attemptCount));

  return LOCATION_ATTEMPTS.map((attempt, index) => ({
    ...attempt,
    timeout: index === attemptCount - 1 ? Math.max(1, timeoutMs - baseTimeout * index) : baseTimeout,
  }));
};

const getCurrentPosition = (options: LocationAttempt) =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

const getUserPositionErrorCode = (error: unknown): UserPositionErrorCode => {
  if (typeof error === "object" && error !== null && "code" in error) {
    switch ((error as GeolocationPositionError).code) {
      case 1:
        return "permission_denied";
      case 2:
        return "position_unavailable";
      case 3:
        return "timeout";
      default:
        return "unknown";
    }
  }

  return "unknown";
};

export const useUserLocation = () => {
  const getUserPositionResult = useCallback(
    async ({ timeoutMs }: GetUserPositionOptions = {}): Promise<GetUserPositionResult> => {
      if (!navigator.geolocation) {
        return {
          position: null,
          errorCode: "unsupported",
        };
      }

      let lastErrorCode: UserPositionErrorCode = "unknown";

      for (const options of getLocationAttempts(timeoutMs)) {
        try {
          const position = await getCurrentPosition(options);

          return {
            position: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            errorCode: null,
          };
        } catch (error) {
          lastErrorCode = getUserPositionErrorCode(error);

          if (lastErrorCode === "permission_denied") {
            break;
          }
        }
      }

      console.error("위치 가져오기 실패:", lastErrorCode);
      return {
        position: null,
        errorCode: lastErrorCode,
      };
    },
    [],
  );

  const getUserPosition = useCallback(
    async (options?: GetUserPositionOptions): Promise<UserPosition | null> => {
      const { position } = await getUserPositionResult(options);
      return position;
    },
    [getUserPositionResult],
  );

  return { getUserPosition, getUserPositionResult };
};
