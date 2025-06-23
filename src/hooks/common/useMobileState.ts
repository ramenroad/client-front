import { useEffect, useState } from "react";

export const useMobileState = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobile = regex.test(navigator.userAgent);
    setIsMobile(isMobile);
  }, []);

  return {
    isMobile,
  };
};
