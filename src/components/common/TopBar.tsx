import tw from "twin.macro";
import { IconBack } from "../Icon";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  title: string;
}

const TopBar = (props: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <TopBarWrapper>
      <IconWrapper>
        <StyledIconBack onClick={() => navigate(-1)} />
      </IconWrapper>
      <span>{props.title}</span>
    </TopBarWrapper>
  );
};

const TopBarWrapper = tw.section`
  flex items-center justify-between
  h-44
`;

const IconWrapper = tw.div`
  absolute left-20
  w-24 h-24
`;

const StyledIconBack = tw(IconBack)`
  cursor-pointer
`;

export default TopBar;
