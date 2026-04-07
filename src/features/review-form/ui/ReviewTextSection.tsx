import styled from "@emotion/styled";
import { Controller, type Control } from "react-hook-form";
import render from "@/shared/ui/render";
import type { ReviewFormValues } from "../model";

interface ReviewTextSectionProps {
  control: Control<ReviewFormValues>;
  minLength: number;
  maxLength?: number;
}

export const ReviewTextSection = ({ control, minLength, maxLength = 1000 }: ReviewTextSectionProps) => {
  return (
    <Section>
      <Title>어떤 점이 좋았나요?</Title>
      <Controller
        name="review"
        control={control}
        rules={{ required: true, minLength }}
        render={({ field, fieldState }) => (
          <>
            <TextAreaContainer>
              <ReviewTextArea
                {...field}
                placeholder={`최소 ${minLength}자 이상 입력해주세요`}
                maxLength={maxLength}
              />
              <CharacterCount>
                <TypedCount>{field.value?.length ?? 0}</TypedCount>/{maxLength}
              </CharacterCount>
            </TextAreaContainer>
            {fieldState.error && <ErrorMessage>최소 {minLength}자 이상 입력해주세요</ErrorMessage>}
          </>
        )}
      />
    </Section>
  );
};

const Section = render.div("relative mt-36 flex flex-col gap-16");

const Title = render.div("font-16-m text-black");

const TextAreaContainer = render.div(
  "relative box-border flex flex-col gap-4 rounded-[8px] border border-solid border-transparent bg-border px-12 pt-10 pb-36 outline-none focus-within:(border-orange)",
);

const ReviewTextArea = styled.textarea({
  display: "flex",
  height: "214px",
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 400,
  fontFamily: '"Pretendard", sans-serif',
  resize: "none",
  outline: "none",
  color: "#111111",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#d9d9d9",
    borderRadius: "3px",
  },
});

const CharacterCount = render.div("absolute right-12 bottom-14 font-14-r text-gray-400");

const TypedCount = render.span("font-14-r text-black");

const ErrorMessage = render.div("font-12-r text-red");
