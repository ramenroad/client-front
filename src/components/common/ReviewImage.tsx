import tw from 'twin.macro'
import { Modal } from './Modal';

interface ReviewImageProps {
    image: string;
    isImagePopupOpen?: boolean;
    closeImagePopup?: () => void;
    onClick?: () => void;
}

export const ReviewImage = ({ image, isImagePopupOpen = false, closeImagePopup = () => { }, onClick }: ReviewImageProps) => {
    return (
        <>
            <Image src={image} onClick={onClick} />
            {isImagePopupOpen && (
                <Modal
                    isOpen={isImagePopupOpen}
                    onClose={closeImagePopup}>
                    <PopUpImage src={image} />
                </Modal>
            )}
        </>
    )
}

const Image = tw.img`
    w-full h-full object-cover
`;

const PopUpImage = tw.img`
    w-full h-full object-cover
`;

