import styled from "@emotion/styled";
import noStoreImage from "@/assets/images/store.png";
import render from "@/shared/ui/render";

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

const Wrapper = render.div("flex flex-col items-center justify-center h-full");

const NoStoreImage = styled.img(({ type }: { type: "map" | "list" }) => [
  type === "map"
    ? {
        width: "80px",
        marginBottom: "8px",
      }
    : {
        width: "110px",
        height: "70px",
        marginBottom: "20px",
      },
]);

const NoStoreTitle = styled.div(({ type }: { type: "map" | "list" }) => [
  {
    color: "#414141",
  },
  type === "map"
    ? {
        fontSize: "16px",
        lineHeight: "24px",
        fontWeight: 600,
        marginBottom: "2px",
      }
    : {
        fontSize: "20px",
        lineHeight: "30px",
        fontWeight: 600,
        marginBottom: "12px",
      },
]);

const NoStoreDescription = styled.div(({ type }: { type: "map" | "list" }) => [
  {
    color: "#888888",
  },
  type === "map"
    ? {
        fontSize: "14px",
        lineHeight: "21px",
        fontWeight: 400,
      }
    : {
        fontSize: "16px",
        lineHeight: "24px",
        fontWeight: 400,
      },
]);

export default NoStoreBox;
