import MenuBoardImage1 from '@/assets/images/menu-board/menu-board-1.png'
import MenuBoardImage2 from '@/assets/images/menu-board/menu-board-2.png'
import { type ChangeEvent, type RefObject } from 'react'
import { IconMenuBoardRightImage, IconMenuBoardWrongImage } from '@/shared/ui/icon'
import { ImageUploadGrid } from '@/shared/ui/image-upload'
import { Line } from '@/shared/ui/line'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface MenuBoardPhotoUploadSectionProps {
  images: (File | string)[]
  maxImages: number
  fileInputRef: RefObject<HTMLInputElement | null>
  onImageAddClick: () => void
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
}

interface MenuBoardDescriptionSectionProps {
  description: string
  maxLength: number
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export const MenuBoardSubmitTopLabel = () => {
  return (
    <TopLabelWrapper>
      <Highlight size={14} weight="m">
        직접 촬영한{' '}
      </Highlight>
      <RaisingText size={14} weight="r">
        메뉴판/키오스크 사진을 등록해주세요
      </RaisingText>
    </TopLabelWrapper>
  )
}

export const MenuBoardPhotoUploadSection = ({
  images,
  maxImages,
  fileInputRef,
  onImageAddClick,
  onImageUpload,
  onRemoveImage,
}: MenuBoardPhotoUploadSectionProps) => {
  return (
    <PhotoSection>
      <PhotoHeader>
        <TitleRow>
          <Title size={16} weight="m">
            사진 첨부
          </Title>
          <RaisingText size={16} weight="r">
            {images.length}
          </RaisingText>
          <Count size={16} weight="r">
            /{maxImages}
          </Count>
        </TitleRow>
        <Caption size={12} weight="r">
          JPG, JPEG, PNG, Webp 형식만 업로드 할 수 있습니다.
        </Caption>
      </PhotoHeader>

      <ImageArea>
        <ImageUploadGrid
          images={images}
          maxImages={maxImages}
          fileInputRef={fileInputRef}
          onAddClick={onImageAddClick}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          addButtonAriaLabel="메뉴판 이미지 추가"
        />
      </ImageArea>

      <LineWrapper>
        <Line />
      </LineWrapper>
    </PhotoSection>
  )
}

export const MenuBoardDescriptionSection = ({
  description,
  maxLength,
  onDescriptionChange,
}: MenuBoardDescriptionSectionProps) => {
  return (
    <DescriptionSection>
      <TextAreaContainer>
        <DescriptionTextArea
          value={description}
          onChange={onDescriptionChange}
          placeholder={'(선택) 메뉴판에 대한 설명을 입력해 주세요.\n이미지와 함께 게재됩니다.'}
          maxLength={maxLength}
        />
        <CharacterCount>
          <TypedCount>{description.length}</TypedCount>/{maxLength}
        </CharacterCount>
      </TextAreaContainer>
    </DescriptionSection>
  )
}

export const MenuBoardGuideSection = () => {
  return (
    <GuideSection>
      <GuideCard>
        <GuideTitle>메뉴판 제보 가이드</GuideTitle>
        <GuideContent>
          <GuideHighlight>정면</GuideHighlight>에서 촬영한 사진을 등록해 주세요
          <GuideImageGrid>
            <GuideImageItem>
              <GuideImage src={MenuBoardImage1} alt="정면에서 촬영한 메뉴판 예시" />
              <RightGuideIcon>
                <IconMenuBoardRightImage />
              </RightGuideIcon>
            </GuideImageItem>
            <GuideImageItem>
              <GuideImage src={MenuBoardImage2} alt="잘못 촬영한 메뉴판 예시" />
              <WrongGuideIcon>
                <IconMenuBoardWrongImage />
              </WrongGuideIcon>
            </GuideImageItem>
          </GuideImageGrid>
        </GuideContent>
      </GuideCard>

      <GuideCaption>제보하신 정보는 검수 후 게재됩니다. 감사합니다.</GuideCaption>
    </GuideSection>
  )
}

const TopLabelWrapper = render.div('box-border flex h-44 w-full items-center gap-2 bg-light-orange px-20 py-12')

const Highlight = render.extend(RaisingText, 'text-orange')

const PhotoSection = render.div('box-border w-full p-20')

const PhotoHeader = render.div('flex flex-col justify-center')

const TitleRow = render.div('pr-8')

const Title = render.extend(RaisingText, 'pr-8')

const Count = render.extend(RaisingText, 'text-filter-text')

const Caption = render.extend(RaisingText, 'text-gray-500')

const ImageArea = render.div('mt-16')

const LineWrapper = render.div('pt-20')

const DescriptionSection = render.div('relative box-border flex flex-col gap-16 px-20')

const TextAreaContainer = render.div(
  'relative box-border flex flex-col gap-4 rounded-8 border border-solid border-transparent bg-border px-12 pb-36 pt-10 outline-none focus-within:border-orange',
)

const DescriptionTextArea = render.textarea(
  'font-14-r h-110 w-full resize-none border-none bg-transparent font-pretendard text-black outline-none thin-scrollbar',
)

const CharacterCount = render.div('absolute bottom-14 right-12 font-14-r text-gray-400')

const TypedCount = render.span('font-14-r text-black')

const GuideSection = render.div('box-border w-full px-20 pt-20')

const GuideCard = render.div('box-border flex h-190 w-full flex-col items-center rounded-8 bg-border pb-27 pt-20')

const GuideTitle = render.div('font-14-sb text-gray-800')

const GuideContent = render.div('font-14-m text-gray-800')

const GuideHighlight = render.span('font-14-m text-[#06B526]')

const GuideImageGrid = render.div('flex flex-row gap-20 pt-16')

const GuideImageItem = render.div('relative')

const GuideImage = render.img('h-86 w-86 rounded-4 object-cover')

const GuideCaption = render.div('pb-73 pt-14 font-14-m text-gray-500')

const RightGuideIcon = render.div(
  'absolute bottom-2 right-[-13px] flex h-23 w-23 items-center justify-center rounded-full bg-[#06b526]',
)

const WrongGuideIcon = render.div(
  'absolute bottom-2 right-[-13px] flex h-23 w-23 items-center justify-center rounded-full bg-[#ff5234]',
)
