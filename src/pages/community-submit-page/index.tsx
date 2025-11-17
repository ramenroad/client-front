import { useParams } from "react-router-dom";
import TopBar from "../../components/top-bar";
import tw from "twin.macro";
import { useState } from "react";
import { IconArrowRight, IconCameraUpload, IconDropDown } from "../../components/Icon";
import { usePopup } from "../../hooks/common/usePopup";
import { PopupType } from "../../types";
import { useForm } from "react-hook-form";

export enum CommunityArticleType {
  ALL = "ALL",
  EVENT = "EVENT",
  QUESTION = "QUESTION",
  NEW_OPENING = "NEW_OPENING",
  DEFAULT = "DEFAULT",
}

const CommunityArticleTypeLabel = {
  [CommunityArticleType.ALL]: "전체",
  [CommunityArticleType.EVENT]: "이벤트",
  [CommunityArticleType.NEW_OPENING]: "신장개업",
  [CommunityArticleType.QUESTION]: "질문",
  [CommunityArticleType.DEFAULT]: "게시글 주제 선택",
} as const;

export type CommunityArticleTypeLabel = (typeof CommunityArticleTypeLabel)[keyof typeof CommunityArticleTypeLabel];

export interface CommunityForm {
  title: string;
  content: string;
  photos: string[];
}

const PHOTO_MAX_COUNT = 10;

export const CommunitySubmitPage = () => {
  const { type } = useParams();
  const { openPopup } = usePopup();

  const [communityArticleType, setCommunityArticleType] = useState<CommunityArticleType>(CommunityArticleType.DEFAULT);
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<CommunityForm>({
    defaultValues: {
      title: "",
      content: "",
      photos: [],
    },
  });

  return (
    <>
      <TopBar title="게시글 작성" />
      <Layout>
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
                  label: CommunityArticleTypeLabel[communityArticleType],
                  value: communityArticleType,
                },
                onSelect: (option) => setCommunityArticleType(option.value as CommunityArticleType),
              })
            }
          >
            <CommunityArticleTypeValue>{CommunityArticleTypeLabel[communityArticleType]}</CommunityArticleTypeValue>
            <IconDropDown />
          </SelectWrapper>
        </SelectContainer>
        <TitleContainer>
          <TitleInput placeholder="제목" />
          <Divider />
        </TitleContainer>
        <ContentContainer>
          <Textarea placeholder="내용을 입력하세요" />
        </ContentContainer>
        <PhotoUploadSection>
          {watch("photos")?.length === 0 && (
            <>
              <PhotoUploadCount>
                <PhotoUploadCountText>{watch("photos")?.length ?? 0}</PhotoUploadCountText>
                <span>/{PHOTO_MAX_COUNT}</span>
              </PhotoUploadCount>

              <PhotoContainer>
                {watch("photos").map((photo) => (
                  <PhotoItem key={photo}>
                    <PhotoItemImage src={photo} />
                  </PhotoItem>
                ))}
              </PhotoContainer>
            </>
          )}
        </PhotoUploadSection>
        <CameraButtonWrapper>
          <IconCameraUpload />
        </CameraButtonWrapper>
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
  pb-16
`;

const PhotoUploadCount = tw.div`
  flex items-center
  w-full box-border
  font-12-m text-gray-400
`;

const PhotoUploadCountText = tw.span`
  font-12-m text-black
`;

const PhotoContainer = tw.div`
  w-full px-20 box-border
  pb-16
`;

const PhotoItem = tw.div`
  w-full h-96 box-border
`;

const PhotoItemImage = tw.img`
  w-full h-full
  object-cover
`;

const CameraButtonWrapper = tw.div`
`;
