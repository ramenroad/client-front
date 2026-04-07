import { IconArrowRight } from "@/shared/ui/icon";
import { ReviewImage } from "@/entities/review/ui";
import emptyImage from "../../assets/images/empty-images.png";
import render from "@/shared/ui/render";

interface ReviewPhotoSectionProps {
  ramenyaReviewImagesUrls: string[] | undefined;
  onOpenImagePopup: (index: number, images: string[]) => void;
  onNavigateImagesPage: () => void;
}

export const ReviewPhotoSection = ({
  ramenyaReviewImagesUrls,
  onOpenImagePopup,
  onNavigateImagesPage,
}: ReviewPhotoSectionProps) => {
  return (
    <ImageWrapper>
      <ImageTitle>사진</ImageTitle>
      {ramenyaReviewImagesUrls?.length === 0 ? (
        <EmptyImageContainer>
          <EmptyImageImage src={emptyImage} />
          <EmptyImageTitle>등록된 사진이 없습니다.</EmptyImageTitle>
          <EmptyImageText>리뷰를 작성하고 사진을 등록해주세요!</EmptyImageText>
        </EmptyImageContainer>
      ) : (
        <ImageContainer>
          {ramenyaReviewImagesUrls?.slice(0, 5).map((image: string, index: number) => (
            <ImageBox key={index}>
              <ReviewImage
                src={image}
                onClick={() => onOpenImagePopup(index, ramenyaReviewImagesUrls?.slice(0, 5) || [])}
              />
            </ImageBox>
          ))}
          {ramenyaReviewImagesUrls?.length && ramenyaReviewImagesUrls?.length > 5 && (
            <MoreImageWrapper onClick={onNavigateImagesPage}>
              <ImageBox>
                <ReviewImage src={ramenyaReviewImagesUrls?.[5]} />
              </ImageBox>
              <MoreOverlay>
                <MoreText>더보기</MoreText>
                <IconArrowRight color="#FFFFFF" />
              </MoreOverlay>
            </MoreImageWrapper>
          )}
        </ImageContainer>
      )}
    </ImageWrapper>
  );
};

// 스타일 컴포넌트들
const ImageTitle = render.div("font-18-sb");

const ImageWrapper = render.div("flex flex-col gap-16 px-20 py-32");

const ImageContainer = render.div("flex flex-wrap gap-1 w-350 rounded-[8px] overflow-hidden");

const ImageBox = render.div("w-116 h-116");

const MoreImageWrapper = render.div("relative cursor-pointer w-116 h-116");

const MoreOverlay = render.div(
  "absolute top-0 left-0 w-116 h-116 bg-black/50 flex items-center justify-center rounded-br-8",
);

const MoreText = render.span("font-14-m text-white");

const EmptyImageContainer = render.div("flex flex-col items-center justify-center");

const EmptyImageImage = render.img("w-80 pb-8");

const EmptyImageTitle = render.div("font-16-r text-black pb-4");

const EmptyImageText = render.div("font-14-r text-gray-700");
