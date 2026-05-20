import render from "@/shared/ui/render";
import type { PopupModalProps } from "./types";

export interface PopupIframeProps extends PopupModalProps {
  url: string;
}

export const PopupIframe = ({ url }: PopupIframeProps) => {
  return <Screen src={url} />;
};

const Screen = render.iframe("w-350 h-500");
