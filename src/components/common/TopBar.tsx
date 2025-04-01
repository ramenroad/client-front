import tw from "twin.macro";
import { IconBack } from "../Icon";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  title: string;
  navigate?: string;
  onBackClick?: () => void;
}

const TopBar = (props: TopBarProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (props.onBackClick) {
      props.onBackClick();
    } else {
      if (props.navigate) {
        navigate(props.navigate);
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <TopBarWrapper>
      <IconWrapper>
        <StyledIconBack onClick={handleBackClick} />
      </IconWrapper>
      <HeaderTitle>{props.title}</HeaderTitle>
    </TopBarWrapper>
  );
};

const TopBarWrapper = tw.section`
  flex items-center justify-center
  h-44
`;

const IconWrapper = tw.div`
  absolute left-20
  w-24 h-24
`;

const StyledIconBack = tw(IconBack)`
  cursor-pointer
  `;

const HeaderTitle = tw.span`
  font-16-sb text-black
`;

export default TopBar;
