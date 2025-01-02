import { SVGProps } from "react";
import tw from "twin.macro";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  color?: string;
}
export const IconSample = ({ color, ...rest }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path d="" fill={color ?? "#000"} />
  </svg>
);

export const IconFilter = ({ color, ...rest }: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    css={tw`cursor-pointer`}
    {...rest}
  >
    <path
      d="M3 6H21"
      stroke={color ?? "#414141"}
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M3 12H21"
      stroke={color ?? "#414141"}
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M3 18H21"
      stroke={color ?? "#414141"}
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <circle
      cx="8.5"
      cy="6"
      r="1.75"
      fill="white"
      stroke={color ?? "#414141"}
      stroke-width="1.5"
    />
    <circle
      cx="15.5"
      cy="12"
      r="1.75"
      fill="white"
      stroke={color ?? "#414141"}
      stroke-width="1.5"
    />
    <circle
      cx="10.5"
      cy="18"
      r="1.75"
      fill="white"
      stroke={color ?? "#414141"}
      stroke-width="1.5"
    />
  </svg>
);

export const IconInstagram = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect width="16" height="16" fill="white" />
    <rect x="2" y="2" width="12" height="12" rx="3" fill={color ?? "#CFCFCF"} />
    <circle cx="8" cy="8" r="2.5" stroke="white" />
    <circle cx="11.5" cy="4.5" r="0.5" fill="white" />
  </svg>
);

export const IconLocate = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect width="16" height="16" fill={color ?? "#CFCFCF"} />
    <path
      d="M14 6.76136C14 9.94328 10.6667 13.0795 8 15C6 13.7197 2 9.94328 2 6.76136C2 3.57945 4.68629 1 8 1C11.3137 1 14 3.57945 14 6.76136Z"
      fill={color ?? "#CFCFCF"}
    />
    <circle cx="8" cy="7" r="1" fill={color ?? "#CFCFCF"} />
  </svg>
);

export const IconTime = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect width="16" height="16" fill={color ?? "#CFCFCF"} />
    <circle cx="8" cy="8" r="6" fill={color ?? "#CFCFCF"} />
    <path
      d="M8 5.5V8.29289C8 8.4255 8.05268 8.55268 8.14645 8.64645L9.5 10"
      stroke="white"
      stroke-linecap="round"
    />
  </svg>
);
export const IconCall = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect width="16" height="16" fill={color ?? "#CFCFCF"} />
    <path
      d="M2.29595 3.93525C2.29868 3.90299 2.30157 3.87079 2.30463 3.83863L2.30712 3.83885C2.47637 2.44445 3.72092 1.42346 5.13207 1.54282C5.40617 1.56601 5.66684 1.63055 5.90848 1.72979L6.24951 6.41281C5.93834 6.59777 5.58698 6.71971 5.21433 6.76269C5.7442 8.36789 6.88131 9.71489 8.37489 10.5066C8.48001 10.1464 8.65944 9.82052 8.89422 9.5449L13.4523 10.6674C13.5098 10.9227 13.5297 11.1909 13.5065 11.4654C13.3844 12.909 12.1152 13.9803 10.6716 13.8582C10.6486 13.8562 10.6257 13.854 10.6029 13.8515C5.58458 13.3904 1.87049 8.96518 2.29595 3.93525Z"
      fill="#CFCFCF"
    />
  </svg>
);

export const IconTag = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <g clip-path="url(#clip0_182_1434)">
      <rect width="16" height="16" fill={color ?? "#CFCFCF"} />
      <path
        d="M7.66749 1.96825C7.92003 1.71571 8.28809 1.61703 8.6331 1.70935L12.5379 2.7543C12.8832 2.84671 13.153 3.11646 13.2454 3.4618L14.2904 7.3666C14.3827 7.71161 14.284 8.07967 14.0314 8.33222L7.79274 14.5709C7.40222 14.9614 6.76905 14.9614 6.37853 14.5709L1.42878 9.62117C1.03826 9.23065 1.03826 8.59749 1.42878 8.20696L7.66749 1.96825Z"
        fill="#CFCFCF"
      />
      <circle cx="10" cy="5.5" r="1" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_182_1434">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const IconBack = ({ color, ...rest }: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      d="M9.5 4.5L2.70711 11.2929C2.31658 11.6834 2.31658 12.3166 2.70711 12.7071L9.5 19.5"
      stroke={color ?? "#111111"}
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M3.5 12H22"
      stroke={color ?? "#111111"}
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
);

export const IconDropDown = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      d="M3 6L7.29289 10.2929C7.68342 10.6834 8.31658 10.6834 8.70711 10.2929L13 6"
      stroke={color ?? "#565656"}
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
);

export const IconDropDownSelected = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      d="M3 10L7.29289 5.70711C7.68342 5.31658 8.31658 5.31658 8.70711 5.70711L13 10"
      stroke={color ?? "#565656"}
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
);
