import type { ReactNode } from "react";
import { useAppNavigate } from "@/shared/navigation";
import { IconBack } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

interface TopBarProps {
  title: string;
  navigate?: string;
  onBackClick?: () => void;
  tooltip?: ReactNode;
  icon?: ReactNode;
  onIconClick?: () => void;
  hideBack?: boolean;
}

const TopBar = ({ title, navigate: navigatePath, onBackClick, tooltip, icon, onIconClick, hideBack }: TopBarProps) => {
  const navigate = useAppNavigate();

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
      {!hideBack && (
        <IconWrapper>
          <StyledIconBack onClick={handleBackClick} />
        </IconWrapper>
      )}
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

// 아이콘(24x24)뿐 아니라 텍스트 칩도 담을 수 있게 폭은 내용에 맡긴다(min-w-24로 기존 아이콘 타겟 크기는 보존).
const AdditionalIconWrapper = render.div(
  "absolute right-20 flex h-24 w-auto min-w-24 cursor-pointer items-center justify-end",
);

export default TopBar;
