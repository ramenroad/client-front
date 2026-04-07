import { Modal } from "@/shared/ui/modal";
import { IconClose, IconKakao, IconMore } from "@/shared/ui/icon";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

interface UserReviewsShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (type: "kakao" | "url" | "more") => void | Promise<void>;
}

export const UserReviewsShareModal = ({ isOpen, onClose, onShare }: UserReviewsShareModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <RaisingText size={16} weight="sb">
            공유하기
          </RaisingText>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalShareContent>
          <ShareOption onClick={() => void onShare("kakao")}>
            <KakaoBackground>
              <IconKakao />
            </KakaoBackground>
            <ShareOptionText size={12} weight="r">
              카카오톡
            </ShareOptionText>
          </ShareOption>
          <ShareOption onClick={() => void onShare("url")}>
            <URLCopyBackground>
              <URLShareOptionText size={12} weight="r">
                URL
              </URLShareOptionText>
            </URLCopyBackground>
            <ShareOptionText size={12} weight="r">
              링크 복사
            </ShareOptionText>
          </ShareOption>
          <ShareOption onClick={() => void onShare("more")}>
            <MoreBackground>
              <IconMore color="#FFFFFF" />
            </MoreBackground>
            <ShareOptionText size={12} weight="r">
              더보기
            </ShareOptionText>
          </ShareOption>
        </ModalShareContent>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = render.div(
  "flex flex-col gap-24 w-320 pt-16 pb-20 items-center justify-center bg-white rounded-[12px]",
);

const ModalHeader = render.div("relative flex justify-center items-center w-full");

const ModalCloseButton = render.extend(IconClose, "absolute right-20 top-4 cursor-pointer");

const ModalShareContent = render.div("flex gap-30 w-full justify-center items-center");

const ShareOption = render.button("flex flex-col gap-10 items-center cursor-pointer border-none bg-transparent");

const URLShareOptionText = render.extend(RaisingText, "text-white font-14-sb");

const KakaoBackground = render.div("w-60 h-60 rounded-full bg-[#FAE100] flex justify-center items-center");

const URLCopyBackground = render.div("w-60 h-60 rounded-full bg-[#B7BEC7] flex justify-center items-center");

const MoreBackground = render.div("w-60 h-60 rounded-full bg-[#D8DDE5] flex justify-center items-center");

const ShareOptionText = render.extend(RaisingText, "text-[14px] text-gray-70");
