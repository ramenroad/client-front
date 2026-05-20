import { ImagePopup } from '@/shared/ui/image-popup'
import { LoadingLottie } from '@/shared/ui/lottie'
import { Modal } from '@/shared/ui/modal'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { useReviewImagesPage } from '../model/useReviewImagesPage'

const ReviewImagesPage = () => {
  const { title, images, selectedImageIndex, setSelectedImageIndex, closeImagePopup, isLoading, isError } =
    useReviewImagesPage()

  return (
    <Wrapper>
      <Header>
        <TopBar title={title} />
      </Header>
      {isLoading && (
        <StateWrapper>
          <LoadingLottie />
          <StateText size={16} weight="m">
            이미지를 불러오는 중이에요
          </StateText>
        </StateWrapper>
      )}
      {isError && (
        <StateWrapper>
          <StateText size={16} weight="m">
            이미지를 불러오지 못했어요.
          </StateText>
        </StateWrapper>
      )}
      {!isLoading && !isError && images.length === 0 && (
        <StateWrapper>
          <StateText size={16} weight="m">
            등록된 이미지가 없습니다.
          </StateText>
        </StateWrapper>
      )}
      {!isLoading && !isError && images.length > 0 && (
        <ImageContainer>
          {images.map((image, index) => (
            <ImageButton key={`${image}-${index}`} type="button" onClick={() => setSelectedImageIndex(index)}>
              <Image src={image} alt={`리뷰 이미지 ${index + 1}`} />
            </ImageButton>
          ))}
        </ImageContainer>
      )}

      <Modal isOpen={selectedImageIndex !== null} onClose={closeImagePopup}>
        {selectedImageIndex !== null && (
          <ImagePopup
            isOpen
            onClose={closeImagePopup}
            images={images}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
            title={title}
          />
        )}
      </Modal>
    </Wrapper>
  )
}

const Wrapper = render.div('flex flex-col pb-40')

const Header = render.div('flex w-full max-w-390 flex-col')

const ImageContainer = render.div('grid grid-cols-3 gap-1')

const ImageButton = render.button('aspect-square w-full cursor-pointer border-none bg-transparent p-0')

const Image = render.img('h-full w-full object-cover')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default ReviewImagesPage
