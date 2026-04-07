import { Outlet } from "react-router-dom";
import { usePageMemorize } from "@/shared/lib/usePageMemorize";
import AppBar from "@/widgets/navigation/app-bar";
import { Footer } from "@/widgets/footer";
import render from "@/shared/ui/render";

const AppBarLayout = () => {
  usePageMemorize();

  return (
    <>
      <Outlet />
      <Footer />
      <Space />
      <AppBar />
    </>
  );
};

const Space = render.div("h-55 min-h-55");

export default AppBarLayout;
