import tw from "twin.macro";
import noStoreImage from "../../assets/images/store.png";

const NoStoreBox = () => {
  return (
    <Wrapper>
      <NoStoreImage src={noStoreImage} />
      <NoStoreTitle>찾으시는 가게가 없어요</NoStoreTitle>
      <NoStoreDescription>다른 조건으로 다시 검색해보세요</NoStoreDescription>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center
`;

const NoStoreImage = tw.img`
  w-110 h-70 mb-20
`;

const NoStoreTitle = tw.div`
  font-20-sb mb-12 text-gray-800
`;

const NoStoreDescription = tw.div`
  font-16-r text-gray-500
`;

export default NoStoreBox;
