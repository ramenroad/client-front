import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { hapticNotification } from "@/shared/lib/haptic";
import { Toast } from "./Toast";
import { ToastContext, type ToastVariant } from "./context";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [message, setMessage] = useState("");
  const [action, setAction] = useState<ReactNode>(null);
  const [variant, setVariant] = useState<ToastVariant>("success");
  const [isVisible, setIsVisible] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const cleanupTimerRef = useRef<number | null>(null);

  const openToast = useCallback((toastMessage: string, toastAction?: ReactNode, toastVariant: ToastVariant = "success") => {
    setMessage(toastMessage);
    setAction(toastAction ?? null);
    setVariant(toastVariant);
    setIsVisible(true);
    hapticNotification(toastVariant === "error" ? "error" : "success"); // 앱에서 토스트가 뜰 때 햅틱(웹/구버전 앱은 no-op).

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
      <Toast message={message} action={action} isVisible={isVisible} variant={variant} />
    </ToastContext.Provider>
  );
};
