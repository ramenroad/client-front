import tw from "twin.macro";
import noResultImage from "../../assets/images/no-results.png";
import { RamenroadText } from "../common/RamenroadText";

interface NoResultBoxProps {
  actionButton?: React.ReactNode;
}

const NoResultBox = ({ actionButton }: NoResultBoxProps) => {
  return (
    <Wrapper>
      <NoResultImage src={noResultImage} />
      <DescriptionWrapper>
        <NoResultTitle size={20} weight="sb">
          검색 결과가 없어요
        </NoResultTitle>
        <NoResultDescription size={16} weight="r">
          <span>찾으시는 정보가 없나요?</span>
          <br />
          <span>라이징에 제보해 주세요!</span>
        </NoResultDescription>
      </DescriptionWrapper>
      {actionButton}
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center h-full
  gap-20
`;

const NoResultImage = tw.img`
  w-110 h-70
`;

const DescriptionWrapper = tw.div`
  flex flex-col items-center justify-center
`;

const NoResultTitle = tw(RamenroadText)`
  text-gray-800 mb-6
  text-center
`;

const NoResultDescription = tw(RamenroadText)`
  text-gray-500
  text-center
`;

export default NoResultBox;
