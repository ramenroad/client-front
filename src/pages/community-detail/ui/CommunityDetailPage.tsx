import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import type { CommunityCommentNode } from "@/entities/community/model";
import { getRelativeTimeLabel } from "@/entities/community/lib";
import {
  CommunityCommentIcon,
  CommunityEyeIcon,
  CommunityHeartIcon,
} from "@/entities/community/ui";
import { UserReviewsShareModal } from "@/pages/user-reviews/ui/UserReviewsShareModal";
import {
  IconEdit,
  IconHeart,
  IconMoreMenu,
  IconReply,
  IconReport,
  IconShare,
  IconTrash,
  IconUnSignInUserProfile,
} from "@/shared/ui/icon";
import { PageLayout } from "@/shared/ui/page-layout";
import { Popup, PopupConfirm } from "@/shared/ui/popup";
import render from "@/shared/ui/render";
import TopBar from "@/shared/ui/top-bar";
import { useCommunityDetailPage } from "../model/useCommunityDetailPage";

type CommentActions = {
  myId: string;
  boardAuthorId?: string;
  onProfileClick: (userId: string) => void;
  editingId: string | null;
  editingValue: string;
  openMenuId: string | null;
  onToggleMenu: (commentId: string) => void;
  onCloseMenu: () => void;
  onEditingValueChange: (value: string) => void;
  onToggleLike: (comment: CommunityCommentNode) => void;
  onStartReply: (comment: CommunityCommentNode) => void;
  onStartEdit: (comment: CommunityCommentNode) => void;
  onSubmitEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (commentId: string) => void;
  onReport: () => void;
};

const commentTextareaClass =
  "min-h-44 max-h-92 flex-1 resize-none overflow-y-auto thin-scrollbar rounded-8 border border-solid border-border bg-border px-12 py-[11px] font-16-r leading-[22px] text-gray-900 outline-none focus:border-orange";

const editTextareaClass =
  "min-h-36 max-h-76 w-full resize-none overflow-y-auto thin-scrollbar rounded-8 border border-solid border-border bg-border px-12 py-[8px] font-14-r leading-[20px] text-gray-900 outline-none focus:border-orange";

// 내용에 따라 높이가 늘어나는 textarea. CSS max-height까지 자라고 이후 스크롤된다.
const AutoTextarea = ({ value, className, ...props }: ComponentProps<"textarea">) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    element.style.height = "auto";
    // scrollHeight는 테두리를 제외(content+padding)하므로, border-box에서는 테두리(offsetHeight-clientHeight)를
    // 더해줘야 1~2줄부터 불필요한 스크롤바가 생기지 않는다.
    const borderHeight = element.offsetHeight - element.clientHeight;
    element.style.height = `${element.scrollHeight + borderHeight}px`;
  }, [value]);

  return <textarea ref={ref} value={value} rows={1} className={className} {...props} />;
};

const CommunityDetailPage = () => {
  const {
    board,
    isLoading,
    isError,
    comments,
    myId,
    isBoardLiked,
    isMyBoard,
    commentInput,
    onCommentInputChange,
    replyTarget,
    onCancelReply,
    editingId,
    editingValue,
    onEditingValueChange,
    isSubmittingComment,
    isSharePopupOpen,
    onOpenShare,
    onCloseShare,
    onShare,
    confirmDialog,
    onCloseConfirmDialog,
    onConfirmDialog,
    onToggleBoardLike,
    onDeleteBoard,
    onReportBoard,
    onReportComment,
    onSubmitComment,
    onToggleCommentLike,
    onStartReply,
    onStartEdit,
    onSubmitEdit,
    onCancelEdit,
    onDeleteComment,
    onProfileClick,
    onBack,
  } = useCommunityDetailPage();

  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState<string | null>(
    null,
  );

  const commentActions: CommentActions = {
    myId,
    boardAuthorId: board?.userId?._id,
    onProfileClick,
    editingId,
    editingValue,
    openMenuId: openCommentMenuId,
    onToggleMenu: (commentId) =>
      setOpenCommentMenuId((prev) => (prev === commentId ? null : commentId)),
    onCloseMenu: () => setOpenCommentMenuId(null),
    onEditingValueChange,
    onToggleLike: onToggleCommentLike,
    onStartReply,
    onStartEdit,
    onSubmitEdit,
    onCancelEdit,
    onDelete: onDeleteComment,
    onReport: onReportComment,
  };

  return (
    <Wrapper variant="standalone">
      <Header>
        <TopBar
          title=""
          onBackClick={onBack}
          icon={<IconShare />}
          onIconClick={onOpenShare}
        />
      </Header>

      {isLoading ? (
        <StateText>불러오는 중...</StateText>
      ) : isError || !board ? (
        <StateText>게시글을 불러오지 못했어요.</StateText>
      ) : (
        <>
          <Content>
            <Category>{board.category}</Category>

            <AuthorRow>
              <AuthorLeft
                onClick={() =>
                  board.userId?._id && onProfileClick(board.userId._id)
                }
              >
                <Avatar>
                  {board.userId?.profileImageUrl ? (
                    <AvatarImg
                      src={board.userId.profileImageUrl}
                      alt={`${board.userId.nickname} 프로필`}
                    />
                  ) : (
                    <IconUnSignInUserProfile />
                  )}
                </Avatar>
                <AuthorMeta>
                  <AuthorName>
                    {board.userId?.nickname ?? "알 수 없는 사용자"}
                  </AuthorName>
                  <Time>{getRelativeTimeLabel(board.createdAt)}</Time>
                </AuthorMeta>
              </AuthorLeft>
              <MenuWrap>
                <MenuTrigger
                  type="button"
                  aria-label="게시글 더보기"
                  onClick={() => setIsPostMenuOpen((v) => !v)}
                >
                  <IconMoreMenu />
                </MenuTrigger>
                {isPostMenuOpen && (
                  <Menu>
                    {isMyBoard ? (
                      <MenuItem
                        type="button"
                        onClick={() => {
                          setIsPostMenuOpen(false);
                          onDeleteBoard();
                        }}
                      >
                        <MenuLabel>삭제</MenuLabel>
                        <IconTrash />
                      </MenuItem>
                    ) : (
                      <MenuItem
                        type="button"
                        onClick={() => {
                          setIsPostMenuOpen(false);
                          onReportBoard();
                        }}
                      >
                        <MenuLabel>신고</MenuLabel>
                        <IconReport />
                      </MenuItem>
                    )}
                  </Menu>
                )}
              </MenuWrap>
            </AuthorRow>

            <Title>{board.title}</Title>
            <Body>{board.body}</Body>

            {board.ImageUrls.length > 0 && (
              <Images>
                {board.ImageUrls.map((url, index) => (
                  <PostImage
                    key={`${url}-${index}`}
                    src={url}
                    alt={`${board.title} 이미지 ${index + 1}`}
                  />
                ))}
              </Images>
            )}

            <LikeBar>
              <LikePill type="button" onClick={onToggleBoardLike}>
                <IconHeart filled={isBoardLiked} />
                <LikeLabel>좋아요</LikeLabel>
                <LikeCount>{board.likeCount}</LikeCount>
              </LikePill>
            </LikeBar>

            <MetricsRow>
              <Metric>
                <CommunityEyeIcon />
                <MetricValue>{board.viewCount}</MetricValue>
              </Metric>
              <Metric>
                <CommunityHeartIcon />
                <MetricValue>{board.likeCount}</MetricValue>
              </Metric>
              <Metric>
                <CommunityCommentIcon />
                <MetricValue>{board.commentCount}</MetricValue>
              </Metric>
            </MetricsRow>
          </Content>

          <Divider />

          <CommentSection>
            {comments.length === 0 ? (
              <EmptyComment>첫 댓글을 남겨보세요.</EmptyComment>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  depth={0}
                  actions={commentActions}
                />
              ))
            )}
          </CommentSection>
        </>
      )}

      <CommentArea>
        {replyTarget && (
          <ReplyBanner>
            <ReplyText>{replyTarget.nickname}님에게 답글</ReplyText>
            <ReplyCancel type="button" onClick={onCancelReply}>
              취소
            </ReplyCancel>
          </ReplyBanner>
        )}
        <CommentBar onSubmit={onSubmitComment}>
          <AutoTextarea
            className={commentTextareaClass}
            value={commentInput}
            onChange={(event) => onCommentInputChange(event.target.value)}
            placeholder={
              replyTarget ? "답글을 입력해주세요" : "댓글을 입력해주세요"
            }
          />
          <SubmitButton
            type="submit"
            disabled={isSubmittingComment || commentInput.trim().length === 0}
          >
            등록
          </SubmitButton>
        </CommentBar>
      </CommentArea>

      <UserReviewsShareModal
        isOpen={isSharePopupOpen}
        onClose={onCloseShare}
        onShare={onShare}
      />

      <Popup
        isOpen={Boolean(confirmDialog)}
        onClose={onCloseConfirmDialog}
        direction="center"
      >
        {confirmDialog ? (
          <PopupConfirm
            content={
              <ConfirmBody>
                <ConfirmTitle>{confirmDialog.title}</ConfirmTitle>
                <ConfirmMessage>{confirmDialog.message}</ConfirmMessage>
              </ConfirmBody>
            }
            confirmText={confirmDialog.confirmText}
            onClose={onCloseConfirmDialog}
            onConfirm={onConfirmDialog}
          />
        ) : null}
      </Popup>
    </Wrapper>
  );
};

const CommentItem = ({
  comment,
  depth,
  actions,
}: {
  comment: CommunityCommentNode;
  depth: number;
  actions: CommentActions;
}) => {
  const name = comment.userId?.nickname ?? "알 수 없는 사용자";
  const isMine = Boolean(actions.myId) && comment.userId?._id === actions.myId;
  const isLiked = comment.isLiked;
  const isAuthor =
    Boolean(actions.boardAuthorId) &&
    comment.userId?._id === actions.boardAuthorId;
  const isEditing = actions.editingId === comment._id;
  const isMenuOpen = actions.openMenuId === comment._id;

  return (
    <>
      <CommentCard
        className={depth > 0 ? "bg-[#FCFCFC]" : undefined}
        style={{ paddingLeft: 20 + depth * 28 }}
      >
        <CommentMain>
          <CommentTop>
            <CommentHeadLeft>
              {depth > 0 && <IconReply className="shrink-0" />}
              <CommentProfile
                onClick={() =>
                  comment.userId?._id &&
                  actions.onProfileClick(comment.userId._id)
                }
              >
                <CommentAvatar>
                  {comment.userId?.profileImageUrl ? (
                    <AvatarImg
                      src={comment.userId.profileImageUrl}
                      alt={`${name} 프로필`}
                    />
                  ) : (
                    <IconUnSignInUserProfile />
                  )}
                </CommentAvatar>
                <CommentName>{name}</CommentName>
              </CommentProfile>
              <Time>{getRelativeTimeLabel(comment.createdAt)}</Time>
              {isAuthor && <AuthorBadge>작성자</AuthorBadge>}
            </CommentHeadLeft>
            {!comment.isDeleted && (
              <MenuWrap>
                <MenuTrigger
                  type="button"
                  aria-label="댓글 더보기"
                  onClick={() => actions.onToggleMenu(comment._id)}
                >
                  <IconMoreMenu />
                </MenuTrigger>
                {isMenuOpen && (
                  <Menu>
                    {isMine ? (
                      <>
                        <MenuItem
                          type="button"
                          onClick={() => {
                            actions.onCloseMenu();
                            actions.onStartEdit(comment);
                          }}
                        >
                          <MenuLabel>수정</MenuLabel>
                          <IconEdit />
                        </MenuItem>
                        <MenuItem
                          type="button"
                          onClick={() => {
                            actions.onCloseMenu();
                            actions.onDelete(comment._id);
                          }}
                        >
                          <MenuLabel>삭제</MenuLabel>
                          <IconTrash />
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem
                        type="button"
                        onClick={() => {
                          actions.onCloseMenu();
                          actions.onReport();
                        }}
                      >
                        <MenuLabel>신고</MenuLabel>
                        <IconReport />
                      </MenuItem>
                    )}
                  </Menu>
                )}
              </MenuWrap>
            )}
          </CommentTop>

          {comment.isDeleted ? (
            <CommentText>삭제된 댓글이에요.</CommentText>
          ) : isEditing ? (
            <EditBox>
              <AutoTextarea
                className={editTextareaClass}
                value={actions.editingValue}
                onChange={(event) =>
                  actions.onEditingValueChange(event.target.value)
                }
              />
              <EditActions>
                <EditAction type="button" onClick={actions.onCancelEdit}>
                  취소
                </EditAction>
                <EditAction type="button" onClick={actions.onSubmitEdit}>
                  저장
                </EditAction>
              </EditActions>
            </EditBox>
          ) : (
            <CommentText>{comment.body}</CommentText>
          )}
        </CommentMain>

        {!comment.isDeleted && !isEditing && (
          <CommentActionsRow>
            <ReplyButton
              type="button"
              onClick={() => actions.onStartReply(comment)}
            >
              답글 달기
            </ReplyButton>
            <LikeMetaButton
              type="button"
              onClick={() => actions.onToggleLike(comment)}
            >
              <IconHeart filled={isLiked} />
              <MetricValue>{comment.likeCount}</MetricValue>
            </LikeMetaButton>
          </CommentActionsRow>
        )}
      </CommentCard>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply._id}
          comment={reply}
          depth={depth + 1}
          actions={actions}
        />
      ))}
    </>
  );
};

const Wrapper = render.extend(PageLayout, "pb-88");

const Header = render.div("");

const StateText = render.div(
  "flex min-h-200 items-center justify-center font-16-m text-gray-400",
);

const Content = render.div("flex flex-col px-20 py-16");

const Category = render.div(
  "inline-flex w-fit items-center rounded-4 bg-border px-8 py-[2px] text-[11px] font-medium leading-[17px] text-gray-500",
);

const AuthorRow = render.div("mt-14 flex items-center justify-between");

const AuthorLeft = render.div("flex cursor-pointer items-center gap-8");

const Avatar = render.div(
  "flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-border",
);

const AvatarImg = render.img("h-full w-full object-cover");

const AuthorMeta = render.div("flex flex-col gap-2");

const AuthorName = render.div(
  "text-[14px] font-medium leading-[21px] text-gray-700",
);

const Time = render.div("text-[13px] font-normal leading-[20px] text-gray-400");

const Title = render.div(
  "mt-16 text-[20px] font-medium leading-[30px] text-gray-900",
);

const Body = render.div(
  "mt-10 whitespace-pre-wrap break-words text-[16px] font-normal leading-[24px] text-gray-900",
);

const Images = render.div("mt-16 flex flex-col gap-8");

const PostImage = render.img("w-full rounded-8 object-cover");

const LikeBar = render.div("mt-20 flex justify-center");

const LikePill = render.button(
  "inline-flex cursor-pointer items-center gap-6 rounded-full border-none bg-border px-20 py-10",
);

const LikeLabel = render.span("font-14-m text-gray-700");

const LikeCount = render.span("font-14-m text-gray-500");

const MetricsRow = render.div("mt-40 flex items-center gap-12");

const Metric = render.div("flex items-center gap-4");

const MetricValue = render.div("font-14-r text-gray-400");

const MenuWrap = render.div("relative");

const MenuTrigger = render.button(
  "flex h-24 w-24 cursor-pointer items-center justify-center border-none bg-transparent p-0",
);

const Menu = render.div(
  "absolute right-0 top-28 z-10 min-w-[140px] overflow-hidden rounded-12 border border-solid border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
);

const MenuItem = render.button(
  "flex w-full cursor-pointer items-center justify-between gap-20 whitespace-nowrap border-none bg-white px-20 py-12 text-left font-14-r text-gray-500",
);

const MenuLabel = render.span("");

const Divider = render.div("h-8 w-full bg-border");

const CommentSection = render.div("flex flex-col");

const EmptyComment = render.div("py-40 text-center font-14-r text-gray-400");

const CommentCard = render.div(
  "box-border flex min-h-120 flex-col justify-between border-0 border-b border-solid border-border pb-16 pr-20 pt-20",
);

const CommentMain = render.div("flex flex-col gap-8 mb-10");

const CommentTop = render.div("flex items-start justify-between");

const CommentHeadLeft = render.div("flex items-center gap-6");

const CommentProfile = render.div("flex cursor-pointer items-center gap-6");

const CommentAvatar = render.div(
  "flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-border",
);

const CommentName = render.div(
  "text-[14px] font-medium leading-[21px] text-gray-700",
);

const AuthorBadge = render.span(
  "text-[13px] font-medium leading-[20px] text-orange",
);

const ConfirmBody = render.div("flex flex-col items-center gap-4");

const ConfirmTitle = render.div("font-16-sb text-gray-900");

const ConfirmMessage = render.div("font-16-r text-gray-500");

const CommentText = render.div(
  "whitespace-pre-wrap break-words font-14-r text-gray-900",
);

const CommentActionsRow = render.div("flex items-center gap-12");

const ReplyButton = render.button(
  "cursor-pointer border-none bg-transparent p-0 text-[13px] font-normal leading-[20px] text-gray-400",
);

const LikeMetaButton = render.button(
  "flex cursor-pointer items-center gap-4 border-none bg-transparent p-0",
);

const EditBox = render.div("flex flex-col gap-8");

const EditActions = render.div("flex justify-end gap-12");

const EditAction = render.button(
  "shrink-0 cursor-pointer border-none bg-transparent font-14-r text-gray-500",
);

const CommentArea = render.div(
  "sticky bottom-0 left-0 right-0 border-0 border-t border-solid border-border bg-white",
);

const ReplyBanner = render.div(
  "flex items-center justify-between border-0 border-b border-solid border-border px-20 py-8 font-12-r text-gray-500",
);

const ReplyText = render.span("");

const ReplyCancel = render.button(
  "cursor-pointer border-none bg-transparent font-12-r text-gray-400",
);

const CommentBar = render.form("flex items-end gap-8 bg-white px-20 py-12");

const SubmitButton = render.button(
  "h-44 shrink-0 cursor-pointer rounded-8 border-none bg-orange px-16 font-16-m text-white disabled:bg-gray-200",
);

export default CommunityDetailPage;
