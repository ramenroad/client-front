const NORMAL_MARKER_SVG = `
<svg width="38" height="45" viewBox="0 0 38 45" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0px; left: 0px;">
<g filter="url(#filter0_d_2082_2994)">
<path d="M19 5.5C24.5287 5.5 28.988 9.73696 28.999 15.5078C28.9216 18.0186 27.5785 20.9563 25.7627 23.7744C23.965 26.5645 21.7963 29.0996 20.2539 30.7715C19.5637 31.5193 18.436 31.5202 17.7441 30.7725C16.1783 29.0799 13.9685 26.5077 12.1562 23.7041C10.32 20.8633 9 17.9468 9 15.5293C9.00001 9.74748 13.4644 5.5 19 5.5Z" fill="#FF5E00" stroke="white" stroke-width="2"/>
<ellipse cx="19" cy="15.6693" rx="3" ry="3.04622" fill="white"/>
</g>
<defs>
<filter id="filter0_d_2082_2994" x="-1" y="0" width="40" height="46" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2082_2994"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2082_2994" result="shape"/>
</filter>
</defs>
</svg>`;

const INACTIVE_MARKER_SVG = `
<svg width="39" height="46" viewBox="0 0 39 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0px; left: 0px;">
<g filter="url(#filter0_d_2502_3908)">
<path d="M19.5 5.5C25.0293 5.5 29.489 9.73792 29.499 15.5098C29.4074 18.4555 27.5784 21.9664 25.333 25.1523C23.1399 28.264 20.678 30.8888 19.499 32.0889C18.3042 30.8737 15.796 28.2036 13.583 25.0732C11.3085 21.8558 9.5 18.3627 9.5 15.5293C9.50001 9.74748 13.9644 5.5 19.5 5.5Z" fill="#838383" stroke="white" stroke-width="2"/>
<ellipse cx="19.5" cy="15.6691" rx="3" ry="3.04622" fill="white"/>
</g>
<defs>
<filter id="filter0_d_2502_3908" x="-0.5" y="0" width="40" height="46" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2502_3908"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2502_3908" result="shape"/>
</filter>
</defs>
</svg>
`;

const SELECTED_MARKER_SVG = `
<svg width="56" height="67" viewBox="0 0 56 67" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0px; left: 0px;">
<g filter="url(#filter0_d_2082_3501)">
<path d="M28 5.25C38.372 5.25 46.7419 13.1815 46.749 23.9531C46.5918 28.9374 43.7778 34.7253 40.1855 40.0918C36.6176 45.422 32.4158 50.1436 29.7549 52.9453C28.7822 53.9692 27.2179 53.9702 26.2422 52.9453C23.5431 50.1094 19.2629 45.3141 15.665 39.9561C12.0315 34.5448 9.25 28.7835 9.25 23.9668C9.25004 13.1882 17.6236 5.25 28 5.25Z" fill="#FF5E00" stroke="white" stroke-width="2.5"/>
<mask id="path-3-inside-1_2082_3501" fill="white">
<path fill-rule="evenodd" clip-rule="evenodd" d="M32.408 33.1231C32.408 32.8108 32.591 32.5294 32.8682 32.3856C35.9958 30.7637 38.2104 27.7166 38.5391 24.5983C38.5854 24.1589 38.2233 23.7998 37.7815 23.7998H18.2177C17.7759 23.7998 17.4137 24.1589 17.4601 24.5983C17.7887 27.7162 20.0027 30.7628 23.1297 32.385C23.4068 32.5287 23.5898 32.8102 23.5898 33.1223V34.25C23.5898 34.6918 23.9479 35.05 24.3898 35.05H31.608C32.0498 35.05 32.408 34.6918 32.408 34.25V33.1231Z"/>
</mask>
<path fill-rule="evenodd" clip-rule="evenodd" d="M32.408 33.1231C32.408 32.8108 32.591 32.5294 32.8682 32.3856C35.9958 30.7637 38.2104 27.7166 38.5391 24.5983C38.5854 24.1589 38.2233 23.7998 37.7815 23.7998H18.2177C17.7759 23.7998 17.4137 24.1589 17.4601 24.5983C17.7887 27.7162 20.0027 30.7628 23.1297 32.385C23.4068 32.5287 23.5898 32.8102 23.5898 33.1223V34.25C23.5898 34.6918 23.9479 35.05 24.3898 35.05H31.608C32.0498 35.05 32.408 34.6918 32.408 34.25V33.1231Z" fill="white"/>
<path d="M23.1297 32.385L23.8204 31.0535L23.1297 32.385ZM38.5391 24.5983L40.0309 24.7555L38.5391 24.5983ZM32.8682 32.3856L32.1776 31.0541L32.8682 32.3856ZM32.8682 32.3856L33.5587 33.7172C37.0707 31.896 39.6423 28.4419 40.0309 24.7555L38.5391 24.5983L37.0474 24.441C36.7786 26.9914 34.921 29.6314 32.1776 31.0541L32.8682 32.3856ZM37.7815 23.7998V22.2998H18.2177V23.7998V25.2998H37.7815V23.7998ZM17.4601 24.5983L15.9683 24.7555C16.3568 28.4414 18.9278 31.895 22.439 33.7165L23.1297 32.385L23.8204 31.0535C21.0776 29.6306 19.2206 26.991 18.9518 24.441L17.4601 24.5983ZM23.5898 34.25H25.0898V33.1223H23.5898H22.0898V34.25H23.5898ZM31.608 35.05V33.55H24.3898V35.05V36.55H31.608V35.05ZM32.408 33.1231H30.908V34.25H32.408H33.908V33.1231H32.408ZM31.608 35.05V36.55C32.8783 36.55 33.908 35.5202 33.908 34.25H32.408H30.908C30.908 33.8634 31.2214 33.55 31.608 33.55V35.05ZM23.5898 34.25H22.0898C22.0898 35.5202 23.1195 36.55 24.3898 36.55V35.05V33.55C24.7764 33.55 25.0898 33.8634 25.0898 34.25H23.5898ZM23.1297 32.385L22.439 33.7165C22.2544 33.6207 22.0898 33.4092 22.0898 33.1223H23.5898H25.0898C25.0898 32.2111 24.5592 31.4367 23.8204 31.0535L23.1297 32.385ZM18.2177 23.7998V22.2998C16.9944 22.2998 15.8176 23.3253 15.9683 24.7555L17.4601 24.5983L18.9518 24.441C19.0099 24.9925 18.5573 25.2998 18.2177 25.2998V23.7998ZM38.5391 24.5983L40.0309 24.7555C40.1816 23.3253 39.0048 22.2998 37.7815 22.2998V23.7998V25.2998C37.4418 25.2998 36.9893 24.9925 37.0474 24.441L38.5391 24.5983ZM32.8682 32.3856L32.1776 31.0541C31.4387 31.4372 30.908 32.2117 30.908 33.1231H32.408H33.908C33.908 33.41 33.7433 33.6215 33.5587 33.7172L32.8682 32.3856Z" fill="white" mask="url(#path-3-inside-1_2082_3501)"/>
<path d="M20.5 16H37" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M20.5029 19H22.75M32.5 19H37" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M25.8994 19V25.75M29.0498 19V22" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</g>
<defs>
<filter id="filter0_d_2082_3501" x="0" y="0" width="56" height="68.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2082_3501"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2082_3501" result="shape"/>
</filter>
</defs>
</svg>`;

const USER_POSITION_MARKER = `
<div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
  <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(66, 133, 244, 0.3); animation: pulse 2s infinite;"></div>
  <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(66, 133, 244, 0.2); animation: pulse 2s infinite 0.5s;"></div>
  <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(66, 133, 244, 0.1); animation: pulse 2s infinite 1s;"></div>
  <div style="width: 12px; height: 12px; border-radius: 50%; background: #4285f4; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 1;"></div>
</div>
<style>
  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.2); opacity: 0; }
  }
</style>
`;

const createMarkerLabel = (title?: string) => {
  if (!title) {
    return "";
  }

  return `
    <div style="
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      max-width: 120px;
      text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
    ">${title}</div>
  `;
};

const getMarkerDimensions = ({ inactive, isSelected }: { inactive?: boolean; isSelected: boolean }) => {
  const isLargeMarker = isSelected && !inactive;

  return {
    width: isLargeMarker ? 56 : 38,
    height: isLargeMarker ? 79 : 57,
    anchorX: isLargeMarker ? 28 : 19,
    anchorY: isLargeMarker ? 67 : 45,
  };
};

const getMarkerSvg = ({ inactive, isSelected }: { inactive?: boolean; isSelected: boolean }) => {
  if (inactive) {
    return INACTIVE_MARKER_SVG;
  }

  return isSelected ? SELECTED_MARKER_SVG : NORMAL_MARKER_SVG;
};

export const createMarkerIcon = ({
  inactive,
  isSelected,
  title,
}: {
  inactive?: boolean;
  isSelected: boolean;
  title?: string;
}) => {
  const { width, height, anchorX, anchorY } = getMarkerDimensions({ inactive, isSelected });

  return {
    content: `
      <div style="position: relative; width: ${width}px; height: ${height}px; overflow: visible;">
        ${getMarkerSvg({ inactive, isSelected })}
        ${createMarkerLabel(title)}
      </div>
    `,
    size: new naver.maps.Size(width, height),
    anchor: new naver.maps.Point(anchorX, anchorY),
  };
};

export const USER_POSITION_MARKER_ICON = {
  content: USER_POSITION_MARKER,
  size: new naver.maps.Size(40, 40),
  anchor: new naver.maps.Point(20, 20),
};

export const createMarkerSnapshotKey = ({
  inactive,
  position,
  title,
}: {
  inactive?: boolean;
  position: { lat: number; lng: number };
  title?: string;
}) => {
  return `${position.lat}-${position.lng}-${title ?? ""}-${inactive ? "inactive" : "active"}`;
};

export const getMarkerCenterPosition = ({
  latitude,
  longitude,
  zoom,
}: {
  latitude: number;
  longitude: number;
  zoom: number;
}) => {
  return zoom < 15 ? new naver.maps.LatLng(latitude - 0.005, longitude) : new naver.maps.LatLng(latitude, longitude);
};
