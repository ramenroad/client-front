import { Outlet } from "react-router-dom";
import tw from "twin.macro";
import AppBar from "../app-bar";
import { usePageMemorize } from "../../hooks/common/usePageMemorize";

const MapLayout = () => {
  usePageMemorize();

  return (
    <>
      <MapScreen>
        <Outlet />
      </MapScreen>
      <AppBar />
    </>
  );
};

export default MapLayout;

const MapScreen = tw.main`
  w-full h-[calc(100dvh-56px)] relative overflow-hidden
  pb-56
`;
