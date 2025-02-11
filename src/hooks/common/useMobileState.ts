import { useEffect, useState } from "react";

export const useMobileState = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 400) {
      setIsMobile(true);
    }
  }, []);

  return {
    isMobile,
  };
};
