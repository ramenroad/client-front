import { memo, useEffect, useMemo } from 'react'
import { MAX_COMMUNITY_IMAGE_COUNT } from '@/entities/community/model'
import { IconBack, IconCamera, IconDropDown, IconImageDelete } from '@/shared/ui/icon'
import { UploadLoadingOverlay } from '@/shared/ui/image-upload'
import { BottomPopupLayout, Popup } from '@/shared/ui/popup'
import render from '@/shared/ui/render'
import { useCommunityWritePage } from '../model/useCommunityWritePage'

const CommunityWritePage = () => {
  const {
    category,
    categoryOptions,
    title,
    body,
    images,
    fileInputRef,
    isUploading,
    isSubmitDisabled,
    isSubmitting,
    isCategoryPopupOpen,
    setCategory,
    setIsCategoryPopupOpen,
    handleTitleChange,
    handleBodyChange,
    handleImageClick,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleBack,
  } = useCommunityWritePage()

  return (
    <>
      {isUploading ? <UploadLoadingOverlay mobileFallbackText="이미지 처리중..." /> : null}
      <Page>
        <Header>
          <BackButton type="button" onClick={handleBack} aria-label="이전 페이지로 이동">
            <IconBack />
          </BackButton>
          <HeaderTitle>게시글 작성</HeaderTitle>
          <SubmitButton type="button" disabled={isSubmitDisabled} onClick={handleSubmit}>
            {isSubmitting ? '등록 중' : '등록'}
          </SubmitButton>
        </Header>

        <FormBody>
          <CategoryFieldButton type="button" onClick={() => setIsCategoryPopupOpen(true)}>
            <CategoryFieldText>{category ?? '게시글 주제 선택'}</CategoryFieldText>
            <IconDropDown />
          </CategoryFieldButton>
          <FieldDivider />

          <TitleInput value={title} onChange={handleTitleChange} placeholder="제목" maxLength={60} />
          <FieldDivider />

          <BodyTextarea value={body} onChange={handleBodyChange} placeholder="내용을 입력하세요" maxLength={1000} />
        </FormBody>

        <BottomTray>
          {images.length > 0 ? (
            <ImageCount>
              <CurrentCount>{images.length}</CurrentCount>/{MAX_COMMUNITY_IMAGE_COUNT}
            </ImageCount>
          ) : null}
          <ImageScrollArea>
            <AddImageButton type="button" onClick={handleImageClick} aria-label="게시글 이미지 추가">
              <IconCamera color="#A0A0A0" />
            </AddImageButton>

            {images.map((image, index) => (
              <CommunityImagePreview key={getPreviewKey(image, index)} image={image} index={index} onRemove={handleRemoveImage} />
            ))}
          </ImageScrollArea>
          <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </BottomTray>
      </Page>

      <Popup isOpen={isCategoryPopupOpen} onClose={() => setIsCategoryPopupOpen(false)} direction="bottom">
        <BottomPopupLayout>
          <PopupTitle>게시글 주제를 선택해주세요</PopupTitle>
          <CategoryOptionList>
            {categoryOptions.map((option) => (
              <CategoryOptionButton
                key={option}
                type="button"
                onClick={() => {
                  setCategory(option)
                  setIsCategoryPopupOpen(false)
                }}
              >
                {option}
              </CategoryOptionButton>
            ))}
          </CategoryOptionList>
        </BottomPopupLayout>
      </Popup>
    </>
  )
}

type UploadImageValue = File | string

interface CommunityImagePreviewProps {
  image: UploadImageValue
  index: number
  onRemove: (index: number) => void
}

const getPreviewKey = (image: UploadImageValue, index: number) => {
  if (image instanceof File) {
    return `${index}-${image.name}-${image.size}-${image.lastModified}`
  }

  return `${index}-${image}`
}

const CommunityImagePreview = memo(({ image, index, onRemove }: CommunityImagePreviewProps) => {
  const imageUrl = useMemo(() => (image instanceof File ? URL.createObjectURL(image) : image), [image])

  useEffect(() => {
    if (!(image instanceof File)) {
      return
    }

    return () => {
      URL.revokeObjectURL(imageUrl)
    }
  }, [image, imageUrl])

  return (
    <PreviewFrame>
      <PreviewImage src={imageUrl} alt={`업로드 이미지 ${index + 1}`} />
      <RemoveImageButton type="button" onClick={() => onRemove(index)} aria-label={`업로드 이미지 ${index + 1} 삭제`}>
        <IconImageDelete />
      </RemoveImageButton>
    </PreviewFrame>
  )
})

const Page = render.section('min-h-[100dvh] w-full bg-white pb-138')

const Header = render.div('sticky top-0 z-10 flex items-center justify-between bg-white px-20 py-10')

const BackButton = render.button('flex h-24 w-24 cursor-pointer items-center justify-center border-none bg-transparent p-0')

const HeaderTitle = render.h1('m-0 font-16-sb text-black')

const SubmitButton = render.button(
  'rounded-8 border-none bg-bright-orange px-12 py-4 font-14-m text-orange disabled:bg-border disabled:text-gray-200',
)

const FormBody = render.div('px-20 pt-12')

const CategoryFieldButton = render.button('flex w-full items-center justify-between border-none bg-transparent px-0 py-12 text-left')

const CategoryFieldText = render.div('font-16-r text-gray-800')

const FieldDivider = render.div('h-px w-full bg-gray-100')

const TitleInput = render.input('w-full border-none px-0 py-16 font-20-m text-gray-800 outline-none placeholder:text-gray-800')

const BodyTextarea = render.textarea(
  'mt-14 min-h-[340px] w-full resize-none border-none px-0 font-16-r text-gray-800 outline-none placeholder:text-gray-200',
)

const BottomTray = render.div(
  'fixed bottom-0 left-1/2 z-20 flex w-390 -translate-x-1/2 flex-col gap-10 border-0 border-t border-solid border-border bg-white px-20 py-12',
)

const ImageCount = render.div('font-12-m text-gray-400')

const CurrentCount = render.span('text-black')

const ImageScrollArea = render.div('flex items-center gap-12 overflow-x-auto hide-scrollbar')

const AddImageButton = render.button('flex h-36 w-36 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 p-0')

const HiddenFileInput = render.input('hidden')

const PreviewFrame = render.div('relative h-96 w-96 shrink-0 overflow-hidden rounded-8 bg-border')

const PreviewImage = render.img('h-full w-full object-cover')

const RemoveImageButton = render.button('absolute right-[-6px] top-[-6px] flex h-24 w-24 cursor-pointer items-center justify-center border-none bg-transparent p-0')

const PopupTitle = render.div('font-16-sb text-black')

const CategoryOptionList = render.div('mt-20 flex flex-col')

const CategoryOptionButton = render.button(
  'flex h-52 cursor-pointer items-center border-0 border-b border-solid border-border bg-transparent px-0 text-left font-16-r text-gray-800 last:border-b-0',
)

export default CommunityWritePage
