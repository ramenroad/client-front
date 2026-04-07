import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { IconHome, IconMapAppBar, IconUser } from "@/shared/ui/icon";
import { useSignInStore } from "@/entities/viewer/model";
import render from "@/shared/ui/render";

const AppBar = () => {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname.split("/")[1];
  const { isSignIn } = useSignInStore();

  return (
    <AppBarWrapper>
      <AppBarContainer>
        <AppBarItem onClick={() => navigate("/")}>
          <IconHome selected={currentPath === ""} />
          <ItemText selected={currentPath === ""}>홈</ItemText>
        </AppBarItem>

        <AppBarItem onClick={() => navigate("/map")}>
          <IconMapAppBar selected={currentPath === "map"} />
          <ItemText selected={currentPath === "map"}>지도</ItemText>
        </AppBarItem>
        <AppBarItem
          onClick={() => {
            navigate(isSignIn ? "/mypage" : "/login");
          }}
        >
          <IconUser selected={currentPath === "mypage" || currentPath === "user-review"} />
          <ItemText selected={currentPath === "mypage" || currentPath === "user-review"}>마이</ItemText>
        </AppBarItem>
      </AppBarContainer>
    </AppBarWrapper>
  );
};

const AppBarWrapper = render.div(
  "box-border fixed bottom-0 left-1/2 -translate-x-1/2 w-388 h-62 bg-white border-0 border-t border-border border-solid shadow-[0_-4px_4px_-4px_rgba(0,0,0,0.08)] z-50",
);

const AppBarContainer = render.div("flex items-center justify-center w-full h-full pt-6 pb-12 px-20 box-border");

const AppBarItem = render.div("flex flex-col items-center gap-1 py-[2.5px] w-54 h-44 cursor-pointer box-border");

const ItemText = styled.span<{ selected: boolean }>(({ selected }) => [
  {
    fontSize: "12px",
    lineHeight: "12px",
    fontWeight: 400,
    color: "#cfcfcf",
    height: "12px",
  },
  selected && {
    color: "#111111",
  },
]);

export default AppBar;
