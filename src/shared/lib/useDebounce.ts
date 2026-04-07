import { useEffect, useState } from "react";

export const useDebounce = <T,>(value: T, delay: number): { value: T; isDebouncing: boolean } => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isDebouncing = debouncedValue !== value;

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(handler);
    };
  }, [delay, value]);

  return {
    value: debouncedValue,
    isDebouncing,
  };
};
