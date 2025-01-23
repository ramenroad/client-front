import { useNavigate, useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/useRamenyaListQuery.ts";

import { IconBack } from "../../components/Icon/index.tsx";

import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";
import styled from "@emotion/styled";

export const GenrePage = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const ramenyaListQuery = useRamenyaListQuery({
    type: "genre",
    value: genre!,
  });
  const ramenyaList = ramenyaListQuery.data;

  return (
    <Layout>
      <Wrapper>
        <Header>
          <IconWrapper>
            <StyledIconBack onClick={() => navigate(-1)} />
          </IconWrapper>
          <span>{genre}</span>
        </Header>
        <Line />
        <InformationWrapper>
          {ramenyaList?.length === 0 ? (
            <NoStoreBox />
          ) : (
            <>
              <InformationHeader>가게 정보</InformationHeader>
              <RamenyaListWrapper isEmpty={ramenyaList?.length === 0}>
                {ramenyaList?.map((ramenya, index) => (
                  <>
                    <RamenyaCard key={ramenya._id} ramenya={ramenya} />
                    {index !== ramenyaList.length - 1 && <SubLine />}
                  </>
                ))}
              </RamenyaListWrapper>
            </>
          )}
        </InformationWrapper>
      </Wrapper>
    </Layout>
  );
};

const Layout = tw.section`
  flex justify-center h-screen
`;

const Wrapper = tw.div`
  flex flex-col items-center box-border
  w-390
  border-y-0 border-border border-solid
  h-full
`;

const Header = tw.section`
  flex items-center justify-center
  font-16-sb
  w-full h-44 relative
  px-20 box-border
`;

const IconWrapper = tw.div`
  absolute left-20
  w-24 h-24
`;

const StyledIconBack = tw(IconBack)`
  cursor-pointer
`;

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const Line = tw.div`
  w-full h-1 bg-divider
`;

const InformationWrapper = tw.section`
  flex flex-col w-full overflow-y-auto flex-1
  pt-16
`;

const InformationHeader = tw.span`
  px-20 font-14-sb self-start
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(
  ({ isEmpty }) => [
    tw`flex flex-col items-center justify-center w-full`,
    isEmpty && tw`h-full`,
  ],
);

export default GenrePage;
