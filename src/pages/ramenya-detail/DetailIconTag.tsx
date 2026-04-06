import React from "react";
import tw from "twin.macro";

interface DetailIconTagProps {
  icon: React.ReactNode;
  text: string;
}

const DetailIconTag = ({ icon, text }: DetailIconTagProps) => {
  return (
    <Wrapper>
      <IconWrapper>{icon}</IconWrapper>
      <TextWrapper>{text}</TextWrapper>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex items-center justify-center gap-4
`;

const IconWrapper = tw.div`
  flex items-center justify-center
`;

const TextWrapper = tw.div`
  w-60 font-14-r text-gray-400 whitespace-nowrap
`;

export default DetailIconTag;
