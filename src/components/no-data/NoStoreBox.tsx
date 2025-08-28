import tw from "twin.macro";
import noStoreImage from "../../assets/images/store.png";
import styled from "@emotion/styled";

interface NoStoreBoxProps {
  type?: "map" | "list";
}

const NoStoreBox = ({ type = "list" }: NoStoreBoxProps) => {
  return (
    <Wrapper>
      <NoStoreImage type={type} src={noStoreImage} />
      <NoStoreTitle type={type}>찾으시는 가게가 없어요</NoStoreTitle>
      <NoStoreDescription type={type}>다른 조건으로 다시 검색해보세요</NoStoreDescription>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center h-full
`;

const NoStoreImage = styled.img(({ type }: { type: "map" | "list" }) => [
  type === "map" ? tw`w-80 mb-8` : tw`w-110 h-70 mb-20`,
]);

const NoStoreTitle = styled.div(({ type }: { type: "map" | "list" }) => [
  tw`text-gray-800`,
  type === "map" ? tw`font-16-sb mb-2` : tw`font-20-sb mb-12`,
]);

const NoStoreDescription = styled.div(({ type }: { type: "map" | "list" }) => [
  tw`text-gray-500`,
  type === "map" ? tw`font-14-r` : tw`font-16-r`,
]);

export default NoStoreBox;
