import { RamenyaTag } from "@/shared/ui/tag";
import render from "@/shared/ui/render";

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

const Wrapper = render.div("flex flex-col cursor-pointer gap-10");

const GroupListRoundedWrapper = render.div(
  "flex flex-col cursor-pointer items-center bg-gray-50 rounded-[8px] px-20 pt-20 pb-12 gap-10",
);

const GroupListImageWrapper = render.div("relative");

const GroupListLocation = render.span(
  "box-border w-34 h-34 absolute top-0 -right-8 flex items-center justify-center font-12-sb text-white bg-orange rounded-[45px] whitespace-nowrap text-ellipsis",
);

const GroupListImage = render.img("w-160 h-160 rounded-[8px] border border-solid border-gray-100");

const GroupListRoundedImage = render.img("w-120 h-120 rounded-full");

const GroupListTitle = render.span("font-16-m text-black");

const TextBox = render.div("flex flex-col gap-2");
