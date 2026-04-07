import { Outlet } from "react-router-dom";
import { usePageMemorize } from "@/shared/lib/use-page-memorize";
import AppBar from "@/widgets/navigation/app-bar";
import render from "@/shared/ui/render";

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

const MapScreen = render.main("w-full h-[calc(100dvh-56px)] relative overflow-hidden pb-56");

export default MapLayout;
