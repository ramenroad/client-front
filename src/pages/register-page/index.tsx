import tw from "twin.macro";
import TopBar from "../../components/common/TopBar";
import { useEffect, useMemo, useState } from "react";
import { useUserInfoMutation } from "../../hooks/mutation/useUserInfoMutation";
import styled from "@emotion/styled";

const RegisterPage = () => {
  const query = new URLSearchParams(window.location.search);
  const params = query.get("nickname");

  const [nickname, setNickname] = useState("");
  const { updateNicknameMutation } = useUserInfoMutation();

  const disabled = useMemo(() => nickname.length > 10, [nickname]);

  const handleClick = () => {
    updateNicknameMutation.mutate(nickname);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  useEffect(() => {
    if (params) {
      setNickname(params);
    }
  }, [params]);

  return (
    <>
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
            <span>새로운 닉네임을 입력해주세요</span>
          )}
        </DescriptionWrapper>
        <InputWrapper>
          <Input
            warning={disabled}
            placeholder="최소 2-10자로 설정해주세요"
            value={nickname}
            onChange={handleChange}
            minLength={2}
            maxLength={11}
          />
        </InputWrapper>
        <Button
          disabled={nickname.length < 2 || nickname.length > 10}
          onClick={handleClick}
        >
          {params ? "변경 완료" : "완료"}
        </Button>
      </Wrapper>
    </>
  );
};

const Wrapper = tw.div`
  flex flex-col
  w-full h-full
  px-20 box-border
`;

const DescriptionWrapper = tw.div`
  flex flex-col
  w-full
  font-20-m
  mt-20 mb-16
`;

const HighlightText = tw.span`
  text-orange
`;

const InputWrapper = tw.div`
  mb-394
`;

// const Input = tw.input`
//   w-350 h-44
//   box-border
//   bg-border rounded-8 border-none outline-none
//   focus:outline-none
//   px-20 py-10
//   text-black font-16-m
// `;

const Input = styled.input(({ warning }: { warning: boolean }) => [
  tw`
    w-350 h-44
    box-border
    bg-border rounded-8 border-none outline-none
    focus:outline-none
    px-20 py-10
    text-black font-16-m
  `,
  warning &&
    tw`
    border border-solid border-red
  `,
]);

const Button = tw.button`
  w-350 h-44
  bg-orange rounded-8 border-none
  text-white
  mb-40
  disabled:bg-gray-200 disabled:cursor-not-allowed cursor-pointer
`;

export default RegisterPage;
