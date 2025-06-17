import { useEffect, useRef } from "react";

type UseIntersectionObserverProps = {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
};

export const useIntersectionObserver = ({
  onIntersect,
  threshold = 0.1,
  rootMargin = "0px",
}: UseIntersectionObserverProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, threshold, rootMargin]);

  return ref;
};
