import tw from "twin.macro";
import type { ModalProps } from "@/shared/model/popup";

export interface PopupIframeProps extends ModalProps {
  url: string;
}

export const PopupIframe = ({ url }: PopupIframeProps) => {
  return <Screen src={url} />;
};

const Screen = tw.iframe`
  w-350 h-500
`;
