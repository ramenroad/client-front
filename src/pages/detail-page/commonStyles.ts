import tw from "twin.macro";

// 공통 스타일 컴포넌트들
export const Wrapper = tw.div`
  flex flex-col items-center justify-center
  pb-40 w-full
`;

export const Container = tw.div`
  flex flex-col w-full
  max-w-390
`;

export const HeaderBox = tw.div`
  flex flex-col
`;

export const ThumbnailContainer = tw.div`
  w-full flex items-center justify-center
`;

export const EmptyThumbnail = tw.img`
  w-190
`;

export const MarketThumbnail = tw.img`
  w-full h-190
  object-center
  object-cover
`;

export const Divider = tw.div`
  w-full h-8 bg-divider
`;

// Modal 스타일 컴포넌트들
export const ModalContent = tw.div`
    flex flex-col gap-16 w-290 pt-32
    items-center
    justify-center
    bg-white
    rounded-12
`;

export const ModalTextBox = tw.div`
    flex flex-col
`;

export const ModalTitle = tw.div`
    font-16-sb text-gray-900
    text-center
`;

export const ModalText = tw.div`
    font-16-r text-gray-900
    text-center
`;

export const ModalButtonBox = tw.div`
    flex h-60 w-full
`;

export const ModalCancelButton = tw.button`
    w-full
    font-16-r text-black
    cursor-pointer
    border-none
    bg-transparent
`;

export const ModalConfirmButton = tw.button`
    w-full
    font-16-r text-orange
    cursor-pointer
    border-none
    bg-transparent
`;
