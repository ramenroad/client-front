import TopBar from "../../components/top-bar";
import tw from "twin.macro";
import { useCallback, createRef, useRef } from "react";
import { IconCameraUpload, IconDropDown } from "../../components/Icon";
import { usePopup } from "../../hooks/common/usePopup";
import { PopupType } from "../../types";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ImagePreviewItem } from "../../components/common/ImagePreviewItem";
import { Line } from "../../components/common/Line";
import { useArticleMutation, ArticleForm } from "../../hooks/mutation/community/useArticleMutation";
import { compressImage, convertHeicToJpeg } from "../../util/image";
import { useToast } from "../../components/toast/ToastProvider";

export enum CommunityArticleType {
  ALL = "all",
  EVENT = "event",
  QUESTION = "qna",
  NEW_OPENING = "newOpen",
  DEFAULT = "DEFAULT",
}

export const CommunityArticleTypeLabel = {
  [CommunityArticleType.ALL]: "전체",
  [CommunityArticleType.EVENT]: "이벤트",
  [CommunityArticleType.NEW_OPENING]: "신장개업",
  [CommunityArticleType.QUESTION]: "질문",
  [CommunityArticleType.DEFAULT]: "게시글 주제 선택",
} as const;

export type CommunityArticleTypeLabel = (typeof CommunityArticleTypeLabel)[keyof typeof CommunityArticleTypeLabel];

// CommunityForm 대신 ArticleForm 사용

const PHOTO_MAX_COUNT = 10;

export const CommunitySubmitPage = () => {
  const { openPopup } = usePopup();
  const { openToast } = useToast();
  const navigate = useNavigate();

  const { postArticleMutation } = useArticleMutation();

  const fileInputRef = createRef<HTMLInputElement>();
  const formRef = useRef<HTMLFormElement>(null);

  const { control, handleSubmit, watch, setValue } = useForm<ArticleForm>({
    defaultValues: {
      title: "",
      body: "",
      images: [],
      category: CommunityArticleType.DEFAULT,
    },
  });

  const formValues = watch();

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const currentImages = formValues.images || [];

      if (currentImages.length + files.length > PHOTO_MAX_COUNT) {
        // TODO: 토스트 메시지로 에러 표시
        console.error(`이미지는 최대 ${PHOTO_MAX_COUNT}개까지 업로드 가능합니다.`);
        return;
      }

      // 모바일 브라우저에서는 역순으로 업로드
      const fileArray = Array.from(files);
      const newImages: File[] = [];

      try {
        for (const file of fileArray) {
          if (currentImages.length + newImages.length >= PHOTO_MAX_COUNT) break;

          // HEIC 파일 변환
          let convertedFile = await convertHeicToJpeg(file);

          // 모바일 최적화를 위한 이미지 압축 (1MB 이상일 때만)
          if (convertedFile.size > 1024 * 1024) {
            convertedFile = await compressImage(convertedFile, 800, 0.8);
          }

          newImages.push(convertedFile);
        }

        setValue("images", [...currentImages, ...newImages], {
          shouldValidate: true,
        });
      } catch (error) {
        console.error("이미지 변환 중 오류:", error);
        // TODO: 토스트 메시지로 에러 표시
        console.error("이미지 변환에 실패했습니다. 다른 이미지를 선택해주세요.");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [fileInputRef, formValues.images, setValue],
  );

  const handleImageClick = () => {
    if ((formValues.images?.length ?? 0) < PHOTO_MAX_COUNT) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = useCallback(
    (index: number) => {
      // 현재 값을 안전하게 가져와서 업데이트
      const currentImages = formValues.images || [];

      // 유효성 검사
      if (index < 0 || index >= currentImages.length) {
        console.warn("잘못된 이미지 인덱스:", index);
        return;
      }

      // 새로운 이미지 배열 생성
      const newImages = [...currentImages];
      newImages.splice(index, 1);

      // react-hook-form에 업데이트
      setValue("images", newImages, { shouldValidate: true });
    },
    [formValues.images, setValue],
  );

  // 폼 제출 핸들러
  const onSubmit = async (values: ArticleForm) => {
    try {
      postArticleMutation.mutate(values, {
        onSuccess: () => {
          openToast("게시글 등록 성공");
          navigate(-1);
        },
        onError: () => {
          openToast("게시글 등록 실패");
        },
      });
    } catch (error) {
      console.error("게시글 등록 중 오류:", error);
    }
  };

  return (
    <>
      <TopBar
        title="게시글 작성"
        additionalButton={
          <SubmitButton
            type="button"
            disabled={(formValues.body?.length ?? 0) === 0 || formValues.category === CommunityArticleType.DEFAULT}
            onClick={() => formRef.current?.requestSubmit()}
          >
            등록
          </SubmitButton>
        }
      />
      <Layout>
        <Form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <SelectContainer>
            <SelectWrapper
              onClick={() =>
                openPopup(PopupType.COMMUNITY_ARTICLE_TYPE, {
                  title: "게시글 주제 선택",
                  optionList: Object.values(CommunityArticleType)
                    .map((type) => ({
                      label: CommunityArticleTypeLabel[type],
                      value: type,
                    }))
                    .filter((type) => type.value !== CommunityArticleType.DEFAULT),
                  currentOption: {
                    label: CommunityArticleTypeLabel[formValues.category],
                    value: formValues.category,
                  },
                  onSelect: (option: { label: string; value: string }) => {
                    setValue("category", option.value as CommunityArticleType, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  },
                })
              }
            >
              <CommunityArticleTypeValue>{CommunityArticleTypeLabel[formValues.category]}</CommunityArticleTypeValue>
              <IconDropDown />
            </SelectWrapper>
          </SelectContainer>
          <TitleContainer>
            <Controller
              name="title"
              control={control}
              rules={{ required: "제목을 입력해주세요" }}
              render={({ field }) => <TitleInput {...field} placeholder="제목" />}
            />
            <Divider />
          </TitleContainer>
          <ContentContainer>
            <Controller
              name="body"
              control={control}
              rules={{ required: "내용을 입력해주세요" }}
              render={({ field }) => <Textarea {...field} placeholder="내용을 입력하세요" />}
            />
          </ContentContainer>
          {formValues.images && formValues.images.length > 0 && <Line />}
          <PhotoUploadSection>
            {formValues.images && formValues.images.length > 0 && (
              <>
                <PhotoUploadCount>
                  <PhotoUploadCountText>{formValues.images.length}</PhotoUploadCountText>
                  <span>/{PHOTO_MAX_COUNT}</span>
                </PhotoUploadCount>

                <PhotoContainer>
                  {formValues.images.map((file, index) => (
                    <ImagePreviewItem
                      key={`${file.name}-${index}`}
                      file={file}
                      index={index}
                      onRemove={handleRemoveImage}
                    />
                  ))}
                </PhotoContainer>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              style={{ display: "none" }}
            />
          </PhotoUploadSection>
          <CameraButtonWrapper onClick={handleImageClick}>
            <IconCameraUpload />
          </CameraButtonWrapper>
        </Form>
      </Layout>
    </>
  );
};

const Layout = tw.main`
  flex flex-col items-center
  w-full
  flex-1
  box-border
	overflow-hidden
`;

const Form = tw.form`
  w-full box-border
  flex flex-col
  flex-1
`;

const SelectContainer = tw.div`
  w-full px-20 box-border
  pt-10 pb-16
  cursor-pointer
`;

const SelectWrapper = tw.div`
  flex items-center justify-between
  w-full box-border
  pb-12
  border-0 border-b border-solid border-select-underline
`;

const CommunityArticleTypeValue = tw.span`
  font-16-r text-black
`;

const TitleContainer = tw.div`
  w-full px-20 box-border
  pb-16
`;

const TitleInput = tw.input`
  text-black
  font-20-m
  w-full box-border
  h-30
  bg-transparent
  border-0
  focus:outline-none 
  mb-12
`;

const Divider = tw.div`
  w-full h-1 bg-select-underline
`;

const ContentContainer = tw.div`
  w-full px-20 box-border
  h-full
  pb-16
`;

const Textarea = tw.textarea`
  bg-transparent
  border-none
  text-black
  font-16-r
  w-full box-border
  focus:outline-none
  h-full
  font-16-r
  resize-none
`;

const PhotoUploadSection = tw.div`
  w-full px-20 box-border
`;

const PhotoUploadCount = tw.div`
  flex items-center
  w-full box-border
  font-12-m text-gray-400
  pt-8 pb-4
`;

const PhotoUploadCountText = tw.span`
  font-12-m text-black
`;

const PhotoContainer = tw.div`
  flex flex-row gap-12
  overflow-x-auto
  w-full box-border
  pb-12
`;

const CameraButtonWrapper = tw.div`
  w-full px-20 py-6 box-border
  h-48
  cursor-pointer
`;

const SubmitButton = tw.button`
  border-none w-48 h-30 text-orange bg-lightOrange rounded-8 font-14-m
  cursor-pointer
  px-12 py-4
  whitespace-nowrap
  disabled:(bg-gray-300 text-gray-500 cursor-not-allowed)
`;
