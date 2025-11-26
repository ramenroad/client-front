import tw from "twin.macro";
import { Comment } from "../../types/community";
import { parseCreatedAt } from "../../util";
import { IconLikeArticle, IconReply } from "../../components/Icon";
import styled from "@emotion/styled";
import { divide } from "lodash";

interface ArticleCommentCardProps {
  comment: Comment;
  my: boolean;
}

export const ArticleCommentCard = ({ comment, my }: ArticleCommentCardProps) => {
  console.log("comment", comment);
  return (
    <>
      <CardContainer depth={comment.depth}>
        {comment.depth > 0 && (
          <ReplyIconWrapper>
            <IconReply width={16} height={16} />
          </ReplyIconWrapper>
        )}
        <CardWrapper>
          <CommentUserInfoWrapper>
            <CommentUserInfo>
              <CommentUserProfileImage src={comment.userId.profileImageUrl} />
              <CommentUserNickname>{comment.userId.nickname}</CommentUserNickname>
              <CommentUserCreatedAt>{parseCreatedAt(comment.createdAt)}</CommentUserCreatedAt>
              {my && <CommentIsWriter>작성자</CommentIsWriter>}
            </CommentUserInfo>
          </CommentUserInfoWrapper>

          <CommentBody>{comment.body}</CommentBody>

          <CommentActionWrapper>
            <span>답글 달기</span>
            <IconLikeWrapper>
              <IconLikeArticle width={20} height={20} />
            </IconLikeWrapper>
            <CommentLikeCount>{comment.likeCount}</CommentLikeCount>
          </CommentActionWrapper>
        </CardWrapper>
      </CardContainer>

      {comment.replies.map((reply) => (
        <ArticleCommentCard key={reply._id} comment={reply} my={my} />
      ))}
    </>
  );
};

// const CardContainer = tw.div`
//   flex flex-col gap-12
//   w-full
//   p-20 box-border
//   bg-white
//   cursor-pointer
//   border-b border-divider
// `;

const CardContainer = styled.div<{ depth: number }>(({ depth }) => [
  tw`
    flex
    w-full
    p-20 box-border
    bg-white
    cursor-pointer
    border-0 border-solid border-b border-divider
  `,
  depth > 0 && tw`bg-[#FCFCFC]`,
]);

const CardWrapper = tw.div`
  flex flex-col
`;

const ReplyIconWrapper = tw.div`
  pt-4 pr-4
`;

const CommentUserInfoWrapper = tw.div`
  flex-1
  flex flex-col
  min-w-0
`;

const CommentUserInfo = tw.div`
  flex items-center gap-8
`;

const CommentUserProfileImage = tw.img`
  w-24 h-24
  rounded-full
  object-cover
`;

const CommentUserNickname = tw.span`
  font-14-m text-gray-500
`;

const CommentUserCreatedAt = tw.span`
  font-12-r text-gray-400
`;

const CommentIsWriter = tw.span`
  font-12-m text-orange
`;

const CommentBody = tw.span`
  font-16-r text-gray-800
  pt-6 pb-10
`;

const CommentActionWrapper = tw.div`
  flex items-center font-14-r text-gray-400
`;

const IconLikeWrapper = tw.div`
  pl-12 flex items-center
`;

const CommentLikeCount = tw.span`
  pl-2 font-12-m
`;
