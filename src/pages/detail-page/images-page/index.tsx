import React from 'react'
import { useParams } from 'react-router-dom';
import TopBar from '../../../components/common/TopBar'
import tw from 'twin.macro'
import { useRamenyaReviewImagesQuery } from '../../../hooks/queries/useRamenyaReviewQuery';
import { useRamenyaDetailQuery } from '../../../hooks/queries/useRamenyaDetailQuery'
import { useEffect } from 'react';
import { useModal } from '../../../hooks/common/useModal'
import { Modal } from '../../../components/common/Modal'
import { ImagePopup } from '../../../components/common/ImagePopup'

export const ImagesPage = () => {
    const { id } = useParams();
    const ramenyaReviewImagesQuery = useRamenyaReviewImagesQuery(id!);
    const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
    const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
    const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleOpenImagePopup = (index: number) => {
        setSelectedImageIndex(index);
        openImagePopup();
    };

    return (
        <Wrapper>
            <Header>
                <TopBar title={ramenyaDetailQuery.data?.name ?? '이미지'} />
            </Header>
            <ImageContainer>
                {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.map((image: string, index: number) => (
                    <Image
                        key={index}
                        src={image}
                        onClick={() => handleOpenImagePopup(index)}
                        style={{ cursor: 'pointer' }}
                    />
                ))}
            </ImageContainer>

            <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
                {selectedImageIndex !== null && ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls && (
                    <ImagePopup
                        isOpen={isImagePopupOpen}
                        onClose={closeImagePopup}
                        images={ramenyaReviewImagesQuery.data.ramenyaReviewImagesUrls}
                        selectedIndex={selectedImageIndex}
                        onIndexChange={setSelectedImageIndex}
                        title={ramenyaDetailQuery.data?.name}
                    />
                )}
            </Modal>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col pb-40 gap-20
`

const Header = tw.div`
    flex flex-col
    w-full
    max-w-390
`

const ImageContainer = tw.div`
    grid grid-cols-3 gap-1
`

const Image = tw.img`
    w-full aspect-square object-cover
`