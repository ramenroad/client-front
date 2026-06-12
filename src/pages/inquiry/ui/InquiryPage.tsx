import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { useInquiryPage } from '../model/useInquiryPage'

const DESCRIPTION =
  '라이징이 보다 나은 서비스가 될 수 있도록\n사용 의견과 개선 의견을 남겨주세요.\n보내주신 의견은 서비스 개선에 큰 도움이 됩니다.\n감사합니다.'

const InquiryPage = () => {
  const {
    title,
    body,
    isValid,
    isSubmitting,
    isBackConfirmOpen,
    isSubmitConfirmOpen,
    setTitle,
    setBody,
    handleBackClick,
    confirmBack,
    cancelBack,
    handleSubmitClick,
    confirmSubmit,
    cancelSubmit,
  } = useInquiryPage()

  return (
    <Layout variant="standalone">
      <TopBar title="의견 남기기" onBackClick={handleBackClick} />

      <Form>
        <Description>{DESCRIPTION}</Description>

        <TitleInput
          value={title}
          placeholder="제목을 입력해주세요"
          maxLength={50}
          onChange={(event) => setTitle(event.target.value)}
        />

        <BodyTextarea
          value={body}
          placeholder="내용을 입력해주세요"
          maxLength={1000}
          onChange={(event) => setBody(event.target.value)}
        />

        <Button disabled={!isValid || isSubmitting} onClick={handleSubmitClick}>
          등록하기
        </Button>
      </Form>

      <Modal isOpen={isBackConfirmOpen} onClose={cancelBack}>
        <Dialog>
          <DialogTextGroup>
            <DialogTitle>의견 작성을 멈추고 뒤로 갈까요?</DialogTitle>
            <DialogDescription>작성 중인 내용은 저장되지 않아요.</DialogDescription>
          </DialogTextGroup>
          <DialogButtonRow>
            <DialogCancelButton type="button" onClick={cancelBack}>
              취소
            </DialogCancelButton>
            <DialogConfirmButton type="button" onClick={confirmBack}>
              확인
            </DialogConfirmButton>
          </DialogButtonRow>
        </Dialog>
      </Modal>

      <Modal isOpen={isSubmitConfirmOpen} onClose={cancelSubmit}>
        <Dialog>
          <DialogTextGroup>
            <DialogTitle>의견을 보내시겠어요?</DialogTitle>
          </DialogTextGroup>
          <DialogButtonRow>
            <DialogCancelButton type="button" disabled={isSubmitting} onClick={cancelSubmit}>
              취소
            </DialogCancelButton>
            <DialogConfirmButton type="button" disabled={isSubmitting} onClick={confirmSubmit}>
              {isSubmitting ? '보내는 중' : '확인'}
            </DialogConfirmButton>
          </DialogButtonRow>
        </Dialog>
      </Modal>
    </Layout>
  )
}

const Layout = render.extend(PageLayout)

const Form = render.section('flex w-full flex-1 flex-col gap-12 px-20 pb-20 pt-10')

const Description = render.p('whitespace-pre-line font-14-r text-gray-700')

const TitleInput = render.input(
  'box-border h-56 w-full shrink-0 rounded-8 border-none bg-surface-muted px-16 font-16-r text-gray-900 shadow-none outline-none placeholder:text-gray-400',
)

const BodyTextarea = render.textarea(
  'box-border min-h-200 w-full flex-1 resize-none rounded-8 border-none bg-surface-muted p-16 font-16-r text-gray-900 shadow-none outline-none placeholder:text-gray-400',
)

const Dialog = render.div('box-border flex w-290 flex-col items-center gap-16 pt-32')

const DialogTextGroup = render.div('flex flex-col items-center gap-8 px-20 text-center')

const DialogTitle = render.span('font-16-m text-gray-900')

const DialogDescription = render.span('font-14-r text-gray-500')

const DialogButtonRow = render.div('flex h-60 w-full')

const DialogCancelButton = render.button(
  'w-full cursor-pointer border-none bg-transparent font-16-r text-black shadow-none outline-none disabled:cursor-not-allowed disabled:text-gray-200',
)

const DialogConfirmButton = render.button(
  'w-full cursor-pointer border-none bg-transparent font-16-m text-orange shadow-none outline-none disabled:cursor-not-allowed disabled:text-gray-200',
)

export default InquiryPage
