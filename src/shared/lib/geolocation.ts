import type { Coordinate } from './naver-map'

let cachedCurrentLocation: Coordinate | null = null
let currentLocationPromise: Promise<Coordinate | null> | null = null

export const getBrowserCurrentLocation = () => {
  if (cachedCurrentLocation) {
    return Promise.resolve(cachedCurrentLocation)
  }

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve(null)
  }

  currentLocationPromise ??= new Promise<Coordinate | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        cachedCurrentLocation = nextLocation
        resolve(nextLocation)
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    )
  }).finally(() => {
    currentLocationPromise = null
  })

  return currentLocationPromise
}
