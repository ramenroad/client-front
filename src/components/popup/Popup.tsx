import styled from "@emotion/styled";
import React from "react";
import { createPortal } from "react-dom";
import tw from "twin.macro";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  direction?: "center" | "bottom";
}

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, direction = "center", children }) => {
  if (!isOpen) return null;

  return createPortal(
    <Overlay direction={direction} onClick={onClose}>
      <PopupWrapper onClick={(e) => e.stopPropagation()}>{children}</PopupWrapper>
    </Overlay>,
    document.body,
  );
};

const Overlay = styled.div<{ direction: "center" | "bottom" }>(({ direction }) => [
  tw`fixed inset-0 z-100 bg-black/40 flex`,
  direction === "bottom" ? tw`justify-center items-end` : tw`justify-center items-center`,
]);

const PopupWrapper = tw.main``;
