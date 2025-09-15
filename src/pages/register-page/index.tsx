import tw from "twin.macro";
import TopBar from "../../components/top-bar";
import { useEffect, useState } from "react";
import { useUserInfoMutation } from "../../hooks/mutation/useUserInfoMutation";
import styled from "@emotion/styled";
import { Button } from "../../components/common/Button";
import { AxiosError } from "axios";
import { RamenroadText } from "../../components/common/RamenroadText";

const RegisterPage = () => {
  const query = new URLSearchParams(window.location.search);
  const params = query.get("nickname");

  const [nickname, setNickname] = useState("");
  const [isNicknameAlreadyExists, setIsNicknameAlreadyExists] = useState(false);

  const [placeholder, setPlaceholder] = useState("최소 2-10자로 설정해주세요");
  const { updateNicknameMutation } = useUserInfoMutation();

  const handleClick = () => {
    updateNicknameMutation.mutate(nickname, {
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

const Layout = tw.div`
  flex flex-col
  w-full h-full
`;

const Wrapper = tw.div`
  flex flex-col
  w-full h-full
  px-20 box-border
`;

const DescriptionWrapper = tw.div`
  flex flex-col
  w-full
  font-20-m
  mt-20 mb-20
`;

const HighlightText = tw.span`
  text-orange
`;

const UpdateNicknameText = tw.span`
  font-16-m
`;

const InputWrapper = styled.div`
  ${tw`mb-394 h-44`}

  @media (min-width: 768px) {
    ${tw`mb-40`}
  }
`;

const Input = styled.input<{ isError?: boolean }>(({ isError }) => [
  tw`
    w-350
    box-border
    bg-border rounded-8 outline-none
    focus:outline-none
    px-20 py-10
    text-black font-16-m
    placeholder:text-gray-200
  `,
  isError ? tw`border-red border-solid border-2` : tw`border-none`,
]);

const ErrorMessage = tw(RamenroadText)`
  text-red
  mt-4
`;

export default RegisterPage;
