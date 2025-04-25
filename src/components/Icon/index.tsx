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

export const IconFilterWithTag = ({ color, ...rest }: IconProps) => (
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

export const IconTalk = ({ color, ...rest }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect x="1" y="2" width="14" height="10" rx="1" fill="#CFCFCF" />
    <path
      d="M4 14.5172V11.2C4 11.0895 4.08954 11 4.2 11H7.51716C7.69534 11 7.78457 11.2154 7.65858 11.3414L4.34142 14.6586C4.21543 14.7846 4 14.6953 4 14.5172Z"
      fill={color ?? "#CFCFCF"}
    />
    <rect x="5" y="5" width="6" height="1" rx="0.5" fill="#F5F5F5" />
    <rect x="5" y="8" width="6" height="1" rx="0.5" fill="#F5F5F5" />
  </svg>
);

export const IconKakao = ({ color, ...rest }: IconProps) => (
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.5 15C14.7467 15 19 11.6421 19 7.5C19 3.35786 14.7467 0 9.5 0C4.25329 0 0 3.35786 0 7.5C0 9.96708 1.50885 12.156 3.83776 13.5228L3.79287 17.7491C3.79108 17.9181 3.98674 18.013 4.11835 17.9069L7.86348 14.8891C8.39513 14.962 8.94195 15 9.5 15Z"
      fill={color ?? "black"}
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
    preserveAspectRatio="none"
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

export const IconStarSmall = ({ color, ...rest }: IconProps) => (
  <svg
    width="12"
    height="11"
    viewBox="0 0 12 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      d="M6 0L7.76336 3.57295L11.7063 4.1459L8.85317 6.92705L9.52671 10.8541L6 9L2.47329 10.8541L3.14683 6.92705L0.293661 4.1459L4.23664 3.57295L6 0Z"
      fill={color ?? "#FFCC00"}
    />
  </svg>
);

export const IconHome = ({ selected }: { selected: boolean }) => {
  if (selected) {
    return (
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.44365 9.20947C3.16641 9.39509 3 9.70677 3 10.0404V21.8112C3 22.3635 3.44772 22.8112 4 22.8112H10C10.5523 22.8112 11 22.3635 11 21.8112V18.1165C11 17.5642 11.4477 17.1165 12 17.1165H14C14.5523 17.1165 15 17.5642 15 18.1165V21.8112C15 22.3635 15.4477 22.8112 16 22.8112H22C22.5523 22.8112 23 22.3635 23 21.8112V10.0404C23 9.70677 22.8336 9.39509 22.5563 9.20947L13.5563 3.1837C13.2197 2.9583 12.7803 2.9583 12.4437 3.1837L3.44365 9.20947Z"
          fill="#292929"
        />
      </svg>
    );
  }

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.44365 9.20947C3.16641 9.39509 3 9.70677 3 10.0404V21.8112C3 22.3635 3.44772 22.8112 4 22.8112H10C10.5523 22.8112 11 22.3635 11 21.8112V18.1165C11 17.5642 11.4477 17.1165 12 17.1165H14C14.5523 17.1165 15 17.5642 15 18.1165V21.8112C15 22.3635 15.4477 22.8112 16 22.8112H22C22.5523 22.8112 23 22.3635 23 21.8112V10.0404C23 9.70677 22.8336 9.39509 22.5563 9.20947L13.5563 3.1837C13.2197 2.9583 12.7803 2.9583 12.4437 3.1837L3.44365 9.20947Z"
        fill="#CFCFCF"
      />
    </svg>
  );
};

export const IconUser = ({ selected }: { selected: boolean }) => {
  if (selected) {
    return (
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="13" cy="6" r="4" fill="#292929" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.12837 20.9179C2.94365 22.0069 3.85704 22.9093 4.96161 22.9093H21.0254C22.13 22.9093 23.0434 22.0069 22.8586 20.9179C21.998 15.8438 17.9085 12 12.9935 12C8.07849 12 3.98903 15.8438 3.12837 20.9179Z"
          fill="#292929"
        />
      </svg>
    );
  }
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="13" cy="6" r="4" fill="#CFCFCF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.12837 20.9179C2.94365 22.0069 3.85704 22.9093 4.96161 22.9093H21.0254C22.13 22.9093 23.0434 22.0069 22.8586 20.9179C21.998 15.8438 17.9085 12 12.9935 12C8.07849 12 3.98903 15.8438 3.12837 20.9179Z"
        fill="#CFCFCF"
      />
    </svg>
  );
};

export const IconStarMedium = ({ color, ...rest }: IconProps) => (
  <svg
    width="14"
    height="13"
    viewBox="0 0 14 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      d="M7 0L9.05725 4.16844L13.6574 4.83688L10.3287 8.08156L11.1145 12.6631L7 10.5L2.8855 12.6631L3.6713 8.08156L0.342604 4.83688L4.94275 4.16844L7 0Z"
      fill={color ?? "#FFCC00"}
    />
  </svg>
);

export const IconStarLarge = ({ color, ...rest }: IconProps) => (
  <svg
    width="36"
    height="33"
    viewBox="0 0 36 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <path
      d="M18 0L23.2901 10.7188L35.119 12.4377L26.5595 20.7812L28.5801 32.5623L18 27L7.41987 32.5623L9.44049 20.7812L0.880983 12.4377L12.7099 10.7188L18 0Z"
      fill={color ?? "#FFCC00"}
    />
  </svg>
);

export const IconAdd = ({ color, ...rest }: IconProps) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    {...rest}
  >
    <rect x="17" y="7" width="2" height="22" rx="1" fill={color ?? "#CFCFCF"} />
    <rect
      x="29"
      y="17"
      width="2"
      height="22"
      rx="1"
      transform="rotate(90 29 17)"
      fill={color ?? "#CFCFCF"}
    />
  </svg>
);

export const IconDelete = ({ color, ...rest }: IconProps) => (
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
      d="M1.6959 10.302C1.4347 10.038 1.4347 9.61 1.6959 9.34601L9.26298 1.69799C9.52418 1.434 9.94766 1.434 10.2089 1.69799C10.4701 1.96199 10.4701 2.39 10.2089 2.654L2.64178 10.302C2.38058 10.566 1.9571 10.566 1.6959 10.302Z"
      fill={color ?? "#585858"}
    />
    <path
      d="M10.3041 10.302C10.5653 10.038 10.5653 9.61 10.3041 9.34601L2.73702 1.69799C2.47582 1.434 2.05234 1.434 1.79114 1.69799C1.52994 1.96199 1.52994 2.39 1.79114 2.654L9.35822 10.302C9.61941 10.566 10.0429 10.566 10.3041 10.302Z"
      fill={color ?? "#585858"}
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

export const IconUnSignInUser = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="32" fill="#FFEFE5" />
    <circle cx="32" cy="22" r="6" fill="#FFDFCB" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.4738 62.6548H31.5252C31.6827 62.66 31.8408 62.6626 31.9995 62.6626C32.1582 62.6626 32.3163 62.66 32.4738 62.6548ZM46.8833 44.6616C47.0116 45.7588 46.1038 46.6587 44.999 46.6587H18.9999C17.8952 46.6587 16.9873 45.7589 17.1156 44.6616C18.0387 36.7695 24.3505 30.6626 31.9995 30.6626C39.6484 30.6626 45.9602 36.7695 46.8833 44.6616Z"
      fill="#FFDFCB"
    />
  </svg>
);

export const IconUnSignInUserProfile = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="32" fill="#FF5E00" fill-opacity="0.1" />
    <path
      d="M29.5311 15.9914C30.8702 13.7401 34.1298 13.7401 35.4689 15.9914C36.3552 17.4815 38.2087 18.0837 39.8017 17.3992C42.2083 16.3649 44.8453 18.2809 44.6054 20.8893C44.4466 22.6158 45.5921 24.1925 47.2832 24.575C49.8381 25.1528 50.8454 28.2529 49.1181 30.2221C47.9748 31.5255 47.9748 33.4745 49.1181 34.7779C50.8454 36.7471 49.8381 39.8472 47.2832 40.425C45.5921 40.8075 44.4466 42.3842 44.6054 44.1107C44.8453 46.7191 42.2083 48.6351 39.8017 47.6008C38.2087 46.9163 36.3552 47.5185 35.4689 49.0086C34.1298 51.2599 30.8702 51.2599 29.5311 49.0086C28.6448 47.5185 26.7913 46.9163 25.1983 47.6008C22.7917 48.6351 20.1547 46.7191 20.3946 44.1107C20.5534 42.3842 19.4079 40.8075 17.7168 40.425C15.1619 39.8472 14.1546 36.7471 15.8819 34.7779C17.0252 33.4745 17.0252 31.5255 15.8819 30.2221C14.1546 28.2529 15.1619 25.1528 17.7168 24.575C19.4079 24.1925 20.5534 22.6158 20.3946 20.8893C20.1547 18.2809 22.7917 16.3649 25.1983 17.3992C26.7913 18.0837 28.6448 17.4815 29.5311 15.9914Z"
      fill="#FFC5A0"
    />
    <path
      d="M28.1002 14.8753C29.4081 12.6764 32.5919 12.6764 33.8998 14.8753C34.7655 16.3308 36.576 16.919 38.1318 16.2504C40.4825 15.2402 43.0582 17.1116 42.8239 19.6593C42.6687 21.3457 43.7877 22.8857 45.4394 23.2593C47.9349 23.8237 48.9187 26.8517 47.2316 28.7751C46.1149 30.0482 46.1149 31.9518 47.2316 33.2249C48.9187 35.1483 47.9349 38.1763 45.4394 38.7407C43.7877 39.1143 42.6687 40.6543 42.8239 42.3407C43.0582 44.8884 40.4825 46.7598 38.1318 45.7496C36.576 45.081 34.7655 45.6692 33.8998 47.1247C32.5919 49.3236 29.4081 49.3236 28.1002 47.1247C27.2345 45.6692 25.424 45.081 23.8682 45.7496C21.5175 46.7598 18.9418 44.8884 19.1761 42.3407C19.3313 40.6543 18.2123 39.1143 16.5606 38.7407C14.0651 38.1763 13.0813 35.1483 14.7684 33.2249C15.8851 31.9518 15.8851 30.0482 14.7684 28.7751C13.0813 26.8517 14.0651 23.8237 16.5606 23.2593C18.2123 22.8857 19.3313 21.3457 19.1761 19.6593C18.9418 17.1116 21.5175 15.2402 23.8682 16.2504C25.424 16.919 27.2345 16.3308 28.1002 14.8753Z"
      fill="#FFDFCB"
    />
    <path
      d="M42.2805 32.0858C40.0651 38.0386 34.8728 41.6104 28.76 39.2001C23.873 37.2715 21.3447 31.844 23.1193 27.0825C24.5371 23.2719 29.0728 21.062 32.9837 22.6032C36.1116 23.8373 40.2704 26.9114 38.5089 31.64C37.5998 34.0803 34.1193 35.948 31.3938 35.5638C28.76 35.5638 24.5097 31.5659 27.3262 27.6772C28.7345 25.7329 31.1232 25.1669 33.7251 27.0514C35.026 27.9937 35.049 29.4719 34.1193 30.6212C33.4488 31.45 32.019 32.2794 30.7596 31.1521C30.1091 30.681 29.9281 29.5617 30.3975 28.9136"
      stroke="#FFC5A0"
      strokeWidth="1.2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
);

export const IconFilterWithOrder = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4V11"
      stroke="#888888"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12V5"
      stroke="#888888"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 10L6 12L7.5 10"
      stroke="#888888"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 6L10 4L11.5 6"
      stroke="#888888"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
