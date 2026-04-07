import { useCallback, useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRamenyaGroupQuery } from "@/entities/curation/model";
import { setCurrentLocation } from "@/entities/location/model";
import { requestLocationPermission } from "@/shared/lib/geolocation";
import { useUserLocation } from "@/shared/lib/useUserLocation";
import { useToast } from "@/shared/ui/toast";

const buildMapPath = (params: Record<string, string | number | boolean | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === false) {
      return;
    }

    searchParams.set(key, value === true ? "true" : value.toString());
  });

  return `/map?${searchParams.toString()}`;
};

export const useHomePage = () => {
  const navigate = useNavigate();
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { ramenyaGroupQuery } = useRamenyaGroupQuery();
  const { openToast } = useToast();
  const { getUserPositionResult } = useUserLocation();
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (!locationContainerRef.current) {
      return;
    }

    setIsDragging(true);
    setStartX(event.pageX - locationContainerRef.current.offsetLeft);
    setScrollLeft(locationContainerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (!isDragging || !locationContainerRef.current) {
        return;
      }

      event.preventDefault();
      const x = event.pageX - locationContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      locationContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, scrollLeft, startX],
  );

  const handleMouseUp = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleLocationBadgeClick = useCallback(
    async (location: { longitude: number; latitude: number } | null) => {
      if (!location) {
        const permissionState = await requestLocationPermission();

        if (permissionState === "unsupported") {
          openToast("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
          return;
        }

        if (permissionState === "denied") {
          openToast("위치 권한을 허용해주세요.");
          return;
        }

        const { position, errorCode } = await getUserPositionResult();

        if (!position) {
          if (errorCode === "permission_denied") {
            openToast("위치 권한을 허용해주세요.");
            return;
          }

          openToast("현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        setCurrentLocation(position);
        navigate(
          buildMapPath({
            longitude: position.longitude,
            latitude: position.latitude,
          }),
        );
        return;
      }

      navigate(
        buildMapPath({
          longitude: location.longitude,
          latitude: location.latitude,
          level: 14,
          radius: 3241,
        }),
      );
    },
    [getUserPositionResult, navigate, openToast],
  );

  const handleSearchKeywordSelect = useCallback(
    (keyword: string, isNearBy?: boolean) => {
      navigate(
        buildMapPath({
          keyword,
          nearBy: isNearBy,
        }),
      );
    },
    [navigate],
  );

  return {
    ramenyaGroup: ramenyaGroupQuery.data,
    locationContainerRef,
    isDragging,
    isSearchOverlayOpen,
    setIsSearchOverlayOpen,
    searchValue,
    setSearchValue,
    handleOpenSearchOverlay: () => setIsSearchOverlayOpen(true),
    handleLocationBadgeClick,
    handleSearchKeywordSelect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    navigate,
  };
};
