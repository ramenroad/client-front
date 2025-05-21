import React from 'react';
import tw from 'twin.macro';
import { IconClose, IconNavLeft, IconNavRight } from '../Icon';

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  title?: string;
}

export const ImagePopup: React.FC<ImagePopupProps> = ({
  isOpen,
  onClose,
  images,
  selectedIndex,
  onIndexChange,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <PopupContainer>
      <PopupHeader>
        <CloseButtonWrapper onClick={onClose}>
          <IconClose width={14} height={14} color="#FFFFFF" />
        </CloseButtonWrapper>
        {title ? (
          <Title>{title}</Title>
        ) : (
          <ImageCounter>
            {selectedIndex + 1}/{images.length}
          </ImageCounter>
        )}
      </PopupHeader>
      <PopupContent>
        {selectedIndex > 0 && (
          <NavButtonLeft onClick={() => onIndexChange(selectedIndex - 1)}>
            <IconNavLeft />
          </NavButtonLeft>
        )}
        <PopUpImage src={images[selectedIndex]} alt="popup" />
        {selectedIndex < images.length - 1 && (
          <NavButtonRight onClick={() => onIndexChange(selectedIndex + 1)}>
            <IconNavRight />
          </NavButtonRight>
        )}
      </PopupContent>
    </PopupContainer>
  );
};

const PopupContainer = tw.div`
  flex 
  flex-col 
  items-center 
  w-full h-screen 
  bg-black
`;

const PopupHeader = tw.div`
  relative 
  flex w-full min-h-44
  justify-center items-center
  mt-32 
`;

const CloseButtonWrapper = tw.div`
  absolute top-10 left-20
  flex items-center justify-center
  w-24 h-24
  cursor-pointer
`;

const PopupContent = tw.div` 
  flex flex-col 
  h-full w-390 relative
  gap-4 items-start justify-center
`;

const ImageCounter = tw.div`
  text-white font-16-sb
`;

const Title = tw.div`
  text-white font-16-sb
`;

const PopUpImage = tw.img`
  w-390 h-fit object-cover
`;

const NavButtonLeft = tw.button`
  absolute top-1/2 -translate-y-1/2  left-4 transform
  bg-transparent border-none cursor-pointer
`;

const NavButtonRight = tw.button`
  absolute top-1/2 -translate-y-1/2  right-4 transform 
  bg-transparent border-none cursor-pointer
`;
