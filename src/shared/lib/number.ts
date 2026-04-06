import type { Coordinate } from "@/entities/ramenya/model";

export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const toRadians = (degree: number) => (degree * Math.PI) / 180;

export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): string => {
  const distanceInKm = calculateDistanceValue(coord1, coord2);

  return distanceInKm < 1 ? `${(distanceInKm * 1000).toFixed(2)}m` : `${distanceInKm.toFixed(2)}km`;
};

export const calculateDistanceValue = (coord1: Coordinate, coord2: Coordinate): number => {
  const earthRadiusKm = 6371;
  const lat1 = toRadians(coord1.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lat2 = toRadians(coord2.latitude);
  const lon2 = toRadians(coord2.longitude);
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};
