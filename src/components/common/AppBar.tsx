import { useLocation, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import { IconHome, IconUser } from "../Icon";
import styled from "@emotion/styled";

const AppBar = () => {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  return (
    <AppBarWrapper>
      <AppBarContainer>
        <AppBarItem onClick={() => navigate("/")}>
          <IconHome selected={currentPath === "/"} />
          <ItemText selected={currentPath === "/"}>홈</ItemText>
        </AppBarItem>
        <AppBarItem onClick={() => navigate("/mypage")}>
          <IconUser selected={currentPath === "/mypage"} />
          <ItemText selected={currentPath === "/mypage"}>마이</ItemText>
        </AppBarItem>
      </AppBarContainer>
    </AppBarWrapper>
  );
};

const AppBarWrapper = tw.div`
  box-border
  fixed bottom-0 -translate-x-1/2
  w-388 h-48
  bg-white
  border-0 border-t border-border border-solid
  shadow-[0_-4px_4px_-4px_rgba(0,0,0,0.08)]
`;

const AppBarContainer = tw.div`
  flex items-center justify-center
  w-full h-full
  px-20 box-border
`;

const AppBarItem = tw.div`
  flex flex-col items-center justify-center
  w-54 h-full
  cursor-pointer
  box-border px-15 py-3
`;

const ItemText = styled.span<{ selected: boolean }>(({ selected }) => [
  tw`font-12-r mt-1 text-gray-200`,
  selected && tw`text-black`,
]);

export default AppBar;
