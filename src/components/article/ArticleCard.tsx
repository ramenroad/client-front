import tw from "twin.macro";
import { IconCommentArticle, IconEyeArticle, IconLikeArticle } from "../Icon";

interface User {
  _id: string;
  nickname: string;
  profileImageUrl: string;
}

interface Board {
  _id: string;
  userId: User;
  category: string;
  title: string;
  body: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  ImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

interface ArticleCardProps {
  board: Board;
  onClick?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ board, onClick }) => {
  const hasImage = board.ImageUrls.length > 0;
  const thumbnailUrl = hasImage ? board.ImageUrls[0] : null;

  return (
    <CardContainer onClick={onClick}>
      <CardWrapper>
        <CategoryBadge>{board.category}</CategoryBadge>
        <ContentWrapper>
          <VerticalLayout>
            <Title>{board.title}</Title>
            <Body>{board.body}</Body>
          </VerticalLayout>

          <ThumbnailWrapper>
            <ThumbnailImage src={thumbnailUrl ?? ""} alt={board.title} />
          </ThumbnailWrapper>
        </ContentWrapper>

        <InfoRow>
          <UserInfo>
            <ProfileImage src={board.userId.profileImageUrl} alt={board.userId.nickname} />
            <Nickname>{board.userId.nickname}</Nickname>
          </UserInfo>

          <StatsWrapper>
            <StatItem>
              <IconEyeArticle width={16} height={16} />
              <StatText>{board.viewCount}</StatText>
            </StatItem>
            <StatItem>
              <IconLikeArticle width={16} height={16} />
              <StatText>{board.likeCount}</StatText>
            </StatItem>
            <StatItem>
              <IconCommentArticle width={16} height={16} />
              <StatText>{board.commentCount}</StatText>
            </StatItem>
          </StatsWrapper>
        </InfoRow>
      </CardWrapper>
    </CardContainer>
  );
};

const CardContainer = tw.div`
  flex items-start gap-12
  w-full
  p-20 box-border
  bg-white
  cursor-pointer
  border-b border-divider
`;

const CardWrapper = tw.div`
  flex-1
  flex flex-col
  min-w-0
`;

const ContentWrapper = tw.div`
  flex gap-16
`;

const VerticalLayout = tw.div`
  flex flex-col
`;

const CategoryBadge = tw.span`
  font-12-sb text-gray-500
  bg-border
  px-8 py-2
  rounded-4
  w-fit
  mb-6
`;

const Title = tw.span`
  font-16-sb text-black
  line-clamp-1
  mb-4
`;

const Body = tw.span`
  font-14-r text-gray-600
  line-clamp-2
`;

const InfoRow = tw.div`
  flex items-center justify-between
  mt-18
`;

const UserInfo = tw.div`
  flex items-center gap-8
`;

const ProfileImage = tw.img`
  w-24 h-24
  rounded-full
  object-cover
`;

const Nickname = tw.span`
  font-13-m text-gray-500
`;

const StatsWrapper = tw.div`
  flex items-center gap-12
`;

const StatItem = tw.div`
  flex items-center gap-4
`;

const StatText = tw.span`
  font-12-r text-gray-500
`;

const ThumbnailWrapper = tw.div`
  flex-shrink-0
  w-80 h-80
  rounded-8
  overflow-hidden
  bg-gray-100
`;

const ThumbnailImage = tw.img`
  w-full h-full
  object-cover
`;
