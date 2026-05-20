import { Modal } from '@/shared/ui/modal'
import { IconClose, IconKakao, IconMore } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface UserReviewsShareModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: (type: 'kakao' | 'url' | 'more') => void | Promise<void>
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
          <ShareOption type="button" onClick={() => void onShare('kakao')}>
            <KakaoBackground>
              <IconKakao />
            </KakaoBackground>
            <ShareOptionText size={12} weight="r">
              카카오톡
            </ShareOptionText>
          </ShareOption>
          <ShareOption type="button" onClick={() => void onShare('url')}>
            <URLCopyBackground>
              <URLShareOptionText size={12} weight="r">
                URL
              </URLShareOptionText>
            </URLCopyBackground>
            <ShareOptionText size={12} weight="r">
              링크 복사
            </ShareOptionText>
          </ShareOption>
          <ShareOption type="button" onClick={() => void onShare('more')}>
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
  )
}

const ModalContent = render.div('flex w-320 flex-col items-center justify-center gap-24 rounded-[12px] bg-white pb-20 pt-16')

const ModalHeader = render.div('relative flex w-full items-center justify-center')

const ModalCloseButton = render.extend(IconClose, 'absolute right-20 top-4 cursor-pointer')

const ModalShareContent = render.div('flex w-full items-center justify-center gap-30')

const ShareOption = render.button('flex cursor-pointer flex-col items-center gap-10 border-none bg-transparent')

const URLShareOptionText = render.extend(RaisingText, 'font-14-sb text-white')

const KakaoBackground = render.div('flex h-60 w-60 items-center justify-center rounded-full bg-[#FAE100]')

const URLCopyBackground = render.div('flex h-60 w-60 items-center justify-center rounded-full bg-[#B7BEC7]')

const MoreBackground = render.div('flex h-60 w-60 items-center justify-center rounded-full bg-[#D8DDE5]')

const ShareOptionText = render.extend(RaisingText, 'text-[14px] text-gray-70')
