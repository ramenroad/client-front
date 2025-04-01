import tw from "twin.macro";
import TopBar from "../../components/common/TopBar";
import { IconArrowRight } from "../../components/Icon";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { useAuthMutation } from "../../hooks/mutation/useAuthMutation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const MyPage = () => {
  const { userInformationQuery } = useUserInformationQuery();
  const { logout } = useAuthMutation();
  const navigate = useNavigate();

  return (
    <Layout>
      <TopBar title="마이페이지" navigate="/main" />
      <CardLayout
        onClick={() => {
          if (userInformationQuery.data) {
            navigate("/information");
          } else {
            navigate("/login");
          }
        }}
      >
        <CardLeftSection>
          {userInformationQuery.data ? (
            <>
              <WelcomeText>반가워요!</WelcomeText>
              <UserInfoWrapper>
                <span>{userInformationQuery.data?.nickname}님</span>
                <IconArrowRight />
              </UserInfoWrapper>
            </>
          ) : (
            <WelcomeText>로그인 후 이용해주세요.</WelcomeText>
          )}
        </CardLeftSection>
        <CardRightSection>
          <UserProfileImage src={userInformationQuery.data?.profileImageUrl} />
        </CardRightSection>
      </CardLayout>
      {userInformationQuery.data && (
        <LogoutText onClick={() => logout.mutate()}>로그아웃</LogoutText>
      )}
    </Layout>
  );
};

const Layout = tw.section`
  flex flex-col items-center gap-20
  h-full
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

export default MyPage;
