import TopBar from "@/shared/ui/top-bar";
import { IconArrowRight, IconReview, IconUnSignInUser, IconUnSignInUserProfile } from "@/shared/ui/icon";
import { useUserInformationQuery } from "@/entities/viewer/model";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

const MyPage = () => {
  const { userInformationQuery } = useUserInformationQuery();

  const navigate = useNavigate();

  return (
    <Layout>
      <TopBar title="마이페이지" navigate="/" />
      {userInformationQuery.data ? (
        <>
          <CardLayout
            type="button"
            onClick={() => {
              if (userInformationQuery.data) {
                navigate("/information");
              }
            }}
          >
            <CardLeftSection>
              <WelcomeText>반가워요!</WelcomeText>
              <UserInfoWrapper>
                <UserName>{userInformationQuery.data?.nickname}님</UserName>
                <IconArrowRight />
              </UserInfoWrapper>
            </CardLeftSection>

            <CardRightSection>
              {userInformationQuery.data?.profileImageUrl ? (
                <UserProfileImage src={userInformationQuery.data?.profileImageUrl} />
              ) : (
                <IconUnSignInUserProfile />
              )}
            </CardRightSection>
          </CardLayout>
          <MyReviewContainer type="button" onClick={() => navigate(`/user-review/${userInformationQuery.data?._id}`)}>
            <IconReview />
            <MyReviewText size={16} weight="m">
              작성한 리뷰
            </MyReviewText>
            <ArrowRightForReview />
          </MyReviewContainer>
        </>
      ) : (
        <SignInWrapper>
          <IconUnSignInUser />
          <SignInDescription>
            <LoginText>로그인 후 이용해주세요.</LoginText>
            <LoginDescription>간편 로그인으로 쉽게 가능해요.</LoginDescription>
          </SignInDescription>
          <Button onClick={() => navigate("/login")}>로그인/회원가입</Button>
        </SignInWrapper>
      )}
    </Layout>
  );
};

const Layout = render.section("flex flex-col items-center gap-20 w-full h-full px-20 box-border");

const CardLayout = render.button(
  "flex h-112 w-350 cursor-pointer items-center justify-between rounded-[8px] border border-solid border-gray-100 bg-white px-20 text-left font-20-m shadow-none outline-none",
);

const CardLeftSection = render.section("flex flex-col gap-4");

const CardRightSection = render.section("flex flex-col items-center justify-center");

const WelcomeText = render.span("text-orange");

const UserName = render.span("text-inherit");

const UserInfoWrapper = render.section("flex items-center gap-4");

const UserProfileImage = render.img("w-64 h-64 rounded-full");

const SignInWrapper = render.section("flex flex-col items-center w-full h-full mt-20");

const SignInDescription = render.section("flex flex-col gap-4 items-center text-gray-800 mt-24 mb-40");

const LoginText = render.span("font-20-m");

const LoginDescription = render.span("font-18-r");

const MyReviewContainer = render.button(
  "flex w-full cursor-pointer items-center gap-8 rounded-[8px] bg-[#F9F9F9] px-12 py-20 text-left shadow-none outline-none border-none",
);

const MyReviewText = render.extend(RaisingText, "text-gray-900");

const ArrowRightForReview = render.extend(IconArrowRight, "ml-auto");

export default MyPage;
