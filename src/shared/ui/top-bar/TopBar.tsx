import tw from "twin.macro";
import { useNavigate } from "react-router-dom";
import { IconBack } from "@/shared/ui/icon";

interface TopBarProps {
  title: string;
  navigate?: string;
  onBackClick?: () => void;
  tooltip?: React.ReactNode;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const TopBar = ({ title, navigate: navigatePath, onBackClick, tooltip, icon, onIconClick }: TopBarProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    if (navigatePath) {
      navigate(navigatePath);
      return;
    }

    navigate(-1);
  };

  return (
    <TopBarWrapper>
      <IconWrapper>
        <StyledIconBack onClick={handleBackClick} />
      </IconWrapper>
      <HeaderTitle>{title}</HeaderTitle>
      {tooltip && tooltip}
      {icon && <AdditionalIconWrapper onClick={onIconClick}>{icon}</AdditionalIconWrapper>}
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

const AdditionalIconWrapper = tw.div`
  absolute right-20
  w-24 h-24
  cursor-pointer
`;

export default TopBar;
