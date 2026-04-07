import TopBar from "@/shared/ui/top-bar";
import React, { useEffect, useState } from "react";
import { useUserInfoMutation } from "@/features/profile/model";
import styled from "@emotion/styled";
import { Button } from "@/shared/ui/button";
import { AxiosError } from "axios";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

const RegisterPage = () => {
  const query = new URLSearchParams(window.location.search);
  const params = query.get("nickname");

  const [nickname, setNickname] = useState("");
  const [isNicknameAlreadyExists, setIsNicknameAlreadyExists] = useState(false);

  const [placeholder, setPlaceholder] = useState("최소 2-10자로 설정해주세요");
  const { updateNickname } = useUserInfoMutation();

  const handleClick = () => {
    updateNickname.mutate(nickname, {
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.data.statusCode === 409) {
            setIsNicknameAlreadyExists(true);
          }
        }
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNicknameAlreadyExists) {
      setIsNicknameAlreadyExists(false);
    }
    setNickname(e.target.value);
  };

  useEffect(() => {
    if (params) {
      setPlaceholder(params);
    }
  }, [params]);

  return (
    <Layout>
      <TopBar title="" navigate={params ? "/mypage" : undefined} />
      <Wrapper>
        <DescriptionWrapper>
          {!params ? (
            <>
              <span>앞으로 사용하실</span>
              <div>
                <HighlightText>닉네임</HighlightText>을 설정해주세요
              </div>
            </>
          ) : (
            <UpdateNicknameText>새로운 닉네임을 입력해주세요</UpdateNicknameText>
          )}
        </DescriptionWrapper>
        <InputWrapper>
          <Input
            placeholder={placeholder}
            value={nickname}
            onChange={handleChange}
            minLength={2}
            maxLength={11}
            isError={isNicknameAlreadyExists}
          />
          {isNicknameAlreadyExists && (
            <ErrorMessage size={12} weight="m">
              이미 존재하는 닉네임입니다.
            </ErrorMessage>
          )}
        </InputWrapper>
        <Button disabled={nickname.length < 2 || nickname.length > 10 || nickname === params} onClick={handleClick}>
          {params ? "변경 완료" : "완료"}
        </Button>
      </Wrapper>
    </Layout>
  );
};

const Layout = render.div("flex flex-col w-full h-full");

const Wrapper = render.div("flex flex-col w-full h-full px-20 box-border");

const DescriptionWrapper = render.div("flex flex-col w-full font-20-m mt-20 mb-20");

const HighlightText = render.span("text-orange");

const UpdateNicknameText = render.span("font-16-m");

const InputWrapper = styled.div`
  margin-bottom: 394px;
  height: 44px;

  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Input = styled.input<{ isError?: boolean }>(({ isError }) => [
  {
    width: "350px",
    boxSizing: "border-box",
    backgroundColor: "#f4f4f5",
    borderRadius: "8px",
    outline: "none",
    padding: "10px 20px",
    color: "#111111",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 500,
    "::placeholder": {
      color: "#cfcfcf",
    },
  },
  isError ? { border: "2px solid #ff5454" } : { border: "none" },
]);

const ErrorMessage = render.extend(RaisingText, "text-red mt-4");

export default RegisterPage;
