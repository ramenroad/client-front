import TopBar from "@/shared/ui/top-bar";
import { Line } from "@/shared/ui/line";
import { IconCheckbox } from "@/shared/ui/icon";
import { type ComponentProps, useRef, useState } from "react";
import { useModal } from "@/shared/lib/useModal";
import { Modal } from "@/shared/ui/modal";
import { useAuthMutation } from "@/features/auth/model";
import { useToast } from "@/shared/ui/toast";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import render from "@/shared/ui/render";

const WithdrawPage = () => {
  const [isConfirmedPolicy, setIsConfirmedPolicy] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { removeAccount: withdraw } = useAuthMutation();

  const navigate = useNavigate();
  const { openToast } = useToast();

  const { isOpen: isWithdrawModalOpen, open: openWithdrawModal, close: closeWithdrawModal } = useModal();

  return (
    <>
      <TopBar title="회원탈퇴" />
      <PageContainer>
        <WithdrawInformationContainer>
          <WithdrawTitle>회원 탈퇴 전에 꼭 확인해주세요</WithdrawTitle>
          <Line />
          <WithdrawDescription>
            라이징 회원 탈퇴 시 회원 정보 및 서비스 이용 기록은 모두 삭제되며, 삭제된 데이터는 복구가 불가능합니다. 다만
            법령에 의하여 보관해야 하는 경우 또는 회원 가입 남용, 서비스 부정사용 등을 위한 운영사 내부정책에 의하여
            보관해야 하는 정보는 회원탈퇴 후에도 일정기간 보관됩니다.
          </WithdrawDescription>
        </WithdrawInformationContainer>

        <WithdrawActionContainer>
          <WithdrawInputContainer type="button" onClick={() => setIsConfirmedPolicy(!isConfirmedPolicy)}>
            <WithdrawCheckbox checked={isConfirmedPolicy} />
            <WithdrawCheckboxLabel>유의사항을 모두 확인했어요</WithdrawCheckboxLabel>
          </WithdrawInputContainer>

          <WithdrawButton
            disabled={!isConfirmedPolicy}
            onClick={() => {
              openWithdrawModal();
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            탈퇴하기
          </WithdrawButton>
        </WithdrawActionContainer>

        <Modal isOpen={isWithdrawModalOpen} onClose={closeWithdrawModal}>
          <ModalContent>
            <ModalConfirmWrapper>
              <ModalConfirmLine>정말 회원탈퇴하시겠습니까?</ModalConfirmLine>
              <ModalConfirmLine>동의하신다면 아래에</ModalConfirmLine>
              <ModalConfirmLine>
                <ModalConfirmText>“확인했습니다”</ModalConfirmText>를 정확히 입력해주세요
              </ModalConfirmLine>
            </ModalConfirmWrapper>

            <ModalInputWrapper>
              <ModalInput
                ref={inputRef}
                active={confirmText === "확인했습니다"}
                value={confirmText}
                placeholder="확인했습니다"
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </ModalInputWrapper>

            <ModalActionButtonContainer>
              <ModalActionButton variant="cancel" onClick={closeWithdrawModal}>
                취소
              </ModalActionButton>
              <ModalActionButton
                variant="confirm"
                disabled={confirmText !== "확인했습니다"}
                onClick={() =>
                  withdraw.mutate(undefined, {
                    onSuccess: () => {
                      closeWithdrawModal();
                      openToast("회원탈퇴 완료");
                      navigate("/");
                    },
                    onError: (error) => {
                      console.error(error);
                    },
                  })
                }
              >
                확인
              </ModalActionButton>
            </ModalActionButtonContainer>
          </ModalContent>
        </Modal>
      </PageContainer>
    </>
  );
};

const PageContainer = render.div("flex flex-col w-full h-full pt-10 px-20 pb-20 box-border text-black");

const WithdrawInformationContainer = render.div("flex flex-col gap-16 flex-1");

const WithdrawTitle = render.span("w-154 h-72 leading-36 text-[24px] font-regular");

const WithdrawDescription = render.span(
  "w-full flex-1 leading-24 text-[16px] font-regular text-gray-800 tracking-[-2%]",
);

const WithdrawActionContainer = render.div("flex flex-col gap-24");

const WithdrawInputContainer = render.button(
  "flex items-center gap-8 cursor-pointer border-none bg-transparent p-0 text-left shadow-none outline-none",
);

const WithdrawCheckbox = render.extend(IconCheckbox, "cursor-pointer");

const WithdrawCheckboxLabel = render.span("font-16-m text-gray-800");

const WithdrawButton = render.button(
  "w-full h-48 bg-gray-900 shadow-none font-16-sb text-white leading-24 tracking-[-2%] rounded-[8px] border-none py-12 cursor-pointer border-none outline-none shadow-none disabled:bg-gray-200 disabled:cursor-not-allowed",
);

const ModalContent = render.div("flex flex-col items-center gap-16 box-border font-16-r text-gray-900 w-290 pt-32");

const ModalConfirmWrapper = render.div("flex flex-col text-center");

const ModalConfirmLine = render.span("text-inherit");

const ModalConfirmText = render.span("font-semibold");

const ModalInputWrapper = render.div("box-border w-full px-31");

interface ModalInputProps extends ComponentProps<"input"> {
  active: boolean;
}

const ModalInputField = render.input();

const ModalInput = ({ active, className, ...props }: ModalInputProps) => {
  return (
    <ModalInputField
      {...props}
      className={twMerge(
        "h-56 w-full box-border rounded-[8px] bg-[#f4f4f5] px-16 font-16-r text-black shadow-none outline-none border-2",
        active ? "border-[#59bc12]" : "border-[#ff5454]",
        className ?? "",
      )}
    />
  );
};

const ModalActionButtonContainer = render.div("flex h-60 w-full");

interface ModalActionButtonProps extends ComponentProps<"button"> {
  variant: "cancel" | "confirm";
}

const ModalActionButtonBase = render.button();

const ModalActionButton = ({ variant, disabled, className, ...props }: ModalActionButtonProps) => {
  return (
    <ModalActionButtonBase
      {...props}
      disabled={disabled}
      className={twMerge(
        "w-full bg-transparent border-none shadow-none outline-none font-16-r",
        variant === "cancel" ? "cursor-pointer text-black" : "",
        variant === "confirm" && disabled ? "cursor-not-allowed text-[#cfcfcf]" : "",
        variant === "confirm" && !disabled ? "cursor-pointer font-semibold text-orange" : "",
        className ?? "",
      )}
    />
  );
};

export default WithdrawPage;
