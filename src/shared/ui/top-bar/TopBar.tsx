import type { ReactNode } from "react";
import { IconBack } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

interface TopBarProps {
  title: string;
  navigate?: string;
  onBackClick?: () => void;
  tooltip?: ReactNode;
  icon?: ReactNode;
  onIconClick?: () => void;
}

const TopBar = ({ title, navigate: navigatePath, onBackClick, tooltip, icon, onIconClick }: TopBarProps) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    if (navigatePath) {
      window.location.href = navigatePath;
      return;
    }

    window.history.back();
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

const TopBarWrapper = render.section("flex items-center justify-center h-44");

const IconWrapper = render.div("absolute left-20 w-24 h-24");

const StyledIconBack = render.extend(IconBack, "cursor-pointer");

const HeaderTitle = render.span("font-16-sb text-primary");

const AdditionalIconWrapper = render.div("absolute right-20 w-24 h-24 cursor-pointer");

export default TopBar;
