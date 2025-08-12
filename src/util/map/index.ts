export const getRadiusFromMap = (map: naver.maps.Map) => {
  const projection = map.getProjection();
  const deviceHeight = 400;
  const halfDeviceHeight = Math.round(deviceHeight / 2);

  const p1 = new naver.maps.Point(0, 0);
  const p3 = new naver.maps.Point(halfDeviceHeight, 0);

  const c1 = projection.fromOffsetToCoord(p1);
  const c3 = projection.fromOffsetToCoord(p3);

  const distHalfHeight = projection.getDistance(c1, c3);
  const radiusInMeters = Math.round(distHalfHeight);

  return radiusInMeters;
};
