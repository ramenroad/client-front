import React from "react";
import type { ModalProps } from "@/shared/model/popup";
import render from "@/shared/ui/render";

export interface PopupConfirmProps extends ModalProps {
  content: string | React.ReactNode;
  confirmText?: string;
  onConfirm: () => void;
}

const PopupConfirm = ({ content, confirmText, onClose, onConfirm }: PopupConfirmProps) => {
  return (
    <PopupContainer>
      <PopupTitle>{content}</PopupTitle>
      <PopupButtonBox>
        <PopupCancelButton onClick={onClose}>취소</PopupCancelButton>
        <PopupConfirmButton onClick={onConfirm}>{confirmText || "확인"}</PopupConfirmButton>
      </PopupButtonBox>
    </PopupContainer>
  );
};

const PopupContainer = render.div(
  "flex flex-col gap-16 w-290 pt-32 items-center justify-center bg-white rounded-[12px]",
);

const PopupTitle = render.div("font-16-r text-gray-900 text-center");

const PopupButtonBox = render.div("flex h-60 w-full");

const PopupCancelButton = render.button("w-full font-16-r text-black cursor-pointer border-none bg-transparent");

const PopupConfirmButton = render.button("w-full font-16-r text-orange cursor-pointer border-none bg-transparent");

export default PopupConfirm;
