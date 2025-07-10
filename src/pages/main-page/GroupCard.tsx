import tw from "twin.macro";
import { RamenyaTag } from "../../components/common/tag";

interface GroupCardProps {
  title: string;
  subTitle: string;
  image: string;
  type: number;
  onClick: () => void;
  region: string;
}

export const GroupCard = ({ title, subTitle, image, onClick, type, region }: GroupCardProps) => {
  switch (type) {
    case 1:
      return (
        <Wrapper onClick={onClick}>
          <GroupListImage src={image} />
          <TextBox>
            <GroupListTitle>{title}</GroupListTitle>
            <RamenyaTag>{subTitle}</RamenyaTag>
          </TextBox>
        </Wrapper>
      );
    case 2:
      return (
        <GroupListRoundedWrapper onClick={onClick}>
          <GroupListImageWrapper>
            <GroupListRoundedImage src={image} />
            <GroupListLocation>{region.slice(0, 2)}</GroupListLocation>
          </GroupListImageWrapper>
          <GroupListTitle>{title}</GroupListTitle>
        </GroupListRoundedWrapper>
      );
  }
};

const Wrapper = tw.div`
  flex flex-col cursor-pointer
  gap-10
`;

const GroupListRoundedWrapper = tw.div`
  flex flex-col cursor-pointer items-center
  bg-gray-50 rounded-8
  px-20 pt-20 pb-12
  gap-10
`;

const GroupListImageWrapper = tw.div`
  relative
`;

const GroupListLocation = tw.span`
  box-border w-34 h-34
  absolute top-0 -right-8
  flex items-center justify-center
  font-12-sb text-white
  bg-orange rounded-45
  whitespace-nowrap text-ellipsis
`;

const GroupListImage = tw.img`
  w-160 h-160 rounded-8
  border border-solid border-gray-100
`;

const GroupListRoundedImage = tw.img`
  w-120 h-120 rounded-full
`;

const GroupListTitle = tw.span`
  font-16-m text-black
`;

const TextBox = tw.div`
  flex flex-col 
`;
