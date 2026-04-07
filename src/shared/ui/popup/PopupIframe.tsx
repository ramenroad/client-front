import type { ModalProps } from "@/shared/model/popup";
import render from "@/shared/ui/render";

export interface PopupIframeProps extends ModalProps {
  url: string;
}

export const PopupIframe = ({ url }: PopupIframeProps) => {
  return <Screen src={url} />;
};

const Screen = render.iframe("w-350 h-500");
