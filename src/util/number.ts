import { Coordinate } from "../types";

/**
 * 숫자를 천 단위 구분 쉼표가 있는 문자열로 변환합니다.
 * @param num 변환할 숫자
 * @returns 천 단위 구분 쉼표가 포함된 문자열
 * @example
 * formatNumber(1000) // "1,000"
 * formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const calculateDistance = (
  coord1: Coordinate,
  coord2: Coordinate,
): string => {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const R = 6371; // 지구 반지름 (단위: km)
  const lat1 = toRadians(coord1.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lat2 = toRadians(coord2.latitude);
  const lon2 = toRadians(coord2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = R * c;

  // 결과를 소수점 둘째 자리까지 유지
  return distanceInKm < 1
    ? `${(distanceInKm * 1000).toFixed(2)}m` // 소수점 2자리 유지
    : `${distanceInKm.toFixed(2)}km`;
};
