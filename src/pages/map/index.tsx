import tw from "twin.macro";
import AppBar from "../../components/common/AppBar";
import { NaverMap } from "../../components/map/NaverMap";
import { useState } from "react";
import { GetRamenyaListWithGeolocationParams } from "../../api/map";
import { useRamenyaListWithGeolocationQuery } from "../../hooks/queries/useRamenyaListQuery";

const MapPage = () => {
  const [currentGeolocation, setCurrentGeolocation] = useState<GetRamenyaListWithGeolocationParams>({
    latitude: 0,
    longitude: 0,
    radius: 0,
  });

  const { data: ramenyaList } = useRamenyaListWithGeolocationQuery(currentGeolocation);

  console.log(ramenyaList);

  return (
    <>
      <MapScreen>
        <NaverMap onRefresh={(data) => setCurrentGeolocation(data)} />
      </MapScreen>
      <AppBar />
    </>
  );
};

const MapScreen = tw.main`
  w-full h-[calc(100vh-56px)]
`;

export default MapPage;
