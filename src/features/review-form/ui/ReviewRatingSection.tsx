import { IconStar } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

interface ReviewRatingSectionProps {
  rating: number;
  hasError?: boolean;
  onStarClick: (starIndex: number, isHalf?: boolean) => void;
}

export const ReviewRatingSection = ({ rating, hasError = false, onStarClick }: ReviewRatingSectionProps) => {
  return (
    <>
      <Section>
        <Title>라멘은 만족하셨나요?</Title>
        <StarContainer>
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFullStar = starIndex <= rating;
            const isHalfStar = starIndex - 0.5 <= rating && rating < starIndex;

            return (
              <StarButtonContainer key={starIndex}>
                {isHalfStar ? (
                  <IconStar isHalf={true} inactive={!isFullStar} size={36} />
                ) : (
                  <IconStar inactive={!isFullStar} size={36} />
                )}

                <StarButtonLeft
                  type="button"
                  aria-label={`${starIndex - 0.5}점`}
                  onClick={() => onStarClick(starIndex, true)}
                />
                <StarButtonRight type="button" aria-label={`${starIndex}점`} onClick={() => onStarClick(starIndex)} />
              </StarButtonContainer>
            );
          })}
        </StarContainer>
        {hasError && <ErrorMessage>별점을 선택해주세요</ErrorMessage>}
      </Section>
      <Divider />
    </>
  );
};

const Section = render.section("flex flex-col items-center gap-12 pt-20 pb-32");

const Title = render.div("font-16-m text-black");

const StarContainer = render.div("flex items-center gap-8");

const StarButtonContainer = render.div("relative flex items-center justify-center");

const StarButtonLeft = render.button(
  "absolute left-0 m-0 flex h-full w-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-0",
);

const StarButtonRight = render.button(
  "absolute right-0 m-0 flex h-full w-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-0",
);

const Divider = render.div("h-1 w-full bg-divider");

const ErrorMessage = render.div("mt-4 font-12-r text-red");
