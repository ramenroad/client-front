import { useLocation, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import { IconHome, IconUser } from "../Icon";
import styled from "@emotion/styled";
import { useSignInStore } from "../../states/sign-in";

const AppBar = () => {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const { isSignIn } = useSignInStore();

  return (
    <AppBarWrapper>
      <AppBarContainer>
        <AppBarItem onClick={() => navigate("/")}>
          <IconHome selected={currentPath === "/"} />
          <ItemText selected={currentPath === "/"}>홈</ItemText>
        </AppBarItem>
        <AppBarItem
          onClick={() => {
            if (isSignIn) {
              navigate("/mypage");
            } else {
              navigate("/login");
            }
          }}
        >
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
  w-388 h-56
  bg-white
  border-0 border-t border-border border-solid
  shadow-[0_-4px_4px_-4px_rgba(0,0,0,0.08)]
  z-50
`;

const AppBarContainer = tw.div`
  flex items-center justify-center
  w-full h-full
  px-20 box-border
`;

const AppBarItem = tw.div`
  flex flex-col items-center justify-center gap-1
  pt-4 pb-8
  w-54 h-full
  cursor-pointer
  box-border
`;

const ItemText = styled.span<{ selected: boolean }>(({ selected }) => [
  tw`font-12-r text-gray-200 h-12 leading-12`,
  selected && tw`text-black`,
]);

export default AppBar;
