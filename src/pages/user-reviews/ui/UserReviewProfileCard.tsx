import { Line } from '@/shared/ui/line'
import { IconUnSignInUserProfile } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface UserReviewProfileCardProps {
  userName: string
  profileImageUrl: string
  monthlyReviewCount: number
  avgReviewRating: number | string
  reviewCount: number
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
          {profileImageUrl ? <ProfileImage src={profileImageUrl} alt={userName} /> : <IconUnSignInUserProfile />}
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
  )
}

const CardWrapper = render.section('flex flex-col gap-24 px-20 pb-30 pt-20')

const CardContent = render.section('flex flex-row items-center gap-12')

const ProfileSection = render.section('flex h-64 w-64 items-center justify-center overflow-hidden rounded-full bg-gray-100')

const ProfileImage = render.img('h-full w-full object-cover')

const ProfileInfo = render.section('flex flex-col gap-2')

const ProfileName = render.section('text-[18px] font-medium')

const ProfileSubName = render.section('text-[14px] text-gray-500')

const ProfileSubValue = render.extend(RaisingText, '')

const DetailContent = render.section('flex h-75 w-full rounded-8 bg-[#F9F9F9]')

const DetailTitle = render.extend(RaisingText, 'text-gray-500')

const DetailWrapper = render.section('flex flex-col items-center')

const DetailContentSection = render.section('flex w-full items-center justify-center gap-4')

const LineWrapper = render.section('py-22')
