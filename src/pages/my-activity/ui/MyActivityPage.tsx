import type { MyComment, MyPost } from '@/entities/activity/model'
import { getRelativeTimeLabel } from '@/entities/community/lib'
import { CommunityCommentIcon, CommunityEyeIcon, CommunityHeartIcon } from '@/entities/community/ui'
import { IconUnSignInUserProfile } from '@/shared/ui/icon'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { ReviewCard } from '@/widgets/review'
import { useMyActivityPage, type MyActivityTab } from '../model/useMyActivityPage'

const TABS: { key: MyActivityTab; label: string }[] = [
  { key: 'review', label: '작성한 리뷰' },
  { key: 'post', label: '작성한 게시글' },
  { key: 'comment', label: '작성한 댓글' },
]

const descriptionClampStyle = {
  WebkitBoxOrient: 'vertical' as const,
  WebkitLineClamp: 2,
  display: '-webkit-box',
  overflow: 'hidden',
}

const MyActivityPage = () => {
  const {
    activeTab,
    setActiveTab,
    reviews,
    isReviewsLoading,
    posts,
    isPostsLoading,
    comments,
    isCommentsLoading,
    onBoardClick,
    onBack,
  } = useMyActivityPage()

  return (
    <Wrapper variant="standalone">
      <Header>
        <TopBar title="내 활동" onBackClick={onBack} />
      </Header>

      <TabList>
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? 'border-orange font-16-sb text-orange' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>

      {activeTab === 'review' && (
        <List>
          {isReviewsLoading ? (
            <StateText>불러오는 중...</StateText>
          ) : reviews.length === 0 ? (
            <EmptyText>작성한 리뷰가 없어요.</EmptyText>
          ) : (
            reviews.map((review) => (
              <ReviewItemWrap key={review._id}>
                <ReviewCard review={review} editable mypage />
                <ItemDivider />
              </ReviewItemWrap>
            ))
          )}
        </List>
      )}

      {activeTab === 'post' && (
        <List>
          {isPostsLoading ? (
            <StateText>불러오는 중...</StateText>
          ) : posts.length === 0 ? (
            <EmptyText>작성한 게시글이 없어요.</EmptyText>
          ) : (
            posts.map((post) => <MyPostCard key={post._id} post={post} onClick={() => onBoardClick(post._id)} />)
          )}
        </List>
      )}

      {activeTab === 'comment' && (
        <List>
          {isCommentsLoading ? (
            <StateText>불러오는 중...</StateText>
          ) : comments.length === 0 ? (
            <EmptyText>작성한 댓글이 없어요.</EmptyText>
          ) : (
            comments.map((comment) => (
              <MyCommentCard key={comment._id} comment={comment} onClick={() => onBoardClick(comment.boardId._id)} />
            ))
          )}
        </List>
      )}
    </Wrapper>
  )
}

const MyPostCard = ({ post, onClick }: { post: MyPost; onClick: () => void }) => {
  const thumbnailUrl = post.ImageUrls[0]

  return (
    <PostCard onClick={onClick}>
      <PostCategory>{post.category}</PostCategory>
      <PostContentRow>
        <PostTextBody>
          <PostTitle>{post.title}</PostTitle>
          <PostDescription style={descriptionClampStyle}>{post.body}</PostDescription>
        </PostTextBody>
        {thumbnailUrl ? (
          <PostThumbnail>
            <PostThumbnailImage src={thumbnailUrl} alt={post.title} />
          </PostThumbnail>
        ) : null}
      </PostContentRow>
      <PostBottomRow>
        <PostTime>{getRelativeTimeLabel(post.createdAt)}</PostTime>
        <PostMetrics>
          <PostMetric>
            <CommunityEyeIcon width={16} height={16} />
            <PostMetricValue>{post.viewCount}</PostMetricValue>
          </PostMetric>
          <PostMetric>
            <CommunityHeartIcon width={16} height={16} />
            <PostMetricValue>{post.likeCount}</PostMetricValue>
          </PostMetric>
          <PostMetric>
            <CommunityCommentIcon width={16} height={16} />
            <PostMetricValue>{post.commentCount}</PostMetricValue>
          </PostMetric>
        </PostMetrics>
      </PostBottomRow>
    </PostCard>
  )
}

const MyCommentCard = ({ comment, onClick }: { comment: MyComment; onClick: () => void }) => {
  const isReply = comment.depth > 0
  const parent = comment.parentCommentId

  // 답글이면 '부모 댓글 칸'과 '내 답글 칸'을 각각 별도 카드로 분리한다.
  if (isReply && parent) {
    return (
      <>
        {/* 칸 1 — 상위(부모) 댓글 */}
        <CommentCard onClick={onClick}>
          <CommentBoardCategory>{comment.boardId.category}</CommentBoardCategory>
          <CommentBoardTitle>{comment.boardId.title}</CommentBoardTitle>
          <ParentRow>
            <RowAvatar>
              {parent.userId?.profileImageUrl ? (
                <RowAvatarImg
                  src={parent.userId.profileImageUrl}
                  alt={`${parent.userId?.nickname ?? '사용자'} 프로필`}
                />
              ) : (
                <IconUnSignInUserProfile width={32} height={32} />
              )}
            </RowAvatar>
            <ParentMain>
              <ParentName>{parent.userId?.nickname ?? '알 수 없는 사용자'}</ParentName>
              <ParentBody>{parent.body}</ParentBody>
            </ParentMain>
          </ParentRow>
        </CommentCard>

        {/* 칸 2 — 내 답글 (들여쓰기 + 회색 배경) */}
        <ReplyCard onClick={onClick}>
          <CommentBodyRow>
            <ReplyBadge>답글</ReplyBadge>
            <CommentBody>{comment.body}</CommentBody>
          </CommentBodyRow>
          <CommentBottomRow>
            <CommentTime>{getRelativeTimeLabel(comment.createdAt)}</CommentTime>
            <PostMetric>
              <CommunityHeartIcon width={16} height={16} />
              <PostMetricValue>{comment.likeCount}</PostMetricValue>
            </PostMetric>
          </CommentBottomRow>
        </ReplyCard>
      </>
    )
  }

  // 최상위 댓글 — 한 칸
  return (
    <CommentCard onClick={onClick}>
      <CommentBoardCategory>{comment.boardId.category}</CommentBoardCategory>
      <CommentBoardTitle>{comment.boardId.title}</CommentBoardTitle>
      <TopComment>
        <CommentBody>{comment.body}</CommentBody>
        <CommentBottomRow>
          <CommentTime>{getRelativeTimeLabel(comment.createdAt)}</CommentTime>
          <PostMetric>
            <CommunityHeartIcon width={16} height={16} />
            <PostMetricValue>{comment.likeCount}</PostMetricValue>
          </PostMetric>
        </CommentBottomRow>
      </TopComment>
    </CommentCard>
  )
}

const Wrapper = render.extend(PageLayout, 'pb-40')

const Header = render.div('')

const TabList = render.div('flex items-center border-0 border-b border-solid border-border px-8')

const TabButton = render.button(
  'h-44 flex-1 cursor-pointer border-0 border-b-[1.5px] border-solid border-transparent bg-transparent px-12 font-16-r text-gray-500',
)

const List = render.div('flex flex-col')

const StateText = render.div('flex min-h-200 items-center justify-center font-16-m text-gray-400')

const EmptyText = render.div('flex min-h-200 items-center justify-center font-14-r text-gray-400')

const ReviewItemWrap = render.div('flex flex-col')

const ItemDivider = render.div('h-1 w-full bg-border')

const PostCard = render.article('cursor-pointer border-0 border-b border-solid border-border px-20 py-20')

const PostCategory = render.div(
  'mb-12 inline-flex w-fit items-center rounded-4 bg-border px-8 py-[2px] text-[11px] font-medium leading-[17px] text-gray-500',
)

const PostContentRow = render.div('flex items-start gap-16')

const PostTextBody = render.div('flex min-w-0 flex-1 flex-col gap-4 overflow-hidden')

const PostTitle = render.div('truncate text-[16px] font-semibold leading-[24px] text-gray-900')

const PostDescription = render.div('break-words text-[14px] font-normal leading-[20px] text-gray-500')

const PostThumbnail = render.div('h-80 w-80 shrink-0 overflow-hidden rounded-8 border border-solid border-border bg-border')

const PostThumbnailImage = render.img('h-full w-full object-cover')

const PostBottomRow = render.div('mt-12 flex items-center justify-between')

const PostTime = render.div('font-14-r text-gray-400')

const PostMetrics = render.div('flex items-center gap-16')

const PostMetric = render.div('flex items-center gap-4')

const PostMetricValue = render.div('font-14-r text-gray-400')

const CommentCard = render.article('flex cursor-pointer flex-col gap-8 border-0 border-b border-solid border-border px-20 py-20')

const CommentBoardCategory = render.div(
  'inline-flex w-fit items-center rounded-4 bg-border px-8 py-[2px] text-[11px] font-medium leading-[17px] text-gray-500',
)

const CommentBoardTitle = render.div('truncate font-14-r text-gray-400')

const ParentRow = render.div('mt-4 flex gap-8')

const RowAvatar = render.div('flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-border')

const RowAvatarImg = render.img('h-full w-full object-cover')

const ParentMain = render.div('flex min-w-0 flex-1 flex-col gap-2')

const ParentName = render.div('text-[13px] font-medium leading-[20px] text-gray-500')

const ParentBody = render.div('break-words font-16-r text-gray-900')

const ReplyCard = render.article(
  'flex cursor-pointer flex-col gap-6 border-0 border-b border-solid border-border bg-[#FCFCFC] py-16 pl-40 pr-20',
)

const TopComment = render.div('mt-4 flex flex-col gap-6')

const CommentBodyRow = render.div('flex items-center gap-6')

const ReplyBadge = render.span(
  'shrink-0 rounded-4 bg-gray-100 px-6 py-[2px] text-[12px] font-medium leading-[18px] text-gray-500',
)

const CommentBody = render.div('min-w-0 break-words font-16-r text-gray-900')

const CommentBottomRow = render.div('flex items-center justify-between')

const CommentTime = render.div('font-14-r text-gray-400')

export default MyActivityPage
