import tw from "twin.macro";
import AppBar from "../../components/common/AppBar";
import { NaverMap } from "../../components/map/NaverMap";
import { useState } from "react";
import { GetRamenyaListWithGeolocationParams } from "../../api/map";
import { useRamenyaListWithGeolocationQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";

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
        <NaverMap<Ramenya>
          onRefresh={(data) => setCurrentGeolocation(data)}
          markers={ramenyaList?.ramenyas.map((ramenya) => ({
            position: {
              lat: ramenya.latitude,
              lng: ramenya.longitude,
            },
            data: ramenya,
            title: ramenya.name,
          }))}
        />
      </MapScreen>
      <AppBar />
    </>
  );
};

const MapScreen = tw.main`
  w-full h-[calc(100vh-56px)]
`;

export default MapPage;
