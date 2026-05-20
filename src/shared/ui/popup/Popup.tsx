import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import render from "@/shared/ui/render";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  direction?: "center" | "bottom";
}

export const Popup = ({ isOpen, onClose, direction = "center", children }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Overlay direction={direction} onClick={onClose}>
      <PopupWrapper onClick={(event) => event.stopPropagation()}>{children}</PopupWrapper>
    </Overlay>,
    document.body,
  );
};

const Overlay = styled.div<{ direction: "center" | "bottom" }>(({ direction }) => [
  {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    backgroundColor: "rgb(0 0 0 / 0.4)",
    display: "flex",
  },
  direction === "bottom"
    ? {
        justifyContent: "center",
        alignItems: "flex-end",
      }
    : {
        justifyContent: "center",
        alignItems: "center",
      },
]);

const PopupWrapper = render.main("");
