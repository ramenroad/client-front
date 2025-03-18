import tw from "twin.macro";
import TopBar from "../../components/common/TopBar";
import styled from "@emotion/styled";
import { CameraIcon } from "../../components/Icon";

const MyPage = () => {
  return (
    <>
      <TopBar title="내 정보" />
      <Wrapper>
        <ProfileWrapper>
          <ProfileImageWrapper>
            <ProfileImage />
            <ProfileImageEditButton>
              <CameraIcon />
            </ProfileImageEditButton>
          </ProfileImageWrapper>
          <ProfileInfoWrapper>
            <ProfileInfo>라멘로드</ProfileInfo>
          </ProfileInfoWrapper>
        </ProfileWrapper>
        <ProfileDescriptionWrapper>
          <ProfileDescription>
            <Label>닉네임</Label>
            <LabelDescription>라멘로드</LabelDescription>
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
    </>
  );
};

const Wrapper = tw.div`
  flex flex-col
  w-full h-full
`;

const ProfileWrapper = tw.div`
  flex flex-col justify-center items-center
  w-full
`;

const ProfileImageWrapper = tw.div`
  relative mt-20 mb-22
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
  border border-solid border-1 border-border mx-20 rounded-8 mt-32 mb-233
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

const LogoutText = tw.span`
  text-gray-500
  font-14-m
  text-center
  cursor-pointer
`;

export default MyPage;
