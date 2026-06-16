import { createContext, type ReactNode } from "react";

export type ToastVariant = "success" | "error";

export interface ToastContextType {
  openToast: (message: string, action?: ReactNode, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
