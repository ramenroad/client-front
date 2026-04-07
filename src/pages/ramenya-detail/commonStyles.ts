import render from "@/shared/ui/render";

// 공통 스타일 컴포넌트들
export const Wrapper = render.div("flex flex-col items-center justify-center pb-40 w-full");

export const Container = render.div("flex flex-col w-full max-w-390");

export const HeaderBox = render.div("flex flex-col");

export const ThumbnailContainer = render.div("w-full flex items-center justify-center");

export const EmptyThumbnail = render.img("w-190");

export const MarketThumbnail = render.img("w-full h-190 object-center object-cover");

export const Divider = render.div("w-full h-8 bg-divider");

// Modal 스타일 컴포넌트들
export const ModalContent = render.div(
  "flex flex-col gap-16 w-290 pt-32 items-center justify-center bg-white rounded-[12px]",
);

export const ModalTextBox = render.div("flex flex-col");

export const ModalTitle = render.div("font-16-sb text-gray-900 text-center");

export const ModalText = render.div("font-16-r text-gray-900 text-center");

export const ModalButtonBox = render.div("flex h-60 w-full");

export const ModalCancelButton = render.button("w-full font-16-r text-black cursor-pointer border-none bg-transparent");

export const ModalConfirmButton = render.button(
  "w-full font-16-r text-orange cursor-pointer border-none bg-transparent",
);
