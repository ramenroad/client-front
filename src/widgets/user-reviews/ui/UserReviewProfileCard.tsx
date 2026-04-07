import { Line } from "@/shared/ui/line";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

interface UserReviewProfileCardProps {
  userName: string;
  profileImageUrl: string;
  monthlyReviewCount: number;
  avgReviewRating: number | string;
  reviewCount: number;
}

export const UserReviewProfileCard = ({
  userName,
  profileImageUrl,
  monthlyReviewCount,
  avgReviewRating,
  reviewCount,
}: UserReviewProfileCardProps) => {
  return (
    <CardWrapper>
      <CardContent>
        <ProfileSection>
          <ProfileImage src={profileImageUrl} alt={userName} />
        </ProfileSection>
        <ProfileInfo>
          <ProfileName>{userName}</ProfileName>
          <ProfileSubName>
            이번 달 작성 리뷰 <ProfileSubValue size={14} weight="m">{monthlyReviewCount}</ProfileSubValue>
          </ProfileSubName>
        </ProfileInfo>
      </CardContent>

      <DetailContent>
        <DetailContentSection>
          <DetailWrapper>
            <RaisingText size={20} weight="sb">
              {avgReviewRating}
            </RaisingText>
            <DetailTitle size={14} weight="r">
              평균 별점
            </DetailTitle>
          </DetailWrapper>
        </DetailContentSection>
        <LineWrapper>
          <Line vertical />
        </LineWrapper>
        <DetailContentSection>
          <DetailWrapper>
            <RaisingText size={20} weight="sb">
              {reviewCount}
            </RaisingText>
            <DetailTitle size={14} weight="r">
              리뷰
            </DetailTitle>
          </DetailWrapper>
        </DetailContentSection>
      </DetailContent>
    </CardWrapper>
  );
};

const CardWrapper = render.section("px-20 pt-20 pb-30 flex flex-col gap-24");

const CardContent = render.section("flex flex-row gap-12 items-center");

const ProfileSection = render.section("w-64 h-64 rounded-full overflow-hidden");

const ProfileImage = render.img("w-full h-full object-cover");

const ProfileInfo = render.section("flex flex-col gap-2");

const ProfileName = render.section("text-[18px] font-medium");

const ProfileSubName = render.section("text-[14px] text-gray-500");

const ProfileSubValue = render.extend(RaisingText, "");

const DetailContent = render.section("w-full h-75 bg-[#F9F9F9] flex rounded-[8px]");

const DetailTitle = render.extend(RaisingText, "text-gray-500");

const DetailWrapper = render.section("flex flex-col items-center");

const DetailContentSection = render.section("flex gap-4 items-center justify-center w-full");

const LineWrapper = render.section("py-22");
