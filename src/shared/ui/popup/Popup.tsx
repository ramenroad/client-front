import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

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
      <PopupWrapper direction={direction} onClick={(event) => event.stopPropagation()}>
        {children}
      </PopupWrapper>
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

// bottom 시트는 화면 폭을 꽉 채워야 하므로 width 100%(최대 390) 부여. center는 내용 폭 유지.
const PopupWrapper = styled.main<{ direction: "center" | "bottom" }>(({ direction }) =>
  direction === "bottom" ? { width: "100%", maxWidth: "390px" } : {},
);
