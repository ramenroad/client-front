import { ImagePopup } from '@/shared/ui/image-popup'
import { LoadingLottie } from '@/shared/ui/lottie'
import { Modal } from '@/shared/ui/modal'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { useMenuBoardImagesPage } from '../model/useMenuBoardImagesPage'
import { MenuBoardDetail } from './MenuBoardDetail'

const MenuBoardImagesPage = () => {
  const {
    title,
    images,
    menuBoards,
    selectedImageIndex,
    selectedMenuBoard,
    setSelectedImageIndex,
    isImagePopupOpen,
    closeImagePopup,
    isRemoveMenuBoardModalOpen,
    openRemoveMenuBoardModal,
    closeRemoveMenuBoardModal,
    isRemovePending,
    isMine,
    isLoading,
    isError,
    handleRemoveMenuBoard,
  } = useMenuBoardImagesPage()

  return (
    <Wrapper variant="standalone">
      <Header>
        <TopBar title="메뉴판" />
      </Header>
      {isLoading && (
        <StateWrapper>
          <LoadingLottie />
          <StateText size={16} weight="m">
            메뉴판을 불러오는 중이에요
          </StateText>
        </StateWrapper>
      )}
      {isError && (
        <StateWrapper>
          <StateText size={16} weight="m">
            메뉴판을 불러오지 못했어요.
          </StateText>
        </StateWrapper>
      )}
      {!isLoading && !isError && menuBoards.length === 0 && (
        <StateWrapper>
          <StateText size={16} weight="m">
            등록된 메뉴판이 없습니다.
          </StateText>
        </StateWrapper>
      )}
      {!isLoading && !isError && menuBoards.length > 0 && (
        <ImageContainer>
          {menuBoards.map((menu, index) => (
            <ImageButton key={menu._id} type="button" onClick={() => setSelectedImageIndex(index)}>
              <Image src={menu.imageUrl} alt={`메뉴판 이미지 ${index + 1}`} />
            </ImageButton>
          ))}
        </ImageContainer>
      )}

      <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
        {selectedImageIndex !== null && selectedMenuBoard && (
          <ImagePopup
            isOpen
            onClose={closeImagePopup}
            images={images}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
            title={title}
          >
            <MenuBoardDetail
              profileImage={selectedMenuBoard.userId.profileImageUrl}
              nickname={selectedMenuBoard.userId.nickname}
              createdAt={selectedMenuBoard.createdAt}
              description={selectedMenuBoard.description}
              isMine={isMine}
              onDelete={openRemoveMenuBoardModal}
            />
          </ImagePopup>
        )}
      </Modal>

      <Modal isOpen={isRemoveMenuBoardModalOpen} onClose={closeRemoveMenuBoardModal}>
        <DeleteModalContent>
          <ModalTextBox>
            <ModalTitle>메뉴판 삭제</ModalTitle>
            <ModalText>메뉴판을 삭제하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton type="button" onClick={closeRemoveMenuBoardModal} disabled={isRemovePending}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton type="button" onClick={handleRemoveMenuBoard} disabled={isRemovePending}>
              확인
            </ModalConfirmButton>
          </ModalButtonBox>
        </DeleteModalContent>
      </Modal>
    </Wrapper>
  )
}

const Wrapper = render.extend(PageLayout, 'pb-40')

const Header = render.div('flex w-full max-w-390 flex-col')

const ImageContainer = render.div('grid grid-cols-3 gap-1')

const ImageButton = render.button('aspect-square w-full cursor-pointer border-none bg-transparent p-0')

const Image = render.img('h-full w-full object-cover')

const StateWrapper = render.section('flex min-h-320 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

const DeleteModalContent = render.div('flex w-290 flex-col items-center justify-center gap-16 rounded-12 bg-white pt-32')

const ModalTextBox = render.div('flex flex-col')

const ModalTitle = render.div('text-center font-16-sb text-gray-900')

const ModalText = render.div('text-center font-16-r text-gray-900')

const ModalButtonBox = render.div('flex h-60 w-full')

const ModalCancelButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-black disabled:text-gray-200')

const ModalConfirmButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-orange disabled:text-gray-200')

export default MenuBoardImagesPage
