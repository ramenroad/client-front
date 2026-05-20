import type { NaverMaps, NaverMarkerIcon } from '@/shared/lib/naver-map'

const getMarkerDimensions = ({ isSelected }: { isSelected: boolean }) => {
  const pinWidth = isSelected ? 56 : 38
  const pinHeight = isSelected ? 67 : 45

  return {
    pinWidth,
    pinHeight,
    markerWidth: pinWidth,
    markerHeight: pinHeight,
    anchorX: pinWidth / 2,
    anchorY: pinHeight,
  }
}

const getPinSvg = ({ isSelected }: { isSelected: boolean }) => {
  if (isSelected) {
    return `
      <svg width="56" height="67" viewBox="0 0 56 67" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; overflow:visible; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.16));">
        <path d="M28 65C24.2 59.9 11 43.5 11 27C11 17.1 18.6 9 28 9C37.4 9 45 17.1 45 27C45 43.5 31.8 59.9 28 65Z" fill="#FF5E00" stroke="white" stroke-width="2.5"/>
        <circle cx="28" cy="27" r="7" fill="white"/>
      </svg>
    `
  }

  return `
    <svg width="38" height="45" viewBox="0 0 38 45" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; overflow:visible; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.16));">
      <path d="M19 43C16.35 39.45 7 27.85 7 16.3C7 9.15 12.35 3.5 19 3.5C25.65 3.5 31 9.15 31 16.3C31 27.85 21.65 39.45 19 43Z" fill="#FF5E00" stroke="white" stroke-width="2"/>
      <circle cx="19" cy="16.5" r="3.25" fill="white"/>
    </svg>
  `
}

export const createRamenyaMarkerIcon = ({
  isSelected,
  maps,
}: {
  isSelected: boolean
  maps: NaverMaps
}): NaverMarkerIcon => {
  const { anchorX, anchorY, markerHeight, markerWidth } = getMarkerDimensions({ isSelected })

  return {
    content: `
      <div style="position: relative; width: ${markerWidth}px; height: ${markerHeight}px; overflow: visible;">
        ${getPinSvg({ isSelected })}
      </div>
    `,
    size: new maps.Size(markerWidth, markerHeight),
    anchor: new maps.Point(anchorX, anchorY),
  }
}

export const createCurrentLocationMarkerIcon = (maps: NaverMaps): NaverMarkerIcon => ({
  content: `
    <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(66, 133, 244, 0.24);"></div>
      <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background: rgba(66, 133, 244, 0.18);"></div>
      <div style="width: 12px; height: 12px; border-radius: 50%; background: #3476E6; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 1;"></div>
    </div>
  `,
  size: new maps.Size(40, 40),
  anchor: new maps.Point(20, 20),
})
