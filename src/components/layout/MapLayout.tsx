import { Outlet } from "react-router-dom";
import tw from "twin.macro";
import AppBar from "../app-bar";

const MapLayout = () => {
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
