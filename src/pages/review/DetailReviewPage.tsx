import TopBar from "@/shared/ui/top-bar";
import render from "@/shared/ui/render";

export const DetailReviewPage = () => {
  return (
    <Wrapper>
      <Header>
        <TopBar title="리뷰 상세" />
      </Header>
    </Wrapper>
  );
};

const Wrapper = render.div("flex flex-col pb-40");

const Header = render.div("");
