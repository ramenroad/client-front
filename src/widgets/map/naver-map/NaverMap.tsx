/// <reference types="navermaps" />

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setCurrentLocation } from "@/entities/location/model";
import { RAMENYA_LOCATION_LIST } from "@/entities/ramenya/model";
import { useUserLocation } from "@/shared/lib/use-user-location";
import render from "@/shared/ui/render";
import {
  createMarkerIcon,
  createMarkerSnapshotKey,
  getMarkerCenterPosition,
  USER_POSITION_MARKER_ICON,
} from "./model/markerIcon";

type MapMarker<T> = {
  position: {
    lat: number;
    lng: number;
  };
  data: T;
  title?: string;
  inactive?: boolean;
};

export interface NaverMapProps<T = unknown> {
  markers?: MapMarker<T>[];
  onMarkerClick?: (markerData: T) => void;
  selectedMarker?: T | null;
  onMapReady?: (map: naver.maps.Map) => void;
  onMapIdle?: (map: naver.maps.Map) => void;
  initialCenter?: {
    lat: number;
    lng: number;
  };
}

export const NaverMap = <T = unknown,>({
  initialCenter,
  markers,
  onMapIdle,
  onMapReady,
  onMarkerClick,
  selectedMarker,
}: NaverMapProps<T>) => {
  const [searchParams] = useSearchParams();
  const defaultCenter = RAMENYA_LOCATION_LIST[0].location;
  const initialZoom = useMemo(() => (searchParams.get("level") ? Number(searchParams.get("level")) : 14), [searchParams]);
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getUserPosition } = useUserLocation();
  const markersMapRef = useRef<Map<string, { instance: naver.maps.Marker; data: T }>>(new Map());
  const prevInitialCenterRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    let isCancelled = false;

    const initMap = async () => {
      if (typeof naver === "undefined" || !naver.maps) {
        window.setTimeout(initMap, 100);
        return;
      }

      try {
        let center: naver.maps.LatLng;
        let userPosition = null;

        if (initialCenter) {
          center = new naver.maps.LatLng(initialCenter.lat, initialCenter.lng);
        } else {
          userPosition = await getUserPosition();

          if (userPosition) {
            setCurrentLocation(userPosition);
          }

          center =
            userPosition && userPosition.latitude && userPosition.longitude
              ? new naver.maps.LatLng(userPosition.latitude, userPosition.longitude)
              : new naver.maps.LatLng(defaultCenter.latitude, defaultCenter.longitude);
        }

        if (isCancelled) {
          return;
        }

        const map = new naver.maps.Map("map", {
          center,
          zoom: initialZoom,
        });

        if (!initialCenter && userPosition?.latitude && userPosition?.longitude) {
          new naver.maps.Marker({
            position: new naver.maps.LatLng(userPosition.latitude, userPosition.longitude),
            map,
            icon: USER_POSITION_MARKER_ICON,
          });
        }

        onMapIdle?.(map);

        setMapInstance(map);
        setIsInitialized(true);
        onMapReady?.(map);
      } catch (error) {
        console.error("지도를 불러오는데 실패하였습니다.", error);
      }
    };

    initMap();

    return () => {
      isCancelled = true;
    };
  }, [
    defaultCenter.latitude,
    defaultCenter.longitude,
    getUserPosition,
    initialCenter,
    initialZoom,
    isInitialized,
    onMapIdle,
    onMapReady,
  ]);

  useEffect(() => {
    if (!mapInstance) {
      return;
    }

    // Search params updates change `initialCenter`/`initialZoom`, so the map init
    // effect re-runs after the first URL sync. Keep the idle listener separate so
    // it survives those re-renders and continues syncing the query string.
    const idleListener = naver.maps.Event.addListener(mapInstance, "idle", () => {
      if (!window.location.pathname.startsWith("/map")) {
        return;
      }

      onMapIdle?.(mapInstance);
    });

    return () => {
      naver.maps.Event.removeListener(idleListener);
    };
  }, [mapInstance, onMapIdle]);

  useEffect(() => {
    if (!mapInstance || !initialCenter || !isInitialized) {
      return;
    }

    const prev = prevInitialCenterRef.current;

    if (!prev || prev.lat !== initialCenter.lat || prev.lng !== initialCenter.lng) {
      mapInstance.setCenter(new naver.maps.LatLng(initialCenter.lat, initialCenter.lng));
      prevInitialCenterRef.current = initialCenter;
    }
  }, [initialCenter, isInitialized, mapInstance]);

  const markersKey = useMemo(
    () => markers?.map((marker) => createMarkerSnapshotKey(marker)).join("|") ?? "",
    [markers],
  );

  useEffect(() => {
    if (!mapInstance || !markers) {
      return;
    }

    markersMapRef.current.forEach((markerInfo) => {
      markerInfo.instance.setMap(null);
    });
    markersMapRef.current.clear();

    markers.forEach((marker, index) => {
      const markerKey = `marker-${index}`;
      const markerInstance = new naver.maps.Marker({
        map: mapInstance,
        position: new naver.maps.LatLng(marker.position.lat, marker.position.lng),
        icon: createMarkerIcon({
          isSelected: false,
          title: marker.title,
          inactive: marker.inactive,
        }),
        clickable: true,
      });

      naver.maps.Event.addListener(markerInstance, "click", () => {
        mapInstance.setCenter(
          getMarkerCenterPosition({
            latitude: marker.position.lat,
            longitude: marker.position.lng,
            zoom: mapInstance.getZoom(),
          }),
        );
        onMarkerClick?.(marker.data);
      });

      markersMapRef.current.set(markerKey, {
        instance: markerInstance,
        data: marker.data,
      });
    });
  }, [mapInstance, markers, markersKey, onMarkerClick]);

  useEffect(() => {
    if (!mapInstance || !markers) {
      return;
    }

    markers.forEach((marker, index) => {
      const markerInfo = markersMapRef.current.get(`marker-${index}`);

      if (!markerInfo) {
        return;
      }

      markerInfo.instance.setIcon(
        createMarkerIcon({
          isSelected: selectedMarker === marker.data,
          title: marker.title,
          inactive: marker.inactive,
        }),
      );
    });
  }, [mapInstance, markers, selectedMarker]);

  return (
    <MapWrapper>
      <NaverMapComponent id="map" />
    </MapWrapper>
  );
};

const MapWrapper = render.article("h-full w-full overflow-hidden");

const NaverMapComponent = render.div("h-full w-full");
