import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import render from "@/shared/ui/render";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Toast = ({ message, isOpen, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      window.setTimeout(onClose, 300);
    }, 2000);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, message, onClose]);

  if (!isOpen && !isVisible) {
    return null;
  }

  return createPortal(
    <ToastContainer>
      <ToastWrapper isVisible={isVisible}>
        <ToastContent>{message}</ToastContent>
      </ToastWrapper>
    </ToastContainer>,
    document.body,
  );
};

const ToastContainer = render.div("fixed bottom-68 z-[150] w-full flex justify-center items-center");

const ToastWrapper = styled.div<{ isVisible: boolean }>(({ isVisible }) => [
  {
    transition: "all 0.3s ease",
  },
  isVisible
    ? {
        transform: "translateY(0)",
        opacity: 1,
      }
    : {
        transform: "translateY(4px)",
        opacity: 0,
      },
]);

const ToastContent = render.div(
  "bg-gray-700 text-white px-6 py-3 rounded-lg font-16-m w-350 h-48 flex justify-center items-center",
);
