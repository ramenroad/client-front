import type { SVGProps } from "react";

interface CommunityIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  hasBadge?: boolean;
  filled?: boolean;
}

export const CommunityBellIcon = ({ color = "#CFCFCF", hasBadge = false, ...props }: CommunityIconProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 4.25C9.51472 4.25 7.5 6.26472 7.5 8.75V10.92C7.5 12.03 7.09997 13.1029 6.37395 13.9418L5.16349 15.3407C4.58608 16.0079 5.06009 17.05 5.94234 17.05H18.0577C18.9399 17.05 19.4139 16.0079 18.8365 15.3407L17.626 13.9418C16.9 13.1029 16.5 12.03 16.5 10.92V8.75C16.5 6.26472 14.4853 4.25 12 4.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.125 19.1C10.4036 19.884 11.1517 20.45 12 20.45C12.8483 20.45 13.5964 19.884 13.875 19.1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {hasBadge ? <circle cx="19" cy="6" r="2" fill="#FF5E00" /> : null}
    </svg>
  );
};

export const CommunityEyeIcon = ({ color = "#A0A0A0", ...props }: CommunityIconProps) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.75 7C2.63349 5.20342 4.53035 4 7 4C9.46965 4 11.3665 5.20342 12.25 7C11.3665 8.79658 9.46965 10 7 10C4.53035 10 2.63349 8.79658 1.75 7Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.7" stroke={color} strokeWidth="1.2" />
    </svg>
  );
};

export const CommunityHeartIcon = ({ color = "#A0A0A0", filled = false, ...props }: CommunityIconProps) => {
  if (filled) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d="M7 11.6667L6.32254 11.0498C3.9168 8.8598 2.33337 7.41795 2.33337 5.66667C2.33337 4.22492 3.45864 3.08334 4.87504 3.08334C5.67556 3.08334 6.4433 3.45689 7 4.04176C7.55675 3.45689 8.32448 3.08334 9.12504 3.08334C10.5415 3.08334 11.6667 4.22492 11.6667 5.66667C11.6667 7.41795 10.0833 8.8598 7.67754 11.0498L7 11.6667Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7 11.6667L6.32254 11.0498C3.9168 8.8598 2.33337 7.41795 2.33337 5.66667C2.33337 4.22492 3.45864 3.08334 4.87504 3.08334C5.67556 3.08334 6.4433 3.45689 7 4.04176C7.55675 3.45689 8.32448 3.08334 9.12504 3.08334C10.5415 3.08334 11.6667 4.22492 11.6667 5.66667C11.6667 7.41795 10.0833 8.8598 7.67754 11.0498L7 11.6667Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CommunityCommentIcon = ({ color = "#A0A0A0", ...props }: CommunityIconProps) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.58337" y="2.08334" width="10.8333" height="7.75" rx="1.25" stroke={color} strokeWidth="1.2" />
      <path
        d="M4.08337 10.25V11.4167L5.48987 10.0102H9.50004"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.66663 5.29166H9.33329" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4.66663 7.04166H7.58329" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

export const CommunityWriteIcon = ({ color = "#FFFFFF", ...props }: CommunityIconProps) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 14.5001L4.25 11.7501L12.7917 3.22926C13.1812 2.84071 13.8117 2.84071 14.2012 3.22926L16.7708 5.79176C17.1603 6.18032 17.1603 6.8103 16.7708 7.19885L8.22917 15.7197L5.45833 15.9584C4.65191 16.0278 3.93054 15.3065 4 14.5001Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10.8333 5.16669L14.8333 9.16669" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.75 16.25H16.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
