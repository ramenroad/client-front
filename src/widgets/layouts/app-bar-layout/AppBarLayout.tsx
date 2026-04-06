import { Outlet } from "react-router-dom";
import tw from "twin.macro";
import { usePageMemorize } from "@/shared/lib/use-page-memorize";
import AppBar from "@/widgets/navigation/app-bar";
import { Footer } from "@/widgets/footer";

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

const Space = tw.div`
  h-55 min-h-55
`;

export default AppBarLayout;
