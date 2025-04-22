import TopBar from "../../components/common/TopBar.tsx";
import tw from "twin.macro";
import {
  IconStarLarge,
  IconAdd,
  IconClose,
} from "../../components/Icon/index.tsx";
import styled from "@emotion/styled";
import { createRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Review } from "../../types";
import { useRamenyaReviewMutation } from "../../hooks/queries/useRamenyaReviewQuery.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/common/Modal";
import { useRamenyaDetailQuery } from "../../hooks/queries/useRamenyaDetailQuery.ts";
import { css } from "@emotion/react";
import { useSignInStore } from "../../states/sign-in";
import { useModal } from "../../hooks/common/useModal";

export const CreateReviewPage = () => {
  const { id } = useParams();
  const { mutate: createReview, isPending: isSubmitting } =
    useRamenyaReviewMutation();
  const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
  const navigate = useNavigate();
  const { isOpen: isBackModalOpen, open: openBackModal, close: closeBackModal } = useModal();
  const { isOpen: isLoginModalOpen, open: openLoginModal, close: closeLoginModal } = useModal();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const { isSignIn } = useSignInStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<Review>({
    defaultValues: {
      ramenyaId: useParams().id,
      rating: 0,
      review: "",
      reviewImages: [],
      menus: "",
    },
    mode: "onChange",
  });

  const formValues = watch();

  const [customMenuInput, setCustomMenuInput] = useState("");
  const [menuList, setMenuList] = useState(
    ramenyaDetailQuery.data?.menus?.map((menu) => menu) || []
  );

  const fileInputRef = createRef<HTMLInputElement>();

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const hasChanges =
      isDirty ||
      (formValues.reviewImages?.length ?? 0) > 0 ||
      formValues.rating > 0 ||
      (Array.isArray(formValues.menus) ? formValues.menus.length > 0 : false) ||
      formValues.review.trim().length > 0;

    setIsFormDirty(hasChanges);
  }, [
    isDirty,
    formValues.reviewImages,
    formValues.rating,
    formValues.menus,
    formValues.review,
  ]);

  useEffect(() => {
    const urls =
      formValues.reviewImages?.map((image) => {
        if (image instanceof File) {
          return URL.createObjectURL(image);
        }
        return image;
      }) || [];
    setImageUrls(urls);
    return () => {
      urls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formValues.reviewImages]);

  const handleStarClick = (index: number) => {
    setValue("rating", index, { shouldValidate: true });
  };

  const handleMenuClick = (menu: string) => {
    const currentMenus = formValues.menus ? formValues.menus.split(",") : [];

    if (currentMenus.includes(menu)) {
      setValue(
        "menus",
        currentMenus.filter((item) => item !== menu).join(","),
        { shouldValidate: true }
      );
    } else {
      if (currentMenus.length < 2) {
        setValue("menus", [...currentMenus, menu].join(","), {
          shouldValidate: true,
        });
      }
    }
  };

  const handleAddCustomMenu = () => {
    if (customMenuInput.trim() !== "" && !menuList.includes(customMenuInput)) {
      setMenuList([...menuList, customMenuInput]);
      handleMenuClick(customMenuInput);
      setCustomMenuInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCustomMenu();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = formValues.reviewImages || [];

    if (currentImages.length + files.length > 5) {
      alert("이미지는 최대 5개까지 업로드 가능합니다.");
      return;
    }

    const newImages: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (currentImages.length + newImages.length >= 5) break;

      const file = files[i];
      if (file.type.startsWith("image/")) {
        newImages.push(file);
      }
    }

    setValue("reviewImages", [...currentImages, ...newImages], {
      shouldValidate: true,
    });

    // 파일 입력 필드 리셋
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = () => {
    if ((formValues.reviewImages?.length ?? 0) < 5) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(formValues.reviewImages || [])];
    newImages.splice(index, 1);
    setValue("reviewImages", newImages, { shouldValidate: true });
  };

  const onSubmit = async (values: Review) => {
    if (!isSignIn) {
      openLoginModal();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ramenyaId", values.ramenyaId);
      formData.append("rating", values.rating.toString());
      formData.append("review", values.review);
      formData.append("menus", values.menus);

      if (values.reviewImages) {
        values.reviewImages.forEach((file) => {
          formData.append(`reviewImages`, file);
        });
      }

      await createReview(formData, {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error) => {
          console.error("리뷰 업로드 중 에러 발생:", error);
          alert("리뷰 업로드에 실패했습니다.");
        },
      });
    } catch (error) {
      console.error("리뷰 업로드 중 에러 발생:", error);
      alert("리뷰 업로드에 실패했습니다.");
    }
  };

  const isFormValid =
    formValues.rating > 0 &&
    (formValues.menus
      ? formValues.menus.split(",").filter(Boolean).length > 0
      : false) &&
    formValues.review.trim().length >= 10;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    if (isFormDirty) {
      openBackModal();
    } else {
      navigate(-1);
    }
  };

  const handleConfirmBack = () => {
    closeBackModal();
    navigate(-1);
  };

  const handleCancelBack = () => {
    closeBackModal();
  };

  const handleLoginConfirm = () => {
    closeLoginModal();
    navigate("/login");
  };

  return (
    <Wrapper>
      <Header>
        <TopBar title="리뷰 작성하기" onBackClick={handleBackClick} />
      </Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContentsWrapper>
          <StarWrapper>
            <StarTitle>라멘은 만족하셨나요?</StarTitle>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <StarButton
                  key={starIndex}
                  onClick={() => handleStarClick(starIndex)}
                  type="button"
                >
                  <IconStarLarge
                    color={
                      starIndex <= formValues.rating ? "#FFCC00" : "#E1E1E1"
                    }
                  />
                </StarButton>
              ))}
            </StarContainer>
            {errors.rating && <ErrorMessage>별점을 선택해주세요</ErrorMessage>}
          </StarWrapper>
          <Divider />

          <MenuWrapper>
            <MenuTitleBox>
              <MenuTitle>어떤 메뉴를 드셨나요?</MenuTitle>
              <MenuSubTitle>최대 2개 선택 가능</MenuSubTitle>
            </MenuTitleBox>
            <MenuTabContainer>
              {menuList.map((menu, index) => (
                <MenuTab
                  key={index}
                  selected={formValues.menus.includes(menu)}
                  onClick={() => handleMenuClick(menu)}
                >
                  {menu}
                </MenuTab>
              ))}
            </MenuTabContainer>
            {errors.menus && <ErrorMessage>메뉴를 선택해주세요</ErrorMessage>}
          </MenuWrapper>

          <MenuAddWrapper>
            <MenuAddTitle>
              찾으시는 메뉴가 없나요? 직접 추가해주세요
            </MenuAddTitle>
            <MenuInputContainer>
              <MenuInput
                value={customMenuInput}
                onChange={(e) => setCustomMenuInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="메뉴명을 입력해주세요"
              />
              <MenuAddButton onClick={handleAddCustomMenu} type="button">
                추가
              </MenuAddButton>
            </MenuInputContainer>
          </MenuAddWrapper>

          <ReviewDescriptionWrapper>
            <ReviewDescriptionTitle>어떤 점이 좋았나요?</ReviewDescriptionTitle>
            <Controller
              name="review"
              control={control}
              rules={{ required: true, minLength: 10 }}
              render={({ field }) => (
                <ReviewTextAreaContainer>
                  <ReviewDescriptionTextarea
                    {...field}
                    placeholder="최소 10자 이상 입력해주세요"
                  />
                  <CharacterCount>
                    <TypedCount>{field.value.length}</TypedCount>/300
                  </CharacterCount>
                </ReviewTextAreaContainer>
              )}
            />
            {/* {errors.review && errors.review.type === 'required' &&
                            <ErrorMessage>리뷰 내용을 입력해주세요</ErrorMessage>}
                        {errors.review && errors.review.type === 'minLength' &&
                            <ErrorMessage>최소 10자 이상 입력해주세요</ErrorMessage>} */}
          </ReviewDescriptionWrapper>

          <ImageUploadWrapper>
            <ImageUploadHeader>
              <ImageUploadTitleBox>
                <ImageUploadTitle>사진 첨부</ImageUploadTitle>
                <ImageCountBox>
                  <ImageAdded>{formValues.reviewImages?.length}</ImageAdded>
                  <ImageAddedText>/</ImageAddedText>
                  <ImageMax>5</ImageMax>
                </ImageCountBox>
              </ImageUploadTitleBox>
              <ImageUploadSubTitle>
                라멘과 무관한 사진을 첨부한 리뷰는 무통보 삭제됩니다
              </ImageUploadSubTitle>
            </ImageUploadHeader>

            <ImageUploadContent>
              <ImageUploadContentImage>
                {formValues.reviewImages?.map((_, index) => (
                  <ImagePreviewContainer key={index}>
                    <ImagePreview
                      src={imageUrls[index]}
                      alt={`업로드 이미지 ${index + 1}`}
                    />
                    <ImageRemoveButton
                      onClick={() => handleRemoveImage(index)}
                      type="button"
                    >
                      <IconClose width={9} height={9} />
                    </ImageRemoveButton>
                  </ImagePreviewContainer>
                ))}
                {(formValues.reviewImages?.length ?? 0) < 5 && (
                  <ImageAddButton onClick={handleImageClick} type="button">
                    <IconAdd />
                  </ImageAddButton>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                />
              </ImageUploadContentImage>
            </ImageUploadContent>
          </ImageUploadWrapper>

          <AddReviewButton
            active={isFormValid}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "등록중..." : "등록하기"}
          </AddReviewButton>
        </ContentsWrapper>
      </form>

      <Modal isOpen={isBackModalOpen} onClose={handleCancelBack}>
        <ModalContent>
          <ModalTitle>리뷰 작성을 멈추고 뒤로 갈까요?</ModalTitle>
          <ModalButtonBox>
            <ModalCancelButton onClick={handleCancelBack}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton onClick={handleConfirmBack}>
              확인
            </ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>
              로그인이 필요해요
            </ModalTitle>
            <ModalText>
              로그인 하시겠습니까?
            </ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton onClick={closeLoginModal}>취소</ModalCancelButton>
            <ModalConfirmButton onClick={handleLoginConfirm}>확인</ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = tw.div`
    flex 
    flex-col 
    w-full
    pb-40
`;

const Header = tw.div`
`;

const ContentsWrapper = tw.div`
    flex 
    flex-col
    px-20
`;

const StarWrapper = tw.div`
    flex flex-col
    items-center
    pt-20
    pb-32
    gap-12
`;

const StarTitle = tw.div`
    font-16-m text-black
`;

const StarContainer = tw.div`
    flex gap-8 items-center
`;

const Divider = tw.div`
    w-full h-1 bg-divider
`;

const MenuWrapper = tw.div`
    flex flex-col mt-32 gap-12
`;

const MenuTitleBox = tw.div`
    flex items-center
    gap-4
`;

const MenuTitle = tw.div`
    font-16-m text-black
`;

const MenuSubTitle = tw.div`
    font-12-r text-gray-400
`;

const MenuTabContainer = tw.div`
    flex flex-wrap gap-8
`;

interface MenuTabProps {
  selected: boolean;
}

const MenuTab = styled.div<MenuTabProps>(({ selected }) => [
  tw`
    flex w-fit h-29 box-border
    items-center
    bg-white
    border-solid border-1 border-gray-400
    font-14-m text-gray-400
    py-4 px-12 rounded-50
    cursor-pointer
    `,
  selected &&
  tw`
        border-orange
        text-orange
    `,
]);

const MenuAddWrapper = tw.div`
    flex flex-col mt-20 gap-12
`;

const MenuAddTitle = tw.div`
    font-14-r text-black
`;

const MenuInputContainer = tw.div`
    flex items-center gap-4
    
`;

const MenuInput = tw.input`
    flex-1 h-44 rounded-8 
    bg-border box-border
    px-12 py-10
    font-16-r
    border-none
    outline-none
    focus-within:(border-orange border-solid border-1)
`;

const MenuAddButton = tw.button`
    w-67 h-43 rounded-8 text-black
    px-10 py-8 bg-white
    border-solid border-1 border-gray-100
`;

const ReviewDescriptionWrapper = tw.div`
    flex flex-col mt-32 gap-12
    relative
`;

const ReviewDescriptionTitle = tw.div`
    font-16-m text-black
`;

const ReviewTextAreaContainer = tw.div`
    flex flex-col gap-4 relative
    bg-border
    rounded-8
    px-12 pt-10
    pb-36
    border-none
    outline-none
    focus-within:(border-orange border-solid border-1)
`;

const ReviewDescriptionTextarea = styled.textarea(() => [
  tw`
    flex h-214 w-350
    bg-transparent
    border-none
    font-16-r
    resize-none
    outline-none
    `,
  css`
    &::-webkit-scrollbar {
      width: 4px;
    }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 3px;
  }
  `,
]);

// 글자 수 표시 스타일
const CharacterCount = tw.div`
    absolute bottom-14 right-12
    font-14-r text-gray-400
`;

const TypedCount = tw.span`
    font-14-r text-black
`;

const ImageUploadWrapper = tw.div`
    flex flex-col mt-32 gap-12
`;

const ImageUploadHeader = tw.div`
    flex flex-col gap-2
`;

const ImageUploadTitleBox = tw.div`
    flex items-center gap-8
`;

const ImageUploadTitle = tw.div`
    font-16-m text-black
`;

const ImageCountBox = tw.div`
    flex items-center
`;

const ImageAdded = tw.div`
    font-16-m text-black
`;

const ImageAddedText = tw.div`
    font-16-m text-black
`;

const ImageMax = tw.div`
    font-16-m text-black
`;

const ImageUploadSubTitle = tw.div`
    font-12-r text-gray-400
`;

const ImageUploadContent = tw.div`
    flex flex-col gap-12
`;

const ImageUploadContentImage = tw.div`
    flex flex-row flex-wrap gap-12
`;

const ImagePreviewContainer = tw.div`
    relative
    w-96 h-96
    rounded-8
    overflow-visible
    border-solid border-1 border-gray-200
`;

const ImagePreview = tw.img`
    w-full h-full
    object-cover
    rounded-8
`;

const ImageRemoveButton = tw.button`
    absolute top-[-8px] right-[-8px]
    w-24 h-24
    flex items-center justify-center
    bg-white
    rounded-full
    cursor-pointer
    shadow-md
    border-solid border-1 border-gray-200
    z-10
`;

const ImageAddButton = tw.button`
    flex items-center justify-center
    w-96 h-96 rounded-8 bg-border
    border-solid border-1 border-gray-200
    border-dashed
    cursor-pointer
`;

interface AddReviewButtonProps {
  active: boolean;
  disabled?: boolean;
}

const AddReviewButton = styled.button<AddReviewButtonProps>(
  ({ active, disabled }) => [
    tw`
    flex items-center justify-center
    mt-32
    w-full h-48 rounded-8 text-white
    px-10 py-10 bg-gray-200
    border-none box-border
    `,
    active && !disabled && tw`bg-orange cursor-pointer`,
    (!active || disabled) && tw`cursor-not-allowed`,
  ]
);

const StarButton = tw.button`
    bg-transparent border-none cursor-pointer p-0 m-0
`;

const ErrorMessage = tw.div`
    font-12-r text-red
    mt-4
`;

const ModalContent = tw.div`
    flex flex-col gap-16 w-290
    items-center
    justify-center
    bg-white
    rounded-12
`;

const ModalTextBox = tw.div`
    flex flex-col
`;

const ModalTitle = tw.div`
    font-16-sb text-gray-900
    text-center
`;

const ModalText = tw.div`
    font-16-r text-gray-900
    text-center
`;

const ModalButtonBox = tw.div`
    flex h-60 w-full
`;

const ModalCancelButton = tw.button`
    w-full
    font-16-r text-black
    cursor-pointer
    border-none
    bg-transparent
`;

const ModalConfirmButton = tw.button`
    w-full
    font-16-r text-orange
    cursor-pointer
    border-none
    bg-transparent
`;
