import React from "react";
import { createPortal } from "react-dom";
import tw from "twin.macro";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <PopupWrapper onClick={(e) => e.stopPropagation()}>
        {children}
      </PopupWrapper>
    </Overlay>,
    document.body
  );
};

const Overlay = tw.div`
  fixed inset-0 z-100 bg-black/40 flex items-end justify-center
`;

const PopupWrapper = tw.div`
  w-full max-w-390 min-w-0
  rounded-t-24 bg-white shadow-lg
  pt-32 px-20 pb-16
  box-border
  flex flex-col
`;
