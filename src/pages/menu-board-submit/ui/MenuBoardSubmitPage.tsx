import { Button } from '@/shared/ui/button'
import { UploadLoadingOverlay } from '@/shared/ui/image-upload'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { useMenuBoardSubmitPage } from '../model/useMenuBoardSubmitPage'
import {
  MenuBoardDescriptionSection,
  MenuBoardGuideSection,
  MenuBoardPhotoUploadSection,
  MenuBoardSubmitTopLabel,
} from './MenuBoardSubmitSections'

const MenuBoardSubmitPage = () => {
  const {
    selectedImages,
    description,
    fileInputRef,
    isImageUploading,
    isSubmitting,
    isSubmitDisabled,
    maxImages,
    maxDescriptionLength,
    handleDescriptionChange,
    handleImageClick,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
  } = useMenuBoardSubmitPage()

  return (
    <PageWrapper variant="footerOnly">
      {isImageUploading && <UploadLoadingOverlay />}
      <TopBar title="메뉴판 제보하기" />

      <Form onSubmit={handleSubmit}>
        <MenuBoardSubmitTopLabel />

        <MenuBoardPhotoUploadSection
          images={selectedImages}
          maxImages={maxImages}
          fileInputRef={fileInputRef}
          onImageAddClick={handleImageClick}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />

        <MenuBoardDescriptionSection
          description={description}
          maxLength={maxDescriptionLength}
          onDescriptionChange={handleDescriptionChange}
        />

        <MenuBoardGuideSection />

        <ButtonWrapper>
          <Button type="submit" variant="primary" disabled={isSubmitDisabled}>
            {isSubmitting ? '등록중...' : '등록하기'}
          </Button>
        </ButtonWrapper>
      </Form>
    </PageWrapper>
  )
}

const PageWrapper = render.extend(PageLayout)

const Form = render.form('box-border flex w-full flex-col')

const ButtonWrapper = render.div('box-border w-full px-20 pb-20')

export default MenuBoardSubmitPage
