import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunityBoardMutation } from "@/features/community/model";
import {
  COMMUNITY_BOARD_CATEGORIES,
  MAX_COMMUNITY_IMAGE_COUNT,
  type CommunityBoardCategory,
} from "@/entities/community/model";
import { useSignInStore } from "@/entities/viewer/model";
import { useImageUpload, type UploadImageValue } from "@/shared/lib/useImageUpload";
import { BottomPopupLayout } from "@/shared/ui/popup/BottomPopupLayout";
import { Popup } from "@/shared/ui/popup/Popup";
import { UploadLoadingOverlay } from "@/shared/ui/image-upload";
import { useToast } from "@/shared/ui/toast";
import { IconBack, IconCamera, IconDropDown, IconImageDelete } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

const CommunityWritePage = () => {
  const navigate = useNavigate();
  const { isSignIn } = useSignInStore();
  const { openToast } = useToast();
  const { create } = useCommunityBoardMutation();
  const [category, setCategory] = useState<CommunityBoardCategory | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<UploadImageValue[]>([]);
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

  const { fileInputRef, isUploading, handleImageClick, handleImageUpload, handleRemoveImage } = useImageUpload({
    images,
    maxImages: MAX_COMMUNITY_IMAGE_COUNT,
    onImagesChange: setImages,
    onLimitExceeded: (maxImages) => openToast(`이미지는 최대 ${maxImages}장까지 올릴 수 있어요.`),
    onUploadError: () => openToast("이미지를 처리하지 못했어요. 다시 시도해주세요."),
  });

  const isSubmitDisabled = !category || title.trim().length === 0 || body.trim().length === 0 || create.isPending;

  const handleSubmit = () => {
    if (!isSignIn) {
      openToast("로그인 후 게시글을 작성할 수 있어요.");
      navigate("/login");
      return;
    }

    if (isSubmitDisabled || !category) {
      openToast("주제, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    create.mutate(
      {
        category,
        title: title.trim(),
        body: body.trim(),
        images: images.filter((image): image is File => image instanceof File),
      },
      {
        onSuccess: () => {
          openToast("게시글이 등록됐어요.");
          navigate("/community");
        },
        onError: () => {
          openToast("게시글 등록에 실패했어요.");
        },
      },
    );
  };

  return (
    <>
      {isUploading ? <UploadLoadingOverlay mobileFallbackText="이미지 처리중..." /> : null}
      <Page>
        <Header>
          <BackButton type="button" onClick={() => navigate(-1)} aria-label="이전 페이지로 이동">
            <IconBack />
          </BackButton>
          <HeaderTitle>게시글 작성</HeaderTitle>
          <SubmitButton type="button" disabled={isSubmitDisabled} onClick={handleSubmit}>
            등록
          </SubmitButton>
        </Header>

        <FormBody>
          <CategoryFieldButton type="button" onClick={() => setIsCategoryPopupOpen(true)}>
            <CategoryFieldText>{category ?? "게시글 주제 선택"}</CategoryFieldText>
            <IconDropDown />
          </CategoryFieldButton>
          <FieldDivider />

          <TitleInput
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목"
            maxLength={60}
          />
          <FieldDivider />

          <BodyTextarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="내용을 입력하세요"
            maxLength={1000}
          />
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
              <CommunityImagePreview
                key={`${index}-${image instanceof File ? image.name : image}`}
                image={image}
                index={index}
                onRemove={handleRemoveImage}
              />
            ))}
          </ImageScrollArea>
          <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </BottomTray>
      </Page>

      <Popup isOpen={isCategoryPopupOpen} onClose={() => setIsCategoryPopupOpen(false)} direction="bottom">
        <BottomPopupLayout>
          <PopupTitle>게시글 주제를 선택해주세요</PopupTitle>
          <CategoryOptionList>
            {COMMUNITY_BOARD_CATEGORIES.map((option) => (
              <CategoryOptionButton
                key={option}
                type="button"
                onClick={() => {
                  setCategory(option);
                  setIsCategoryPopupOpen(false);
                }}
              >
                {option}
              </CategoryOptionButton>
            ))}
          </CategoryOptionList>
        </BottomPopupLayout>
      </Popup>
    </>
  );
};

interface CommunityImagePreviewProps {
  image: UploadImageValue;
  index: number;
  onRemove: (index: number) => void;
}

const CommunityImagePreview = memo(({ image, index, onRemove }: CommunityImagePreviewProps) => {
  const imageUrl = useMemo(() => (image instanceof File ? URL.createObjectURL(image) : image), [image]);

  useEffect(() => {
    if (!(image instanceof File)) {
      return;
    }

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [image, imageUrl]);

  return (
    <PreviewFrame>
      <PreviewImage src={imageUrl} alt={`업로드 이미지 ${index + 1}`} />
      <RemoveImageButton type="button" onClick={() => onRemove(index)} aria-label={`업로드 이미지 ${index + 1} 삭제`}>
        <IconImageDelete />
      </RemoveImageButton>
    </PreviewFrame>
  );
});

const Page = render.section("min-h-[100dvh] w-full bg-white pb-138");

const Header = render.div("sticky top-0 z-10 flex items-center justify-between bg-white px-20 py-10");

const BackButton = render.button("flex h-24 w-24 items-center justify-center border-none bg-transparent p-0");

const HeaderTitle = render.div("font-16-sb text-black");

const SubmitButton = render.button(
  "rounded-[8px] border-none bg-bright-orange px-12 py-4 font-14-m text-orange disabled:bg-border disabled:text-gray-300",
);

const FormBody = render.div("px-20 pt-12");

const CategoryFieldButton = render.button(
  "flex w-full items-center justify-between border-none bg-transparent px-0 py-12 text-left",
);

const CategoryFieldText = render.div("font-16-r text-gray-800");

const FieldDivider = render.div("h-px w-full bg-gray-100");

const TitleInput = render.input(
  "w-full border-none px-0 py-16 font-20-m text-gray-800 outline-none placeholder:text-gray-800",
);

const BodyTextarea = render.textarea(
  "mt-14 min-h-[340px] w-full resize-none border-none px-0 font-16-r text-gray-800 outline-none placeholder:text-gray-200",
);

const BottomTray = render.div(
  "fixed bottom-0 left-1/2 z-20 flex w-390 -translate-x-1/2 flex-col gap-10 border-0 border-t border-solid border-border bg-white px-20 py-12",
);

const ImageCount = render.div("font-12-m text-gray-400");

const CurrentCount = render.span("text-black");

const ImageScrollArea = render.div("flex items-center gap-12 overflow-x-auto hide-scrollbar");

const AddImageButton = render.button(
  "flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-none bg-gray-100 p-0",
);

const HiddenFileInput = render.input("hidden");

const PreviewFrame = render.div("relative h-96 w-96 shrink-0 overflow-hidden rounded-[8px] bg-border");

const PreviewImage = render.img("h-full w-full object-cover");

const RemoveImageButton = render.button(
  "absolute right-[-6px] top-[-6px] flex h-24 w-24 items-center justify-center border-none bg-transparent p-0",
);

const PopupTitle = render.div("font-16-sb text-black");

const CategoryOptionList = render.div("mt-20 flex flex-col");

const CategoryOptionButton = render.button(
  "flex h-52 items-center border-0 border-b border-solid border-border bg-transparent px-0 text-left font-16-r text-gray-800 last:border-b-0",
);

export default CommunityWritePage;
