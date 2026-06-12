import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Toast } from "./Toast";
import { ToastContext } from "./context";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [message, setMessage] = useState("");
  const [action, setAction] = useState<ReactNode>(null);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const cleanupTimerRef = useRef<number | null>(null);

  const openToast = useCallback((toastMessage: string, toastAction?: ReactNode) => {
    setMessage(toastMessage);
    setAction(toastAction ?? null);
    setIsVisible(true);

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    cleanupTimerRef.current = window.setTimeout(() => {
      setMessage("");
      setAction(null);
    }, 2300);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ openToast }}>
      {children}
      <Toast message={message} action={action} isVisible={isVisible} />
    </ToastContext.Provider>
  );
};
