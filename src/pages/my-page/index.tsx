import tw from "twin.macro";
import TopBar from "../../components/common/TopBar";
import { IconArrowRight, IconReview, IconUnSignInUser, IconUnSignInUserProfile } from "../../components/Icon";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { useAuthMutation } from "../../hooks/mutation/useAuthMutation";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { RamenroadText } from "../../components/common/RamenroadText";

const MyPage = () => {
  const { userInformationQuery } = useUserInformationQuery();

  const { logout } = useAuthMutation();
  const navigate = useNavigate();

  return (
    <Layout>
      <TopBar title="마이페이지" navigate="/" />
      {userInformationQuery.data ? (
        <>
          <CardLayout
            onClick={() => {
              if (userInformationQuery.data) {
                navigate("/information");
              }
            }}
          >
            <CardLeftSection>
              <WelcomeText>반가워요!</WelcomeText>
              <UserInfoWrapper>
                <span>{userInformationQuery.data?.nickname}님</span>
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
          <MyReviewContainer onClick={() => navigate(`/user-review/${userInformationQuery.data?._id}`)}>
            <IconReview />
            <RamenroadText size={16} weight="m">
              작성한 리뷰
            </RamenroadText>
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
      {userInformationQuery.data && <LogoutText onClick={() => logout.mutate()}>로그아웃</LogoutText>}
    </Layout>
  );
};

const Layout = tw.section`
  flex flex-col items-center gap-20
  w-full h-full
  px-20 box-border
`;

const CardLayout = tw.section`
  flex items-center justify-between
  w-350 h-112
  font-20-m
  border border-solid border-border rounded-8
  px-20 box-border
  cursor-pointer
`;

const CardLeftSection = tw.section`
  flex flex-col gap-4
`;

const CardRightSection = tw.section`
  flex flex-col items-center justify-center
`;

const WelcomeText = tw.span`
  text-orange
`;

const UserInfoWrapper = tw.section`
  flex items-center  gap-4
`;

const UserProfileImage = tw.img`
  w-64 h-64 rounded-full
`;

// Start of Selection
const LogoutText = tw.span`
  text-gray-500
  font-14-m
  text-center justify-self-end
  cursor-pointer mb-40 mt-auto
`;

const SignInWrapper = tw.section`
  flex flex-col items-center
  w-full h-full
  mt-20
`;

const SignInDescription = tw.section`
  flex flex-col gap-4
  items-center
  text-gray-800
  mt-24 mb-40
`;

const LoginText = tw.span`
  font-20-m
`;

const LoginDescription = tw.span`
  font-18-r
`;

const MyReviewContainer = tw.section`
  cursor-pointer
  w-full flex gap-8 items-center
  box-border
  px-12 py-20
  bg-[#F9F9F9]
  rounded-8
`;

const ArrowRightForReview = tw(IconArrowRight)`
  ml-auto
`;

export default MyPage;
