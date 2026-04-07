import React from "react";
import TopBar from "@/shared/ui/top-bar";
import styled from "@emotion/styled";
import { IconCamera, IconArrowRight, IconUnSignInUserProfile } from "@/shared/ui/icon";
import { useNavigate } from "react-router-dom";
import { useUserInformationQuery } from "@/entities/viewer/model";
import { useUserInfoMutation } from "@/features/profile/model";
import { useAuthMutation } from "@/features/auth/model";
import render from "@/shared/ui/render";

const InformationPage = () => {
  const navigate = useNavigate();

  const { userInformationQuery } = useUserInformationQuery();
  const { update } = useUserInfoMutation();
  const { remove: logout } = useAuthMutation();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImageFile", file);
    update.mutate(formData);
  };

  return (
    <Layout>
      <TopBar title="내 정보" navigate="/mypage" />
      <Wrapper>
        <ProfileWrapper>
          <ProfileImageWrapper onClick={() => document.getElementById("profileImageInput")?.click()}>
            {userInformationQuery.data?.profileImageUrl ? (
              <ProfileImage src={userInformationQuery.data?.profileImageUrl} alt="profile" />
            ) : (
              <IconUnSignInUserProfile />
            )}
            <ProfileImageEditButton>
              <IconCamera />
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
            <ProfileInfo>{userInformationQuery.data?.nickname}</ProfileInfo>
          </ProfileInfoWrapper>
        </ProfileWrapper>
        <ProfileDescriptionWrapper>
          <ProfileDescription>
            <Label>닉네임</Label>
            <NicknameEditWrapper onClick={() => navigate(`/register?nickname=${userInformationQuery.data?.nickname}`)}>
              <LabelDescription>{userInformationQuery.data?.nickname}</LabelDescription>
              <IconArrowRight />
            </NicknameEditWrapper>
          </ProfileDescription>
          <ProfileDescription isLast>
            <Label>이메일</Label>
            <LabelDescription>{userInformationQuery.data?.email}</LabelDescription>
          </ProfileDescription>
        </ProfileDescriptionWrapper>
        <SignoutWrapper>
          <LogoutText onClick={() => logout.mutate()}>로그아웃</LogoutText>
          <Divider />
          <LogoutText onClick={() => navigate("/withdraw")}>회원탈퇴</LogoutText>
        </SignoutWrapper>
      </Wrapper>
    </Layout>
  );
};

const Layout = render.div("box-border w-full h-full flex flex-col");

const Wrapper = render.div("flex flex-col w-full flex-1 box-border");

const ProfileWrapper = render.div("flex flex-col justify-center items-center w-full");

const ProfileImageWrapper = render.div("relative mt-20 mb-22 cursor-pointer");

const ProfileImage = render.img("w-64 h-64 bg-gray-100 rounded-full");

const ProfileImageEditButton = render.div(
  "w-22 h-22 absolute bottom-0 right-0 bg-gray-200 rounded-full border border-solid border-2 border-white flex justify-center items-center",
);

const ProfileImageInput = render.input("hidden");

const ProfileInfoWrapper = render.div("flex w-full font-20-m");

const ProfileInfo = render.div("flex flex-col justify-center items-center w-full h-full");

const ProfileDescriptionWrapper = render.div("border border-solid border-gray-100 mx-20 rounded-[8px] mt-32");

const NicknameEditWrapper = render.div("flex gap-4 items-center cursor-pointer");

const ProfileDescription = styled.div<{ isLast?: boolean }>(({ isLast }) => [
  {
    height: "57px",
    borderBottom: "1px solid #e7e7e7",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 500,
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  isLast && {
    borderBottom: "none",
  },
]);

const Label = render.span("");

const LabelDescription = render.span("text-gray-500");

// Start of Selection
const LogoutText = render.span("text-gray-500 font-14-m text-center justify-self-end cursor-pointer");

const SignoutWrapper = render.div("flex justify-center items-center gap-8 w-full mt-auto mb-40");

const Divider = render.div("bg-gray-100 h-10 w-1");

export default InformationPage;
