import { Outlet } from "react-router-dom";
import tw from "twin.macro";
import { usePageMemorize } from "@/shared/lib/use-page-memorize";
import AppBar from "@/widgets/navigation/app-bar";

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

const MapScreen = tw.main`
  w-full h-[calc(100dvh-56px)] relative overflow-hidden
  pb-56
`;

export default MapLayout;
