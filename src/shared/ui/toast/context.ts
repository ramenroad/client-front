import { createContext } from "react";

export interface ToastContextType {
  openToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
