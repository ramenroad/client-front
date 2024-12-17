import tw from "twin.macro";
import { IconBack } from "../../components/Icons";

const MainPage = () => {
  return <StyledDiv>
    <IconBack />
  </StyledDiv>;
};

const StyledDiv = tw.div`
  flex
`;

export default MainPage;
