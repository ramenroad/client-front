import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import tw from "twin.macro";
import styled from "@emotion/styled";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Toast = ({ message, isOpen, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  return createPortal(
    <ToastContainer>
      <ToastWrapper isVisible={isVisible}>
        <ToastContent>{message}</ToastContent>
      </ToastWrapper>
    </ToastContainer>,
    document.body
  );
};

const ToastContainer = tw.div`
  fixed bottom-200 z-50 w-full
  flex justify-center items-center
`;

const ToastWrapper = styled.div<{ isVisible: boolean }>(({ isVisible }) => [
  tw`
    transition-all duration-300
  `,
  isVisible ? tw`translate-y-0 opacity-100` : tw`translate-y-4 opacity-0`,
]);

const ToastContent = tw.div`
  bg-black/80 text-white px-6 py-3 rounded-lg font-16-sb w-350 h-48 flex justify-center items-center
`;
