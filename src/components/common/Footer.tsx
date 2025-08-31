import tw from "twin.macro";
import { ramenroadEmail } from "../../constants";
import { RamenroadText } from "./RamenroadText";
import { Line } from "./Line";
import { IconInstagram } from "../Icon";

export const Footer = () => {
  return (
    <Wrapper>
      <Contact>
        <FooterTitle size={14} weight="sb">
          팀 라이징
        </FooterTitle>
        <ContactWrapper>
          <span>제휴 및 협업 문의</span>
          <Email href={`mailto:${ramenroadEmail}`}>{ramenroadEmail}</Email>
        </ContactWrapper>
      </Contact>
      <TermsAndConditions>
        <Terms>
          <Link
            size={12}
            weight="r"
            onClick={() => window.open("https://kim-junseo.notion.site/21649b91c9c580318d75e7941d6def9c", "_blank")}
          >
            서비스 이용 약관
          </Link>
          <Divider vertical />
          <Link
            size={12}
            weight="sb"
            onClick={() =>
              window.open("https://kim-junseo.notion.site/21849b91c9c580d18097dfe035e990c2?source=copy_link", "_blank")
            }
          >
            개인정보 처리방침
          </Link>
          <Divider vertical />
          <Link
            size={12}
            weight="r"
            onClick={() =>
              window.open(
                "https://kim-junseo.notion.site/2025-08-9-24949b91c9c580b48549e8dc5195cdff?source=copy_link",
                "_blank",
              )
            }
          >
            위치 정보 이용약관
          </Link>
        </Terms>
        <RamenroadText size={12} weight="r">
          Copyright © 2025 라이징 All rights reserved.
        </RamenroadText>
      </TermsAndConditions>
      <InstagramIcon footer onClick={() => window.open("https://www.instagram.com/ra.ising/", "_blank")} />
    </Wrapper>
  );
};

const Wrapper = tw.div`
  w-full h-212 p-20 box-border
  bg-footer text-gray-500 font-14-r
  flex flex-col gap-24
`;

const FooterTitle = tw(RamenroadText)`
  leading-27
`;

const Contact = tw.div`
  flex flex-col gap-4
`;

const Email = tw.a`
  font-14-m link:text-gray-500 no-underline
`;

const ContactWrapper = tw.div`
  flex gap-8
`;

const Terms = tw.div`
  flex gap-4 items-center
`;

const TermsAndConditions = tw.div`
  flex flex-col gap-4
`;

const Link = tw(RamenroadText)`
  cursor-pointer
`;

const InstagramIcon = tw(IconInstagram)`
  cursor-pointer
  min-h-40 min-w-40 mt-[-8px]
`;

const Divider = tw(Line)`
  h-10
`;
