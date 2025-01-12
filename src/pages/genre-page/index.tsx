import { useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/useRamenyaListQuery.ts";

import { IconBack } from "../../components/Icon/index.tsx";

import RamenyaCard from "../../components/common/RamenyaCard.tsx";

export const GenrePage = () => {
  const { genre } = useParams();
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
            <IconBack />
          </IconWrapper>
          <span>{genre}</span>
        </Header>
        <InformationWrapper>
          <InformationHeader>가게 정보</InformationHeader>
          <RamenyaListWrapper>
            {ramenyaList?.map((ramenya) => (
              <>
                <RamenyaCard key={ramenya._id} ramenya={ramenya} />
                <SubLine />
              </>
            ))}
          </RamenyaListWrapper>
        </InformationWrapper>
      </Wrapper>
    </Layout>
  );
};

const Layout = tw.section`
  flex justify-center
`;

const Wrapper = tw.div`
  flex flex-col items-center justify-center box-border
  w-390
  border-0 border-x border-border border-solid
`;

const Header = tw.section`
  flex items-center justify-center
  font-16-sb
  w-full h-44 relative
  px-20 mb-20 box-border
`;

const IconWrapper = tw.div`
  absolute left-20
  w-24 h-24
`;

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const InformationWrapper = tw.section`
  flex flex-col items-center justify-center w-full
`;

const InformationHeader = tw.span`
  px-20 font-14-sb self-start
`;

const RamenyaListWrapper = tw.section`
  flex flex-col items-center justify-center
  w-full
`;

export default GenrePage;
