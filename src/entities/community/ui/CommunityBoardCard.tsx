import type { CommunityBoardSummary } from '@/entities/community/model'
import { getRelativeTimeLabel } from '@/entities/community/lib'
import { IconUnSignInUserProfile } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { CommunityCommentIcon, CommunityEyeIcon, CommunityHeartIcon } from './CommunityIcons'

interface CommunityBoardCardProps {
  board: CommunityBoardSummary
}

const descriptionClampStyle = {
  WebkitBoxOrient: 'vertical' as const,
  WebkitLineClamp: 2,
  display: '-webkit-box',
  overflow: 'hidden',
}

export const CommunityBoardCard = ({ board }: CommunityBoardCardProps) => {
  const thumbnailUrl = board.ImageUrls[0]
  const imageCount = board.ImageUrls.length
  const authorName = board.userId?.nickname ?? '알 수 없는 사용자'
  const authorProfileImageUrl = board.userId?.profileImageUrl

  return (
    <Card>
      <CardContent>
        <TextSection>
          <CategoryChip>{board.category}</CategoryChip>
          <Title>{board.title}</Title>
          <Description style={descriptionClampStyle}>{board.body}</Description>
          <AuthorRow>
            <AvatarFrame>
              {authorProfileImageUrl ? <Avatar src={authorProfileImageUrl} alt={`${authorName} 프로필`} /> : <IconUnSignInUserProfile />}
            </AvatarFrame>
            <AuthorName>{authorName}</AuthorName>
          </AuthorRow>
          <BottomRow>
            <CreatedAt>{getRelativeTimeLabel(board.createdAt)}</CreatedAt>
            <Metrics>
              <MetricItem>
                <CommunityEyeIcon />
                <MetricValue>{board.viewCount}</MetricValue>
              </MetricItem>
              <MetricItem>
                <CommunityHeartIcon />
                <MetricValue>{board.likeCount}</MetricValue>
              </MetricItem>
              <MetricItem>
                <CommunityCommentIcon />
                <MetricValue>{board.commentCount}</MetricValue>
              </MetricItem>
            </Metrics>
          </BottomRow>
        </TextSection>
        {thumbnailUrl ? (
          <ThumbnailFrame>
            <ThumbnailImage src={thumbnailUrl} alt={board.title} />
            {imageCount > 1 ? <ImageCountBadge>{imageCount}</ImageCountBadge> : null}
          </ThumbnailFrame>
        ) : null}
      </CardContent>
    </Card>
  )
}

const Card = render.article('border-0 border-b border-solid border-border px-20 py-18')

const CardContent = render.div('flex items-start gap-16')

const TextSection = render.div('min-w-0 flex-1')

const CategoryChip = render.div(
  'mb-8 inline-flex items-center rounded-4 bg-border px-8 py-[2px] text-[11px] font-medium leading-[17px] text-gray-500',
)

const Title = render.div('font-16-m text-gray-900')

const Description = render.div('mt-4 break-words font-14-r text-gray-500')

const AuthorRow = render.div('mt-14 flex items-center gap-6')

const AvatarFrame = render.div('flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-border')

const Avatar = render.img('h-full w-full object-cover')

const AuthorName = render.div('text-[13px] font-medium leading-[20px] text-gray-500')

const BottomRow = render.div('mt-6 flex items-center justify-between gap-12')

const CreatedAt = render.div('font-14-r text-gray-400')

const Metrics = render.div('flex items-center gap-12')

const MetricItem = render.div('flex items-center gap-2')

const MetricValue = render.div('font-14-r text-gray-400')

const ThumbnailFrame = render.div(
  'relative h-80 w-80 shrink-0 overflow-hidden rounded-8 border border-solid border-border bg-border',
)

const ThumbnailImage = render.img('h-full w-full object-cover')

const ImageCountBadge = render.div(
  'absolute left-0 top-0 flex h-24 w-24 items-center justify-center bg-black/50 font-12-m text-white',
)
