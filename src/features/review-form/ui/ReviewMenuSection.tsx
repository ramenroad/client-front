import styled from "@emotion/styled";
import { type KeyboardEvent } from "react";
import render from "@/shared/ui/render";

interface ReviewMenuSectionProps {
  menuList: string[];
  selectedMenus: string[];
  customMenuInput: string;
  hasError?: boolean;
  onMenuClick: (menu: string) => void;
  onCustomMenuInputChange: (value: string) => void;
  onCustomMenuAdd: () => void;
  onCustomMenuKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export const ReviewMenuSection = ({
  menuList,
  selectedMenus,
  customMenuInput,
  hasError = false,
  onMenuClick,
  onCustomMenuInputChange,
  onCustomMenuAdd,
  onCustomMenuKeyDown,
}: ReviewMenuSectionProps) => {
  return (
    <>
      <MenuWrapper>
        <MenuTitleBox>
          <MenuTitle>어떤 메뉴를 드셨나요?</MenuTitle>
          <MenuSubTitle>최대 2개 선택 가능</MenuSubTitle>
        </MenuTitleBox>
        {menuList.length > 0 && (
          <MenuTabContainer>
            {menuList.map((menu, index) => (
              <MenuTab key={`${menu}-${index}`} selected={selectedMenus.includes(menu)} onClick={() => onMenuClick(menu)}>
                {menu}
              </MenuTab>
            ))}
          </MenuTabContainer>
        )}
        {hasError && <ErrorMessage>메뉴를 선택해주세요</ErrorMessage>}
      </MenuWrapper>

      <MenuAddWrapper>
        <MenuInputContainer>
          <MenuInput
            value={customMenuInput}
            onChange={(event) => onCustomMenuInputChange(event.target.value)}
            onKeyDown={onCustomMenuKeyDown}
            placeholder="메뉴명을 입력해주세요"
          />
          <MenuAddButton type="button" onClick={onCustomMenuAdd}>
            추가
          </MenuAddButton>
        </MenuInputContainer>
      </MenuAddWrapper>
    </>
  );
};

const MenuWrapper = render.div("mt-32 flex flex-col gap-16");

const MenuTitleBox = render.div("flex items-center gap-4");

const MenuTitle = render.div("font-16-m text-black");

const MenuSubTitle = render.div("font-12-r text-gray-400");

const MenuTabContainer = render.div("flex flex-wrap gap-8");

interface MenuTabProps {
  selected: boolean;
}

const MenuTab = styled.button<MenuTabProps>(({ selected }) => [
  {
    display: "flex",
    width: "fit-content",
    height: "29px",
    boxSizing: "border-box",
    alignItems: "center",
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 400,
    padding: "6px 12px",
    borderRadius: "50px",
    cursor: "pointer",
    border: "none",
  },
  selected
    ? {
        backgroundColor: "#fff4eb",
        color: "#ff5e00",
      }
    : {
        backgroundColor: "#f6f6f6",
        color: "#a0a0a0",
      },
]);

const MenuAddWrapper = render.div("mt-16 flex flex-col gap-12");

const MenuInputContainer = render.div("flex items-center gap-4");

const MenuInput = render.input(
  "box-border h-44 flex-1 rounded-[8px] border border-solid border-transparent bg-border px-12 py-10 font-16-r text-black outline-none focus-within:(border-orange)",
);

const MenuAddButton = render.button(
  "h-43 w-67 rounded-[8px] border border-solid border-gray-100 bg-white px-10 py-8 text-black",
);

const ErrorMessage = render.div("mt-4 font-12-r text-red");
