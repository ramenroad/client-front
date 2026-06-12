import { createContext, type ReactNode } from "react";

export interface ToastContextType {
  openToast: (message: string, action?: ReactNode) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
