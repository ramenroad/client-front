import { useParams } from "react-router-dom";
import { useArticleCommentListQuery, useArticleDetailQuery } from "../../hooks/queries/community";
import TopBar from "../../components/top-bar";
import {
  IconCommentArticle,
  IconEyeArticle,
  IconLike,
  IconLikeArticle,
  IconMore,
  IconShare,
} from "../../components/Icon";
import tw from "twin.macro";
import { parseCategory, parseCreatedAt } from "../../util";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ArticleCommentCard } from "./ArticleCommentCard";
import { WriteCommentSection } from "./WriteCommentSection";

export const CommunityDetailPage = () => {
  const { id } = useParams();
  const { articleDetailQuery } = useArticleDetailQuery(id);
  const { userInformationQuery } = useUserInformationQuery();
  const { articleCommentListQuery } = useArticleCommentListQuery(id);

  const isMine = useMemo(() => {
    return articleDetailQuery.data?.userId._id === userInformationQuery.data?._id;
  }, [articleDetailQuery.data?.userId._id, userInformationQuery.data?._id]);

  console.log(articleDetailQuery.data);
  console.log(articleCommentListQuery.data);

  return (
    <>
      <TopBar title="" additionalButton={<IconShare />} />

      {articleDetailQuery.data && (
        <Layout>
          <CategoryBadgeWrapper>
            <CategoryBadge>{parseCategory(articleDetailQuery.data.category)}</CategoryBadge>
          </CategoryBadgeWrapper>

          <UserInfoContainer>
            <UserInfoWrapper>
              <UserProfileImage src={articleDetailQuery.data.userId.profileImageUrl} />
              <UserInfo>
                <UserNickname>{articleDetailQuery.data.userId.nickname}</UserNickname>
                <UserCreatedAt>{parseCreatedAt(articleDetailQuery.data.createdAt)}</UserCreatedAt>
              </UserInfo>
            </UserInfoWrapper>
            {/* 신고 버튼 */}
            {!isMine && (
              <IconMoreWrapper>
                <StyledIconMore color="#A0A0A0" />
              </IconMoreWrapper>
            )}
          </UserInfoContainer>

          <ArticleWrapper>
            <ArticleTitle>{articleDetailQuery.data.title}</ArticleTitle>
            <ArticleBody>{articleDetailQuery.data.body}</ArticleBody>
            <ArticleImageSwiper>
              <Swiper spaceBetween={10} slidesPerView={1} className="article-swiper">
                {articleDetailQuery.data.ImageUrls.map((imageUrl) => (
                  <SwiperSlide key={imageUrl}>
                    <ArticleImage src={imageUrl} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </ArticleImageSwiper>
          </ArticleWrapper>

          <LikeButtonWrapper>
            <LikeButton>
              <IconLike width={20} height={20} />
              <LikeButtonText>좋아요</LikeButtonText>
              <LikeButtonCount>{articleDetailQuery.data.likeCount}</LikeButtonCount>
            </LikeButton>
          </LikeButtonWrapper>

          <ArticleInfoContainer>
            <ArticleInfoItemWrapper>
              <ArticleInfoItem>
                <IconEyeArticle width={16} height={16} />
                <ArticleInfoItemText>{articleDetailQuery.data.viewCount}</ArticleInfoItemText>
              </ArticleInfoItem>
              <ArticleInfoItem>
                <IconLikeArticle width={16} height={16} />
                <ArticleInfoItemText>{articleDetailQuery.data.likeCount}</ArticleInfoItemText>
              </ArticleInfoItem>
              <ArticleInfoItem>
                <IconCommentArticle width={16} height={16} />
                <ArticleInfoItemText>{articleDetailQuery.data.commentCount}</ArticleInfoItemText>
              </ArticleInfoItem>
            </ArticleInfoItemWrapper>

            {!isMine && (
              <IconMoreWrapper>
                <StyledIconMore color="#A0A0A0" />
              </IconMoreWrapper>
            )}
          </ArticleInfoContainer>

          <Divider />

          <ArticleCommentList>
            {articleCommentListQuery.data?.map((comment) => (
              <ArticleCommentCard key={comment._id} comment={comment} my={isMine} />
            ))}
          </ArticleCommentList>

          <WriteCommentSection />
        </Layout>
      )}
    </>
  );
};

const Layout = tw.div`
  flex flex-col
  w-full box-border
`;

const CategoryBadgeWrapper = tw.div`
  w-full pl-20 pt-16
`;

const CategoryBadge = tw.span`
  font-12-sb text-gray-500
  bg-border
  px-8 py-2
  rounded-4
  w-fit
  mb-6
`;

const UserInfoContainer = tw.div`
  box-border
  flex justify-between
  w-full
  px-20
  pt-8
`;

const UserInfoWrapper = tw.div`
  flex items-center gap-8
`;

const UserProfileImage = tw.img`
  w-36 h-36
  rounded-full
  object-cover
`;

const UserInfo = tw.div`
  flex flex-col
`;

const UserNickname = tw.span`
  font-14-m text-gray-500
`;

const UserCreatedAt = tw.span`
  pt-4  
  font-12-r text-gray-400
`;

const IconMoreWrapper = tw.div`
  cursor-pointer
  box-border
`;

const StyledIconMore = tw(IconMore)`
  w-20 h-20
  text-gray-400
`;

const ArticleWrapper = tw.div`
  box-border
  flex flex-col
  w-full
  px-20
  pt-12
`;

const ArticleTitle = tw.span`
  font-20-m text-gray-900
`;

const ArticleBody = tw.span`
  font-16-r text-gray-800
`;

const ArticleImageSwiper = tw.div`
  pt-16  
  w-full
  h-fit
  rounded-8
  overflow-hidden
`;

const ArticleImage = tw.img`
  w-full aspect-square
  object-cover
  rounded-8 border border-border
`;

const LikeButtonWrapper = tw.div`
  box-border
  flex justify-center

`;

const LikeButton = tw.div`
  flex items-center gap-4
  px-24
  py-10
  bg-border rounded-full
`;

const LikeButtonText = tw.span`
  font-14-r text-gray-800
  pl-4
`;

const LikeButtonCount = tw.span`
  font-14-m text-gray-800
  pl-6
`;

const ArticleInfoContainer = tw.div`
  box-border
  flex justify-between
  w-full
  px-20
  pt-40
`;

const ArticleInfoItemWrapper = tw.div`
  flex items-center gap-8
`;

const ArticleInfoItem = tw.div`
  flex items-center gap-4
`;

const ArticleInfoItemText = tw.span`
  font-14-r text-gray-400
`;

const Divider = tw.div`
  w-full box-border
  h-8 bg-divider
  mt-20
`;

const ArticleCommentList = tw.div`
  box-border
  flex flex-col
  w-full  
`;
