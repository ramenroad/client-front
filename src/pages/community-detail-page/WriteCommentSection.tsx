import tw from "twin.macro";

export const WriteCommentSection = () => {
  return (
    <WriteCommentSectionWrapper>
      <Textarea placeholder="댓글을 입력하세요" />
      <Button>등록</Button>
    </WriteCommentSectionWrapper>
  );
};

const WriteCommentSectionWrapper = tw.div`
  fixed bottom-0 absolute-center-x w-390 max-h-120 h-72
  flex items-center gap-4
  shadow-md
  box-border
  px-20
  pt-12
  border-t border-border
  bg-white
  z-10
`;

const Textarea = tw.textarea`
  bg-border
  rounded-8
  px-16 py-12
  border-none
  text-black
  font-16-r
  w-full box-border
  focus:outline-none
  resize-none
  max-h-96
  h-48
`;

const Button = tw.button`
  bg-transparent
  text-black rounded-8 font-14-m
  border border-solid border-[#EBEBED]
  outline-none
  cursor-pointer
  px-16 py-12
  whitespace-nowrap
`;
