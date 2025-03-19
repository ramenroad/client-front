import tw from "twin.macro";
import TopBar from "../../components/common/TopBar";
import styled from "@emotion/styled";
import { CameraIcon, IconArrowRight } from "../../components/Icon";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  };

  return (
    <Layout>
      <TopBar title="내 정보" />
      <Wrapper>
        <ProfileWrapper>
          <ProfileImageWrapper
            onClick={() =>
              document.getElementById("profileImageInput")?.click()
            }
          >
            <ProfileImage />
            <ProfileImageEditButton>
              <CameraIcon />
            </ProfileImageEditButton>
            <ProfileImageInput
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: "none" }}
            />
          </ProfileImageWrapper>
          <ProfileInfoWrapper>
            <ProfileInfo>라멘로드</ProfileInfo>
          </ProfileInfoWrapper>
        </ProfileWrapper>
        <ProfileDescriptionWrapper>
          <ProfileDescription>
            <Label>닉네임</Label>
            <NicknameEditWrapper onClick={() => navigate("/register")}>
              <LabelDescription>라멘로드</LabelDescription>
              <IconArrowRight />
            </NicknameEditWrapper>
          </ProfileDescription>
          <ProfileDescription>
            <Label>이름</Label>
            <LabelDescription>김종운</LabelDescription>
          </ProfileDescription>
          <ProfileDescription isLast>
            <Label>이메일</Label>
            <LabelDescription>kangkang@gmail.com</LabelDescription>
          </ProfileDescription>
        </ProfileDescriptionWrapper>
        <LogoutText>로그아웃</LogoutText>
      </Wrapper>
    </Layout>
  );
};

const Layout = tw.div`
  box-border w-full h-full flex flex-col
`;

const Wrapper = tw.div`
  flex flex-col
  w-full flex-1
  box-border
`;

const ProfileWrapper = tw.div`
  flex flex-col justify-center items-center
  w-full
`;

const ProfileImageWrapper = tw.div`
  relative mt-20 mb-22 cursor-pointer
`;

const ProfileImage = tw.div`
  w-64 h-64
  bg-gray-100 rounded-full
`;

const ProfileImageEditButton = tw.div`
  w-22 h-22 absolute bottom-0 right-0
  bg-gray-200 rounded-full
  border border-solid border-2 border-white
  flex justify-center items-center
`;

const ProfileImageInput = tw.input`
  hidden
`;

const ProfileInfoWrapper = tw.div`
  flex
  w-full
  font-20-m
`;

const ProfileInfo = tw.div`
  flex flex-col justify-center items-center
  w-full h-full
`;

const ProfileDescriptionWrapper = tw.div`
  border border-solid border-1 border-border mx-20 rounded-8 mt-32
`;

const NicknameEditWrapper = tw.div`
  flex gap-4 items-center cursor-pointer
`;

const ProfileDescription = styled.div<{ isLast?: boolean }>(({ isLast }) => [
  tw`
  h-57 border-b border-solid border-border border-t-0 border-x-0
  flex justify-between items-center
  font-14-m px-20
  `,
  isLast && tw`border-b-0`,
]);

const Label = tw.span`
  
`;

const LabelDescription = tw.span`
  text-gray-500
`;

// Start of Selection
const LogoutText = tw.span`
  text-gray-500
  font-14-m
  text-center justify-self-end
  cursor-pointer mb-40 mt-auto
`;

export default MyPage;
