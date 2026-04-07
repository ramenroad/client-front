import { isMobileDevice } from "@/shared/lib/image";

export const useMobileState = () => {
  return { isMobile: isMobileDevice() };
};
