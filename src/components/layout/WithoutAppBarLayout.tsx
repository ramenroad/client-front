import { Outlet } from "react-router-dom";
import { Footer } from "../common/Footer";

const WithoutAppBarLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default WithoutAppBarLayout;
