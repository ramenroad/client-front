import TopBar from "@/shared/ui/top-bar";
import { Line } from "@/shared/ui/line";
import { IconCheckbox } from "@/shared/ui/icon";
import { useRef, useState } from "react";
import { useModal } from "@/shared/lib/use-modal";
import { Modal } from "@/shared/ui/modal";
import styled from "@emotion/styled";
import { useAuthMutation } from "@/features/auth/model";
import { useToast } from "@/shared/ui/toast";
import { useNavigate } from "react-router-dom";
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
          <WithdrawInputContainer onClick={() => setIsConfirmedPolicy(!isConfirmedPolicy)}>
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
              정말 회원탈퇴하시겠습니까?
              <br />
              동의하신다면 아래에
              <br />
              <span>
                <ModalConfirmText>“확인했습니다”</ModalConfirmText>를 정확히 입력해주세요
              </span>
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

const WithdrawInputContainer = render.div("flex items-center gap-8 cursor-pointer");

const WithdrawCheckbox = render.extend(IconCheckbox, "cursor-pointer");

const WithdrawCheckboxLabel = render.span("font-16-m text-gray-800");

const WithdrawButton = render.button(
  "w-full h-48 bg-gray-900 shadow-none font-16-sb text-white leading-24 tracking-[-2%] rounded-[8px] border-none py-12 cursor-pointer border-none outline-none shadow-none disabled:bg-gray-200 disabled:cursor-not-allowed",
);

const ModalContent = render.div("flex flex-col items-center gap-16 box-border font-16-r text-gray-900 w-290 pt-32");

const ModalConfirmWrapper = render.div("flex flex-col text-center");

const ModalConfirmText = render.span("font-semibold");

const ModalInputWrapper = render.div("box-border w-full px-31");

const ModalInput = styled.input<{ active: boolean }>(({ active }) => ({
  boxSizing: "border-box",
  width: "100%",
  height: "56px",
  boxShadow: "none",
  outline: "none",
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 400,
  color: "#111111",
  paddingLeft: "16px",
  paddingRight: "16px",
  border: active ? "2px solid #59bc12" : "2px solid #ff5454",
}));

const ModalActionButtonContainer = render.div("flex h-60 w-full");

const ModalActionButton = styled.button<{ variant: "cancel" | "confirm"; disabled?: boolean }>(
  ({ variant, disabled }) => ({
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    boxShadow: "none",
    cursor: variant === "confirm" && disabled ? "not-allowed" : "pointer",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: variant === "confirm" ? 600 : 400,
    color: variant === "confirm" ? (disabled ? "#cfcfcf" : "#ff5e00") : "#111111",
  }),
);

export default WithdrawPage;
