import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { IconCheckCircle, IconClose } from "@/shared/ui/icon";
import render from "@/shared/ui/render";
import type { ToastVariant } from "./context";

interface ToastProps {
  message: string;
  action?: ReactNode;
  isVisible: boolean;
  variant?: ToastVariant;
}

export const Toast = ({ message, action, isVisible, variant = "success" }: ToastProps) => {
  if (!message) {
    return null;
  }

  return createPortal(
    <ToastContainer>
      <ToastWrapper isVisible={isVisible}>
        <ToastContent>
          <ToastLeft>
            {variant === "error" ? (
              <IconClose className="shrink-0" color="#ff5454" width={20} height={20} />
            ) : (
              <IconCheckCircle className="shrink-0" />
            )}
            <ToastMessage>{message}</ToastMessage>
          </ToastLeft>
          {action ? <ToastActionSlot>{action}</ToastActionSlot> : null}
        </ToastContent>
      </ToastWrapper>
    </ToastContainer>,
    document.body,
  );
};

const ToastContainer = render.div("fixed bottom-92 z-[150] flex w-full items-center justify-center px-20");

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
  "flex h-50 w-350 items-center justify-between gap-12 rounded-12 bg-gray-700 px-16",
);

const ToastLeft = render.div("flex min-w-0 items-center gap-8");

const ToastMessage = render.div("truncate font-16-m text-white");

const ToastActionSlot = render.div("shrink-0");
