import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconCheckbox } from '@/shared/ui/icon'
import { Line } from '@/shared/ui/line'
import { Modal } from '@/shared/ui/modal'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { useWithdrawPage } from '../model/useWithdrawPage'

const WithdrawPage = () => {
  const {
    confirmText,
    confirmTextToMatch,
    inputRef,
    isConfirmedPolicy,
    isWithdrawModalOpen,
    isWithdrawPending,
    isConfirmTextMatched,
    handleConfirmTextChange,
    closeWithdrawModal,
    handleConfirmPolicyClick,
    handleWithdrawClick,
    handleSubmitWithdraw,
  } = useWithdrawPage()

  return (
    <Layout variant="standalone">
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
          <WithdrawInputContainer type="button" onClick={handleConfirmPolicyClick}>
            <WithdrawCheckbox checked={isConfirmedPolicy} />
            <WithdrawCheckboxLabel>유의사항을 모두 확인했어요</WithdrawCheckboxLabel>
          </WithdrawInputContainer>

          <WithdrawButton disabled={!isConfirmedPolicy} onClick={handleWithdrawClick}>
            탈퇴하기
          </WithdrawButton>
        </WithdrawActionContainer>
      </PageContainer>

      <Modal isOpen={isWithdrawModalOpen} onClose={closeWithdrawModal}>
        <ModalContent>
          <ModalConfirmWrapper>
            <ModalConfirmLine>정말 회원탈퇴하시겠습니까?</ModalConfirmLine>
            <ModalConfirmLine>동의하신다면 아래에</ModalConfirmLine>
            <ModalConfirmLine>
              <ModalConfirmText>“{confirmTextToMatch}”</ModalConfirmText>를 정확히 입력해주세요
            </ModalConfirmLine>
          </ModalConfirmWrapper>

          <ModalInputWrapper>
            <ModalInput
              ref={inputRef}
              active={isConfirmTextMatched}
              value={confirmText}
              placeholder={confirmTextToMatch}
              onChange={handleConfirmTextChange}
            />
          </ModalInputWrapper>

          <ModalActionButtonContainer>
            <ModalActionButton variant="cancel" onClick={closeWithdrawModal} disabled={isWithdrawPending}>
              취소
            </ModalActionButton>
            <ModalActionButton
              variant="confirm"
              disabled={!isConfirmTextMatched || isWithdrawPending}
              onClick={handleSubmitWithdraw}
            >
              {isWithdrawPending ? '처리 중' : '확인'}
            </ModalActionButton>
          </ModalActionButtonContainer>
        </ModalContent>
      </Modal>
    </Layout>
  )
}

const Layout = render.extend(PageLayout)

const PageContainer = render.div('box-border flex min-h-0 w-full flex-1 flex-col px-20 pb-20 pt-10 text-black')

const WithdrawInformationContainer = render.div('flex flex-1 flex-col gap-16')

const WithdrawTitle = render.span('h-72 w-154 text-[24px] font-regular leading-36')

const WithdrawDescription = render.span('w-full flex-1 text-[16px] font-regular leading-24 tracking-[-2%] text-gray-800')

const WithdrawActionContainer = render.div('flex flex-col gap-24')

const WithdrawInputContainer = render.button(
  'flex cursor-pointer items-center gap-8 border-none bg-transparent p-0 text-left shadow-none outline-none',
)

const WithdrawCheckbox = render.extend(IconCheckbox, 'cursor-pointer')

const WithdrawCheckboxLabel = render.span('font-16-m text-gray-800')

const WithdrawButton = render.button(
  'font-16-sb h-48 w-full cursor-pointer rounded-8 border-none bg-gray-900 py-12 leading-24 tracking-[-2%] text-white shadow-none outline-none disabled:cursor-not-allowed disabled:bg-gray-200',
)

const ModalContent = render.div('font-16-r box-border flex w-290 flex-col items-center gap-16 pt-32 text-gray-900')

const ModalConfirmWrapper = render.div('flex flex-col text-center')

const ModalConfirmLine = render.span('text-inherit')

const ModalConfirmText = render.span('font-semibold')

const ModalInputWrapper = render.div('box-border w-full px-31')

interface ModalInputProps extends ComponentProps<'input'> {
  active: boolean
}

const ModalInputField = render.input()

const ModalInput = ({ active, className, ...props }: ModalInputProps) => {
  return (
    <ModalInputField
      {...props}
      className={twMerge(
        'font-16-r box-border h-56 w-full rounded-8 border-2 bg-border px-16 text-black shadow-none outline-none',
        active ? 'border-green' : 'border-red',
        className ?? '',
      )}
    />
  )
}

const ModalActionButtonContainer = render.div('flex h-60 w-full')

interface ModalActionButtonProps extends ComponentProps<'button'> {
  variant: 'cancel' | 'confirm'
}

const ModalActionButtonBase = render.button()

const ModalActionButton = ({ variant, disabled, className, ...props }: ModalActionButtonProps) => {
  return (
    <ModalActionButtonBase
      {...props}
      disabled={disabled}
      className={twMerge(
        'font-16-r w-full border-none bg-transparent shadow-none outline-none',
        variant === 'cancel' ? 'cursor-pointer text-black disabled:cursor-not-allowed disabled:text-gray-200' : '',
        variant === 'confirm' && disabled ? 'cursor-not-allowed text-gray-200' : '',
        variant === 'confirm' && !disabled ? 'cursor-pointer font-semibold text-orange' : '',
        className ?? '',
      )}
    />
  )
}

export default WithdrawPage
