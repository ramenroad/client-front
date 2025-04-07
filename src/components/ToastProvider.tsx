import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Toast } from "./Toast";

interface ToastContextType {
  openToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openToast = useCallback((toastMessage: string) => {
    setMessage(toastMessage);
    setIsOpen(true);
  }, []);

  const closeToast = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ToastContext.Provider value={{ openToast }}>
      {children}
      <Toast message={message} isOpen={isOpen} onClose={closeToast} />
    </ToastContext.Provider>
  );
};
