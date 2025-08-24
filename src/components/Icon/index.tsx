import { ComponentProps } from "react";

interface IconProps extends ComponentProps<"svg"> {
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
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#D9D9D9" />
    <path d="M8 12.5H11.5M14.25 12.5H23" stroke={color ?? "#FF5E00"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 17.5H17.5M20.5 17.5H23" stroke={color ?? "#FF5E00"} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="13" cy="12.5" r="1.25" stroke={color ?? "#FF5E00"} strokeWidth="1.5" />
    <circle cx="19" cy="17.5" r="1.25" stroke={color ?? "#FF5E00"} strokeWidth="1.5" />
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
    <path d="M8 5.5V8.29289C8 8.4255 8.05268 8.55268 8.14645 8.64645L9.5 10" stroke="white" strokeLinecap="round" />
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
    <path d="M3.5 12H22" stroke={color ?? "#111111"} strokeWidth="1.5" strokeLinecap="round" />
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
    <path d="M1.43896 1L14.9999 15" stroke={color ?? "#111111"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14.561 1L1.00014 15" stroke={color ?? "#111111"} strokeWidth="1.5" strokeLinecap="round" />
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
      fillRule="evenodd"
      clipRule="evenodd"
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
    <path d="M9.49917 7.49L4.30413 0H0V14H4.5124V6.51L9.69587 14H14V0H9.49917V7.49Z" fill="white" />
  </svg>
);

export const IconStar = ({
  inactive = false,
  size = 14,
  isHalf = false,
  ...rest
}: ComponentProps<"svg"> & {
  inactive?: boolean;
  size?: number;
  isHalf?: boolean;
}) => {
  if (isHalf) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
        <path
          d="M20 2L25.2901 12.7188L37.119 14.4377L28.5595 22.7812L30.5801 34.5623L20 29L9.41987 34.5623L11.4405 22.7812L2.88098 14.4377L14.7099 12.7188L20 2Z"
          fill="#E1E1E1"
        />
        <path d="M20 29L9.41992 34.5625L11.4404 22.7812L2.88086 14.4375L14.71 12.7188L20 2V29Z" fill="#FFCC00" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M20 2L25.2901 12.7188L37.119 14.4377L28.5595 22.7812L30.5801 34.5623L20 29L9.41987 34.5623L11.4405 22.7812L2.88098 14.4377L14.7099 12.7188L20 2Z"
        fill={inactive ? "#E1E1E1" : "#FFCC00"}
      />
    </svg>
  );
};

export const IconHome = ({ selected }: { selected: boolean }) => {
  if (selected) {
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <rect x="29" y="17" width="2" height="22" rx="1" transform="rotate(90 29 17)" fill={color ?? "#CFCFCF"} />
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
    <rect x="11" y="3" width="7" height="10" rx="0.5" transform="rotate(90 11 3)" fill={color ?? "white"} />
    <rect x="8" y="1" width="6" height="4" rx="0.5" transform="rotate(90 8 1)" fill={color ?? "white"} />
    <circle cx="6" cy="6.5" r="2" fill={color ?? "#CFCFCF"} />
  </svg>
);

export const IconUnSignInUser = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#FF5E00" fillOpacity="0.1" />
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
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4V11" stroke="#888888" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 12V5" stroke="#888888" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 10L6 12L7.5 10" stroke="#888888" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 6L10 4L11.5 6" stroke="#888888" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconNavLeft = () => (
  <svg width="21" height="29" viewBox="0 0 21 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_1125_1151)">
      <path
        d="M16 25L4.70711 13.7071C4.31658 13.3166 4.31658 12.6834 4.70711 12.2929L16 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1125_1151"
        x="-0.335938"
        y="0.25"
        width="21.0859"
        height="33.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1125_1151" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1125_1151" result="shape" />
      </filter>
    </defs>
  </svg>
);

export const IconNavRight = () => (
  <svg width="21" height="29" viewBox="0 0 21 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_1125_1153)">
      <path
        d="M5 25L16.2929 13.7071C16.6834 13.3166 16.6834 12.6834 16.2929 12.2929L5 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1125_1153"
        x="0.25"
        y="0.25"
        width="21.0859"
        height="33.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1125_1153" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1125_1153" result="shape" />
      </filter>
    </defs>
  </svg>
);

export const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 9L8 13L15.5 6.5" stroke="#FF5E00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPinned = () => (
  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask
      id="mask0_1303_2011"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="18"
      height="19"
    >
      <rect y="0.5" width="18" height="18" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_1303_2011)">
      <rect
        x="8.43945"
        y="10.3535"
        width="1"
        height="5"
        rx="0.5"
        transform="rotate(45 8.43945 10.3535)"
        fill="#888888"
      />
      <path
        d="M14.8031 6.818C15.1936 7.20853 15.1936 7.84169 14.8031 8.23222C14.437 8.59818 13.8576 8.62149 13.4649 8.30127L13.3889 8.23222L10.9948 10.6263C11.2949 11.6395 11.1158 12.8138 10.4783 13.8179C10.1823 14.2839 9.53744 14.2799 9.14695 13.8898L5.61141 10.3542C5.22096 9.96377 5.21653 9.31828 5.68254 9.02219C6.68624 8.38494 7.85995 8.20611 8.8728 8.50567L11.2676 6.1109L11.1985 6.03494C10.8784 5.64221 10.9017 5.06272 11.2676 4.69668C11.6581 4.30618 12.2913 4.30623 12.6818 4.69668L14.8031 6.818Z"
        fill="#FF5E00"
      />
    </g>
  </svg>
);

export const IconMap = (props: { type: "naver" | "kakao" | "google" }) => {
  const { type } = props;
  if (type === "naver") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="white" />
        <path d="M15.1777 12.025L9.61157 4H5V19H9.83471V10.975L15.3884 19H20V4H15.1777V12.025Z" fill="#03C75A" />
      </svg>
    );
  }
  if (type === "kakao") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="white" />
        <path
          d="M12 4C16.9706 4 21 7.18134 21 11.1055C20.9999 15.0295 16.9705 18.2109 12 18.2109C11.4718 18.2109 10.9544 18.1724 10.4512 18.1035L6.9209 20.9492C6.78929 21.0552 6.59391 20.96 6.5957 20.791L6.63672 16.8105C4.43018 15.5157 3.00008 13.4428 3 11.1055C3 7.18134 7.02944 4 12 4Z"
          fill="#FAE100"
        />
      </svg>
    );
  }
  if (type === "google") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect width="24" height="24" fill="white" />
        <rect x="4.14073" y="3" width="16.7185" height="17" fill="url(#pattern0_1303_1733)" />
        <defs>
          <pattern id="pattern0_1303_1733" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_1303_1733" transform="scale(0.003367 0.00331126)" />
          </pattern>
          <image
            id="image0_1303_1733"
            width="297"
            height="302"
            preserveAspectRatio="none"
            xlinkHref="data:image/png;base64,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"
          />
        </defs>
      </svg>
    );
  }
};

export const IconReview = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="3" width="14" height="17" rx="2" fill="#FFEADE" />
    <rect x="8" y="8" width="8" height="1" rx="0.5" fill="#FF9252" />
    <path
      d="M19.2546 7.68271C19.2995 7.5818 19.4177 7.53642 19.5186 7.58135L20.9803 8.23213C21.0812 8.27705 21.1266 8.39527 21.0817 8.49618L17.8128 15.8382C17.8019 15.8626 17.7863 15.8846 17.7667 15.9029L16.2663 17.3059C16.1372 17.4266 15.9264 17.3328 15.9298 17.1561L15.9685 15.1023C15.969 15.0755 15.9748 15.0491 15.9857 15.0247L19.2546 7.68271Z"
      fill="#FF5E00"
    />
    <rect x="8" y="11" width="5" height="1" rx="0.5" fill="#FF9252" />
  </svg>
);

export const IconShare = ({ color, ...rest }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      d="M17.5 6L8.10947 11.1221C7.41461 11.5011 7.41461 12.4989 8.10948 12.8779L17.5 18"
      stroke="#111111"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="17.5" cy="6.5" r="2.5" fill={color || "#111111"} />
    <circle cx="17.5" cy="17.5" r="2.5" fill={color || "#111111"} />
    <circle cx="6.5" cy="12" r="2.5" fill={color || "#111111"} />
  </svg>
);

export const IconMore = ({ color, ...rest }: IconProps) => (
  <svg width="26" height="6" viewBox="0 0 26 6" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <circle cx="3" cy="3" r="3" fill={color || "#111111"} />
    <circle cx="13" cy="3" r="3" fill={color || "#111111"} />
    <circle cx="23" cy="3" r="3" fill={color || "#111111"} />
  </svg>
);

export const IconLock = () => (
  <svg width="80" height="62" viewBox="0 0 80 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="6" width="20" height="36" rx="10" stroke="#F4F4F5" strokeWidth="6" />
    <rect x="18" y="25" width="44" height="33" rx="8" fill="#F4F4F5" />
    <circle cx="40" cy="38" r="4" fill="#E4E4E4" />
    <rect x="38" y="40" width="4" height="8" fill="#E4E4E4" />
  </svg>
);

export const IconEmptyReview = () => (
  <svg width="80" height="62" viewBox="0 0 80 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M58 55.7929V45.5C58 45.2239 57.7761 45 57.5 45H47.2071C46.7617 45 46.5386 45.5386 46.8536 45.8536L57.1464 56.1464C57.4614 56.4614 58 56.2383 58 55.7929Z"
      fill="#F4F4F5"
    />
    <rect x="13" y="8" width="54" height="40" rx="8" fill="#F4F4F5" />
    <circle cx="29.5" cy="28.5" r="2.5" fill="white" />
    <circle cx="40.5" cy="28.5" r="2.5" fill="white" />
    <circle cx="51.5" cy="28.5" r="2.5" fill="white" />
  </svg>
);

export const IconMapAppBar = ({ selected }: { selected: boolean }) => {
  if (selected) {
    return (
      <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 9.48675C20.8633 14.0615 15.5695 19.8858 13.6699 21.8327C13.2981 22.2136 12.7025 22.214 12.3305 21.8333C10.4068 19.8643 5 13.9346 5 9.48675C5 4.89081 8.58172 1.5 13 1.5C17.4183 1.5 21 4.89081 21 9.48675Z"
          fill="#292929"
        />
        <circle cx="13" cy="9.5" r="3" fill="white" />
      </svg>
    );
  }

  return (
    <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 9.48675C20.8633 14.0615 15.5695 19.8858 13.6699 21.8327C13.2981 22.2136 12.7025 22.214 12.3305 21.8333C10.4068 19.8643 5 13.9346 5 9.48675C5 4.89081 8.58172 1.5 13 1.5C17.4183 1.5 21 4.89081 21 9.48675Z"
        fill="#CFCFCF"
      />
      <circle cx="13" cy="9.5" r="3" fill="white" />
    </svg>
  );
};

export const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.35394 2.88676C7.00919 1.56535 3.9809 2.39908 2.59006 4.74895C1.19922 7.09882 1.97252 10.075 4.31726 11.3964C6.66201 12.7178 9.6903 11.8841 11.0811 9.53419C11.4875 8.84759 11.7092 8.10751 11.7608 7.37087"
      stroke="#585858"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.2853 3.15511L7.57976 3.87623C7.25957 3.96158 7.06998 4.29012 7.15631 4.61004C7.24263 4.92997 7.57218 5.12014 7.89238 5.0348L10.5979 4.31367C10.9181 4.22833 11.1077 3.89979 11.0214 3.57986C10.935 3.25994 10.6055 3.06977 10.2853 3.15511Z"
      fill="#585858"
    />
    <path
      d="M11.0431 3.58339L10.3152 0.87966C10.229 0.559684 9.89965 0.369623 9.57951 0.455145C9.25936 0.540668 9.06967 0.869389 9.15582 1.18936L9.88376 3.89309C9.9699 4.21307 10.2993 4.40313 10.6194 4.3176C10.9396 4.23208 11.1293 3.90336 11.0431 3.58339Z"
      fill="#585858"
    />
  </svg>
);

export const IconMarker = () => (
  <svg width="38" height="45" viewBox="0 0 38 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_2082_2994)">
      <path
        d="M19 5.5C24.5287 5.5 28.988 9.73696 28.999 15.5078C28.9216 18.0186 27.5785 20.9563 25.7627 23.7744C23.965 26.5645 21.7963 29.0996 20.2539 30.7715C19.5637 31.5193 18.436 31.5202 17.7441 30.7725C16.1783 29.0799 13.9685 26.5077 12.1562 23.7041C10.32 20.8633 9 17.9468 9 15.5293C9.00001 9.74748 13.4644 5.5 19 5.5Z"
        fill="#FF5E00"
        stroke="white"
        strokeWidth="2"
      />
      <ellipse cx="19" cy="15.6693" rx="3" ry="3.04622" fill="white" />
    </g>
    <defs>
      <filter
        id="filter0_d_2082_2994"
        x="-1"
        y="0"
        width="40"
        height="46"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2082_2994" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2082_2994" result="shape" />
      </filter>
    </defs>
  </svg>
);

export const IconSearch = ({ color, ...rest }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M16.625 17.375L13.2445 13.9945" stroke={color || "#414141"} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8.5" cy="9.5" r="5.75" stroke={color || "#414141"} strokeWidth="1.5" />
  </svg>
);

export const IconComment = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="11" fill="#F6F6F6" />
    <circle cx="12" cy="16" r="1" fill="#CFCFCF" />
    <circle cx="16" cy="16" r="1" fill="#CFCFCF" />
    <circle cx="20" cy="16" r="1" fill="#CFCFCF" />
  </svg>
);

export const IconEmail = () => (
  <svg width="110" height="82" viewBox="0 0 110 82" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_2339_4369" maskUnits="userSpaceOnUse" x="14" y="9" width="82" height="60">
      <path
        d="M14 15.8799C14 12.0803 17.0649 9 20.8457 9H89.1543C92.9351 9 96 12.0803 96 15.8799V62.1201C96 65.9197 92.9351 69 89.1543 69H20.8457C17.0649 69 14 65.9198 14 62.1201V15.8799Z"
        fill="#2C958F"
      />
    </mask>
    <g mask="url(#mask0_2339_4369)">
      <path d="M21.0825 69.0155H87.95L14 9.12283V61.8976C14 65.8287 17.1709 69.0155 21.0825 69.0155Z" fill="#FFDAAF" />
      <path
        d="M89.1325 69.0155H22.265L96.215 9.12283V61.8976C96.215 65.8287 93.0441 69.0155 89.1325 69.0155Z"
        fill="#FFDAAF"
      />
      <path
        d="M87.6344 69.0528H21.9048L51.0311 41.399C53.1431 39.3937 56.4457 39.395 58.5561 41.4019L87.6344 69.0528Z"
        fill="#FFD19D"
      />
      <path d="M96 9H14L49.879 44.5708C52.6289 47.2971 57.0453 47.3061 59.8062 44.5912L96 9Z" fill="#FFE8CE" />
    </g>
    <circle cx="90.5" cy="61.5" r="15.5" fill="#5FCBA7" />
    <path
      d="M84 62.1538L88.1364 66L97 58"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCoordinate = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10" r="5.5" stroke="#FF5E00" />
    <circle cx="10.5" cy="10" r="2.5" fill="#FF5E00" />
    <rect x="10" y="2" width="1" height="3" rx="0.5" fill="#FF5E00" />
    <rect x="2.5" y="10.5" width="1" height="3" rx="0.5" transform="rotate(-90 2.5 10.5)" fill="#FF5E00" />
    <rect width="1" height="3" rx="0.5" transform="matrix(1 0 0 -1 10 18)" fill="#FF5E00" />
    <rect width="1" height="3" rx="0.5" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 18.5 10.5)" fill="#FF5E00" />
  </svg>
);

export const IconDeleteSearchValue = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="10" fill="#CFCFCF" />
    <rect width="20" height="20" rx="10" fill="#E7E7E7" />
    <path
      d="M6.17413 13.824C5.94196 13.5893 5.94196 13.2089 6.17413 12.9742L12.9004 6.17599C13.1326 5.94134 13.509 5.94134 13.7412 6.17599C13.9734 6.41065 13.9734 6.79111 13.7412 7.02577L7.01492 13.824C6.78274 14.0587 6.40631 14.0587 6.17413 13.824Z"
      fill="white"
    />
    <path
      d="M13.8259 13.824C14.058 13.5893 14.058 13.2089 13.8259 12.9742L7.09957 6.17599C6.8674 5.94134 6.49097 5.94134 6.25879 6.17599C6.02661 6.41065 6.02661 6.79111 6.25879 7.02577L12.9851 13.824C13.2173 14.0587 13.5937 14.0587 13.8259 13.824Z"
      fill="white"
    />
  </svg>
);

export const IconGPS = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_2730_5366)">
      <rect x="3" y="1" width="32" height="32" rx="16" fill="white" shape-rendering="crispEdges" />
      <circle cx="19" cy="17" r="5.5" stroke="#414141" />
      <circle cx="19" cy="17" r="2.5" fill="#414141" />
      <rect x="18.5" y="9" width="1" height="3" rx="0.5" fill="#414141" />
      <rect x="11" y="17.5" width="1" height="3" rx="0.5" transform="rotate(-90 11 17.5)" fill="#414141" />
      <rect width="1" height="3" rx="0.5" transform="matrix(1 0 0 -1 18.5 25)" fill="#414141" />
      <rect width="1" height="3" rx="0.5" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 27 17.5)" fill="#414141" />
    </g>
    <defs>
      <filter
        id="filter0_d_2730_5366"
        x="0"
        y="0"
        width="38"
        height="38"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="1.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2730_5366" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2730_5366" result="shape" />
      </filter>
    </defs>
  </svg>
);
