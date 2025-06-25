import tw from "twin.macro";
import { ModalProps } from "../../../types";

export interface PopupIframeProps extends ModalProps {
  url: string;
}

export const PopupIframe = (props: PopupIframeProps) => {
  return <Screen src={props.url} />;
};

const Screen = tw.iframe`
  w-350 h-500
`;
