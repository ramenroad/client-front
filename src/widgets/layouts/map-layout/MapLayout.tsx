import { Outlet } from "react-router-dom";
import { usePageMemorize } from "@/shared/lib/usePageMemorize";
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

const MapScreen = render.main("relative h-[100dvh] w-full overflow-hidden box-border pb-56");

export default MapLayout;
