import { useNavigate, useParams } from 'react-router-dom';
import { IconBack } from '../../components/Icons';
import tw from 'twin.macro';

export const DetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
  return (
    <Wrapper>
        <Header>
            <StyledIconBack onClick={() => navigate(-1)}/>
        </Header>
        <MarketDetailWrapper>
            <MarketDetailTitle>{id}</MarketDetailTitle>
            <MarketDetailBox>
                <MarketDetailBoxTitle>주소</MarketDetailBoxTitle>
                <MarketDetailBoxContent>서울특별시 강남구 테헤란로 14길 57 1층</MarketDetailBoxContent>
            </MarketDetailBox>
        </MarketDetailWrapper>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  flex flex-col items-center justify-center gap-16 w-350
`;

const Header = tw.div`
  flex items-center justify-center
  px-20 py-10
`;

const StyledIconBack = tw(IconBack)`
  cursor-pointer
`;

const MarketDetailWrapper = tw.div`
  flex flex-col p-20
`;

const MarketDetailTitle = tw.div`
  font-22-r
`;

const MarketDetailBox = tw.div`
  flex gap-16
`;

const MarketDetailBoxTitle = tw.div`
  font-14-r text-gray-400
`;

const MarketDetailBoxContent = tw.div`
  font-14-r
`;

export default DetailPage;