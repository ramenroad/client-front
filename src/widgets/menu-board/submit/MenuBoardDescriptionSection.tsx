import styled from "@emotion/styled";
import render from "@/shared/ui/render";

interface MenuBoardDescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const MenuBoardDescriptionSection = ({
  description,
  onDescriptionChange,
}: MenuBoardDescriptionSectionProps) => {
  const handleDescriptionChange = (value: string) => {
    if (value.length <= 50) {
      onDescriptionChange(value);
    }
  };

  return (
    <Section>
      <TextAreaContainer>
        <DescriptionTextArea
          value={description}
          onChange={(event) => handleDescriptionChange(event.target.value)}
          placeholder={"(선택) 메뉴판에 대한 설명을 입력해 주세요.\n이미지와 함께 게재됩니다."}
          maxLength={50}
        />
        <CharacterCount>
          <TypedCount>{description.length}</TypedCount>/50
        </CharacterCount>
      </TextAreaContainer>
    </Section>
  );
};

const Section = render.div("relative box-border flex flex-col gap-16 px-20");

const TextAreaContainer = render.div(
  "relative flex flex-col gap-4 rounded-[8px] border border-solid border-transparent bg-border px-12 pt-10 pb-36 outline-none box-border focus-within:(border-orange)",
);

const DescriptionTextArea = styled.textarea({
  display: "flex",
  height: "110px",
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "14px",
  lineHeight: "21px",
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

const CharacterCount = render.div("absolute bottom-14 right-12 font-14-r text-gray-400");

const TypedCount = render.span("font-14-r text-black");
