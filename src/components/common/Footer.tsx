import tw from "twin.macro";
import { ramenroadEmail } from "../../constants";

export const Footer = () => {
  return (
    <Wrapper>
      <Title>팀 라멘로드</Title>
      <ContactWrapper>
        <span>제휴 및 협업 문의</span>
        <Email href={`mailto:${ramenroadEmail}`}>{ramenroadEmail}</Email>
      </ContactWrapper>
      <Description>Copyright © 2025 라멘로드 All rights reserved.</Description>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  w-full h-134 p-20 box-border
  bg-footer text-gray-500 font-14-r
`;

const Title = tw.div`
  flex items-center h-27 font-14-sb mb-4
`;

const Email = tw.a`
  font-14-m link:text-gray-500 no-underline
`;

const ContactWrapper = tw.div`
  flex gap-8 mt-4 mb-24
`;

const Description = tw.div`
  font-12-r
`;
