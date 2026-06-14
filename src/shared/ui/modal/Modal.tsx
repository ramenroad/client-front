import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import render from "@/shared/ui/render";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Overlay onClick={onClose}>
      <Wrapper onClick={(event) => event.stopPropagation()}>{children}</Wrapper>
    </Overlay>,
    document.body,
  );
};

const Overlay = render.div("fixed inset-0 bg-black/40 flex items-center justify-center z-[300]");

const Wrapper = render.div("flex flex-col bg-white rounded-12 shadow-lg");
