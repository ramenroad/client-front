import TopBar from "@/shared/ui/top-bar";
import { type ChangeEvent, type ComponentProps, useState } from "react";
import { useUserInfoMutation } from "@/features/profile/model";
import { Button } from "@/shared/ui/button";
import { AxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

const RegisterPage = () => {
  const query = new URLSearchParams(window.location.search);
  const params = query.get("nickname");

  const [nickname, setNickname] = useState("");
  const [isNicknameAlreadyExists, setIsNicknameAlreadyExists] = useState(false);

  const placeholder = params ?? "최소 2-10자로 설정해주세요";
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNicknameAlreadyExists) {
      setIsNicknameAlreadyExists(false);
    }
    setNickname(e.target.value);
  };

  return (
    <Layout>
      <TopBar title="" navigate={params ? "/mypage" : undefined} />
      <Wrapper>
        <DescriptionWrapper>
          {!params ? (
            <>
              <DescriptionLine>앞으로 사용하실</DescriptionLine>
              <DescriptionHighlightLine>
                <HighlightText>닉네임</HighlightText>을 설정해주세요
              </DescriptionHighlightLine>
            </>
          ) : (
            <UpdateNicknameText>새로운 닉네임을 입력해주세요</UpdateNicknameText>
          )}
        </DescriptionWrapper>
        <InputWrapper>
          <NicknameInput
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

const DescriptionLine = render.span("text-inherit");

const DescriptionHighlightLine = render.div("text-inherit");

const HighlightText = render.span("text-orange");

const UpdateNicknameText = render.span("font-16-m");

const InputWrapper = render.div("mb-[394px] h-44 md:mb-40");

interface NicknameInputProps extends ComponentProps<"input"> {
  isError?: boolean;
}

const InputField = render.input();

const NicknameInput = ({ isError = false, className, ...props }: NicknameInputProps) => {
  return (
    <InputField
      {...props}
      className={twMerge(
        "w-350 box-border rounded-[8px] bg-[#f4f4f5] px-20 py-10 font-16-m text-black outline-none placeholder:text-[#cfcfcf]",
        isError ? "border-2 border-[#ff5454]" : "border-none",
        className ?? "",
      )}
    />
  );
};

const ErrorMessage = render.extend(RaisingText, "text-red mt-4");

export default RegisterPage;
