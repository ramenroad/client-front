import { type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const authorId = board.userId?._id
  const navigate = useNavigate()

  const handleAuthorClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!authorId) {
      return
    }
    event.stopPropagation()
    navigate(`/user-review/${authorId}`)
  }

  return (
    <Card onClick={() => navigate(`/community/${board._id}`)}>
      <Category>{board.category}</Category>

      <ContentRow>
        <TitleBody>
          <Title>{board.title}</Title>
          <Description style={descriptionClampStyle}>{board.body}</Description>
        </TitleBody>
        {thumbnailUrl ? (
          <ThumbnailFrame>
            <ThumbnailImage src={thumbnailUrl} alt={board.title} />
            {imageCount > 1 ? <ImageCountBadge>{imageCount}</ImageCountBadge> : null}
          </ThumbnailFrame>
        ) : null}
      </ContentRow>

      <AuthorRow onClick={handleAuthorClick}>
        <AvatarFrame>
          {authorProfileImageUrl ? (
            <Avatar src={authorProfileImageUrl} alt={`${authorName} 프로필`} />
          ) : (
            <IconUnSignInUserProfile />
          )}
        </AvatarFrame>
        <AuthorName>{authorName}</AuthorName>
      </AuthorRow>

      <BottomRow>
        <CreatedAt>{getRelativeTimeLabel(board.createdAt)}</CreatedAt>
        <Metrics>
          <MetricItem>
            <CommunityEyeIcon width={16} height={16} />
            <MetricValue>{board.viewCount}</MetricValue>
          </MetricItem>
          <MetricItem>
            <CommunityHeartIcon width={16} height={16} />
            <MetricValue>{board.likeCount}</MetricValue>
          </MetricItem>
          <MetricItem>
            <CommunityCommentIcon width={16} height={16} />
            <MetricValue>{board.commentCount}</MetricValue>
          </MetricItem>
        </Metrics>
      </BottomRow>
    </Card>
  )
}

const Card = render.article('cursor-pointer border-0 border-b border-solid border-border px-20 py-20')

const Category = render.div(
  'mb-12 inline-flex w-fit items-center rounded-4 bg-border px-8 py-[2px] text-[11px] font-medium leading-[17px] text-gray-500',
)

const ContentRow = render.div('flex items-start gap-16')

const TitleBody = render.div('flex h-70 min-w-0 flex-1 flex-col gap-4 overflow-hidden')

const Title = render.div('truncate text-[16px] font-semibold leading-[24px] text-gray-900')

const Description = render.div('break-words text-[14px] font-normal leading-[20px] text-gray-500')

const ThumbnailFrame = render.div(
  'relative h-80 w-80 shrink-0 overflow-hidden rounded-8 border border-solid border-border bg-border',
)

const ThumbnailImage = render.img('h-full w-full object-cover')

const ImageCountBadge = render.div(
  'absolute left-0 top-0 flex h-24 w-24 items-center justify-center rounded-br-8 rounded-tl-8 bg-black/50 font-12-m text-white',
)

const AuthorRow = render.div('mt-16 flex w-fit cursor-pointer items-center gap-6')

const AvatarFrame = render.div('flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-border')

const Avatar = render.img('h-full w-full object-cover')

const AuthorName = render.div('text-[13px] font-medium leading-[20px] text-gray-500')

const BottomRow = render.div('mt-12 flex items-center justify-between')

const CreatedAt = render.div('font-14-r text-gray-400')

const Metrics = render.div('flex items-center gap-16')

const MetricItem = render.div('flex items-center gap-4')

const MetricValue = render.div('font-14-r text-gray-400')
