import { SVGProps } from "react";

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
    {...rest}
  >
    <path
      d="M3 6H21"
      stroke={color ?? "#414141"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 12H21"
      stroke={color ?? "#414141"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 18H21"
      stroke={color ?? "#414141"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="8.5"
      cy="6"
      r="1.75"
      fill="white"
      stroke={color ?? "#414141"}
      strokeWidth="1.5"
    />
    <circle
      cx="15.5"
      cy="12"
      r="1.75"
      fill="white"
      stroke={color ?? "#414141"}
      strokeWidth="1.5"
    />
    <circle
      cx="10.5"
      cy="18"
      r="1.75"
      fill="white"
      stroke={color ?? "#414141"}
      strokeWidth="1.5"
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
    <rect width="16" height="16" fill="white" />
    <path
      d="M14 6.76136C14 9.94328 10.6667 13.0795 8 15C6 13.7197 2 9.94328 2 6.76136C2 3.57945 4.68629 1 8 1C11.3137 1 14 3.57945 14 6.76136Z"
      fill={color ?? "#CFCFCF"}
    />
    <circle cx="8" cy="7" r="1" fill={"white"} />
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
    <rect width="16" height="16" fill={"white"} />
    <circle cx="8" cy="8" r="6" fill={color ?? "#CFCFCF"} />
    <path
      d="M8 5.5V8.29289C8 8.4255 8.05268 8.55268 8.14645 8.64645L9.5 10"
      stroke="white"
      strokeLinecap="round"
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
    <rect width="16" height="16" fill={"white"} />
    <path
      d="M2.29595 3.93525C2.29868 3.90299 2.30157 3.87079 2.30463 3.83863L2.30712 3.83885C2.47637 2.44445 3.72092 1.42346 5.13207 1.54282C5.40617 1.56601 5.66684 1.63055 5.90848 1.72979L6.24951 6.41281C5.93834 6.59777 5.58698 6.71971 5.21433 6.76269C5.7442 8.36789 6.88131 9.71489 8.37489 10.5066C8.48001 10.1464 8.65944 9.82052 8.89422 9.5449L13.4523 10.6674C13.5098 10.9227 13.5297 11.1909 13.5065 11.4654C13.3844 12.909 12.1152 13.9803 10.6716 13.8582C10.6486 13.8562 10.6257 13.854 10.6029 13.8515C5.58458 13.3904 1.87049 8.96518 2.29595 3.93525Z"
      fill={color ?? "#CFCFCF"}
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
    <g clipPath="url(#clip0_182_1434)">
      <rect width="16" height="16" fill={"white"} />
      <path
        d="M7.66749 1.96825C7.92003 1.71571 8.28809 1.61703 8.6331 1.70935L12.5379 2.7543C12.8832 2.84671 13.153 3.11646 13.2454 3.4618L14.2904 7.3666C14.3827 7.71161 14.284 8.07967 14.0314 8.33222L7.79274 14.5709C7.40222 14.9614 6.76905 14.9614 6.37853 14.5709L1.42878 9.62117C1.03826 9.23065 1.03826 8.59749 1.42878 8.20696L7.66749 1.96825Z"
        fill={color ?? "#CFCFCF"}
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
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3.5 12H22"
      stroke={color ?? "#111111"}
      strokeWidth="1.5"
      strokeLinecap="round"
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
      strokeWidth="1.5"
      strokeLinecap="round"
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
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconBar = ({ color, ...rest }: IconProps) => (
  <svg
    width="1"
    height="11"
    viewBox="0 0 1 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect y="0.5" width="1" height="10" fill={color ?? "#E7E7E7"} />
  </svg>
);

export const IconClose = ({ color, ...rest }: IconProps) => (
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
      d="M1.43896 1L14.9999 15"
      stroke={color ?? "#111111"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14.561 1L1.00014 15"
      stroke={color ?? "#111111"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconArrowRight = ({ color, ...rest }: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      d="M5 10L8.29289 6.70711C8.68342 6.31658 8.68342 5.68342 8.29289 5.29289L5 2"
      stroke={color ?? "#888888"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconTalk = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="2" width="14" height="10" rx="1" fill="#CFCFCF" />
    <path
      d="M4 14.5172V11.2C4 11.0895 4.08954 11 4.2 11H7.51716C7.69534 11 7.78457 11.2154 7.65858 11.3414L4.34142 14.6586C4.21543 14.7846 4 14.6953 4 14.5172Z"
      fill="#CFCFCF"
    />
    <rect x="5" y="5" width="6" height="1" rx="0.5" fill="#F5F5F5" />
    <rect x="5" y="8" width="6" height="1" rx="0.5" fill="#F5F5F5" />
  </svg>
);

export const IconKakao = () => (
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.5 15C14.7467 15 19 11.6421 19 7.5C19 3.35786 14.7467 0 9.5 0C4.25329 0 0 3.35786 0 7.5C0 9.96708 1.50885 12.156 3.83776 13.5228L3.79287 17.7491C3.79108 17.9181 3.98674 18.013 4.11835 17.9069L7.86348 14.8891C8.39513 14.962 8.94195 15 9.5 15Z"
      fill="black"
    />
  </svg>
);

export const IconNaver = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.49917 7.49L4.30413 0H0V14H4.5124V6.51L9.69587 14H14V0H9.49917V7.49Z"
      fill="white"
    />
  </svg>
);

export const IconStar = ({ inactive = false }: { inactive?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 1L8.76336 4.57295L12.7063 5.1459L9.85317 7.92705L10.5267 11.8541L7 10L3.47329 11.8541L4.14683 7.92705L1.29366 5.1459L5.23664 4.57295L7 1Z"
      fill={inactive ? "#CFCFCF" : "#FFCC00"}
    />
  </svg>
);

export const IconCamera = ({ color, ...rest }: IconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect
      x="11"
      y="3"
      width="7"
      height="10"
      rx="0.5"
      transform="rotate(90 11 3)"
      fill={color ?? "white"}
    />
    <rect
      x="8"
      y="1"
      width="6"
      height="4"
      rx="0.5"
      transform="rotate(90 8 1)"
      fill={color ?? "white"}
    />
    <circle cx="6" cy="6.5" r="2" fill={color ?? "#CFCFCF"} />
  </svg>
);
