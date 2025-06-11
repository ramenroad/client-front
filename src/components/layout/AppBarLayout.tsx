import { Outlet } from "react-router-dom";
import AppBar from "../common/AppBar";
import tw from "twin.macro";
import { Footer } from "../common/Footer";

const AppBarLayout = () => {
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
