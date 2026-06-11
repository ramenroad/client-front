import { Button } from '@/shared/ui/button'
import { UploadLoadingOverlay } from '@/shared/ui/image-upload'
import { Modal } from '@/shared/ui/modal'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { MAX_REVIEW_IMAGES, MAX_REVIEW_LENGTH, MIN_REVIEW_LENGTH, useReviewForm, type ReviewFormMode } from '../model'
import { ReviewFormGuide } from './ReviewFormGuide'
import { ReviewImageSection } from './ReviewImageSection'
import { ReviewMenuSection } from './ReviewMenuSection'
import { ReviewRatingSection } from './ReviewRatingSection'
import { ReviewTextSection } from './ReviewTextSection'

interface ReviewFormFeatureProps {
  mode: ReviewFormMode
}

export const ReviewFormFeature = ({ mode }: ReviewFormFeatureProps) => {
  const {
    currentReviewImages,
    customMenuInput,
    errors,
    fileInputRef,
    handleAddCustomMenu,
    handleBackClick,
    handleCancelBack,
    handleConfirmBack,
    handleCustomMenuInputChange,
    handleCustomMenuKeyDown,
    handleImageClick,
    handleImageUpload,
    handleLoginConfirm,
    handleMenuClick,
    handleRemoveImage,
    handleReviewChange,
    handleStarClick,
    handleSubmitReview,
    isBackModalOpen,
    isImageUploading,
    isLoading,
    isLoginModalOpen,
    isSubmitting,
    loginModalClose,
    menuList,
    pageCopy,
    review,
    selectedMenus,
    watchedRating,
  } = useReviewForm({ mode })

  return (
    <Wrapper variant="standalone">
      {(isSubmitting || isImageUploading) && <UploadLoadingOverlay />}
      <Header>
        <TopBar title={pageCopy.title} onBackClick={handleBackClick} />
      </Header>
      <ReviewFormGuide />
      {isLoading ? (
        <LoadingWrapper>
          <LoadingText>로딩중...</LoadingText>
        </LoadingWrapper>
      ) : (
        <Form onSubmit={handleSubmitReview}>
          <ContentsWrapper>
            <ReviewRatingSection rating={watchedRating} hasError={errors.rating} onStarClick={handleStarClick} />

            <ReviewMenuSection
              menuList={menuList}
              selectedMenus={selectedMenus}
              customMenuInput={customMenuInput}
              hasError={errors.menus}
              onMenuClick={handleMenuClick}
              onCustomMenuInputChange={handleCustomMenuInputChange}
              onCustomMenuAdd={handleAddCustomMenu}
              onCustomMenuKeyDown={handleCustomMenuKeyDown}
            />

            <ReviewTextSection
              review={review}
              minLength={MIN_REVIEW_LENGTH}
              maxLength={MAX_REVIEW_LENGTH}
              hasError={errors.review}
              onReviewChange={handleReviewChange}
            />

            <ReviewImageSection
              images={currentReviewImages}
              maxImages={MAX_REVIEW_IMAGES}
              fileInputRef={fileInputRef}
              onImageAddClick={handleImageClick}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
            />

            <SubmitButton type="submit" variant="primary" disabled={isSubmitting} className="mt-32 font-16-m">
              {isSubmitting ? pageCopy.submitting : pageCopy.submit}
            </SubmitButton>
          </ContentsWrapper>
        </Form>
      )}

      <Modal isOpen={isBackModalOpen} onClose={handleCancelBack}>
        <ModalContent>
          <ModalText>{pageCopy.backConfirmText}</ModalText>
          <ModalButtonBox>
            <ModalCancelButton type="button" onClick={handleCancelBack}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton type="button" onClick={handleConfirmBack}>
              확인
            </ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={loginModalClose}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>로그인이 필요해요</ModalTitle>
            <ModalText>로그인 하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton type="button" onClick={loginModalClose}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton type="button" onClick={handleLoginConfirm}>
              확인
            </ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>
    </Wrapper>
  )
}

const Wrapper = render.extend(PageLayout, 'pb-40')

const Header = render.div('')

const Form = render.form('')

const ContentsWrapper = render.div('flex flex-col px-20')

const SubmitButton = render.extend(Button, '')

const LoadingWrapper = render.div('flex min-h-200 w-full items-center justify-center')

const LoadingText = render.div('font-16-m text-gray-400')

const ModalContent = render.div('flex w-290 flex-col items-center justify-center gap-16 rounded-12 bg-white pt-32')

const ModalTextBox = render.div('flex flex-col')

const ModalTitle = render.div('text-center font-16-sb text-gray-900')

const ModalText = render.div('text-center font-16-r text-gray-900')

const ModalButtonBox = render.div('flex h-60 w-full')

const ModalCancelButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-black')

const ModalConfirmButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-orange')
