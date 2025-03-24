import tw from "twin.macro";
import TopBar from "../../components/common/TopBar";
import { useState } from "react";

const RegisterPage = () => {
  const [nickname, setNickname] = useState("");

  const handleClick = () => {
    console.log(nickname);
  };

  return (
    <>
      <TopBar title="" />
      <Wrapper>
        <DescriptionWrapper>
          <span>앞으로 사용하실</span>
          <div>
            <HighlightText>닉네임</HighlightText>을 설정해주세요
          </div>
        </DescriptionWrapper>
        <InputWrapper>
          <Input
            placeholder="최소 2-10자로 설정해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onClick={handleClick}
            minLength={2}
            maxLength={10}
          />
        </InputWrapper>
        <Button disabled={nickname.length < 2 || nickname.length > 10}>
          완료
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

const Input = tw.input`
  w-350 h-44
  box-border
  bg-border rounded-8 border-none outline-none
  focus:outline-none
  px-20 py-10
  text-black font-16-m
`;

const Button = tw.button`
  w-350 h-44
  bg-orange rounded-8 border-none
  text-white
  mb-40
  disabled:bg-gray-200 disabled:cursor-not-allowed
`;

export default RegisterPage;
