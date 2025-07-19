import tw from "twin.macro";
import { ModalProps } from "../../types";

export interface PopupConfirmProps extends ModalProps {
  content: string | React.ReactNode;
  confirmText?: string;
  onConfirm: () => void;
}

const PopupConfirm = (props: PopupConfirmProps) => {
  return (
    <PopupContainer>
      <PopupTitle>{props.content}</PopupTitle>
      <PopupButtonBox>
        <PopupCancelButton onClick={props.onClose}>취소</PopupCancelButton>
        <PopupConfirmButton onClick={props.onConfirm}>{props.confirmText || "확인"}</PopupConfirmButton>
      </PopupButtonBox>
    </PopupContainer>
  );
};

const PopupContainer = tw.div`
  flex flex-col gap-16 w-290 pt-32
  items-center
  justify-center
  bg-white
  rounded-12
`;

const PopupTitle = tw.div`
  font-16-r text-gray-900
  text-center
`;

const PopupButtonBox = tw.div`
  flex h-60 w-full
`;

const PopupCancelButton = tw.button`
  w-full
  font-16-r text-black
  cursor-pointer
  border-none
  bg-transparent
`;

const PopupConfirmButton = tw.button`
  w-full
  font-16-r text-orange
  cursor-pointer
  border-none
  bg-transparent
`;

export default PopupConfirm;
