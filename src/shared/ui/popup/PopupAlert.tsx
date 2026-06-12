import type { ReactNode } from "react";
import render from "@/shared/ui/render";
import type { PopupModalProps } from "./types";

export interface PopupAlertProps extends PopupModalProps {
  content: string | ReactNode;
  closeText?: string;
}

const PopupAlert = ({ content, closeText, onClose }: PopupAlertProps) => {
  return (
    <PopupContainer>
      <PopupTitle>{content}</PopupTitle>
      <PopupButtonBox>
        <PopupCloseButton onClick={onClose}>{closeText || "닫기"}</PopupCloseButton>
      </PopupButtonBox>
    </PopupContainer>
  );
};

const PopupContainer = render.div(
  "flex flex-col gap-16 w-290 pt-32 items-center justify-center bg-white rounded-12",
);

const PopupTitle = render.div("font-16-r text-gray-900 text-center");

const PopupButtonBox = render.div("flex h-60 w-full");

const PopupCloseButton = render.button(
  "w-full font-16-r text-orange cursor-pointer border-none bg-transparent",
);

export default PopupAlert;
