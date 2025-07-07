import tw from "twin.macro";
import AppBar from "../../components/common/AppBar";
import { NaverMap } from "../../components/map/NaverMap";
import { useState } from "react";
import { GetRamenyaListWithGeolocationParams } from "../../api/map";
import { useRamenyaListWithGeolocationQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";
import RamenyaCard from "../../components/common/RamenyaCard";

const MapPage = () => {
  const [currentGeolocation, setCurrentGeolocation] = useState<GetRamenyaListWithGeolocationParams>({
    latitude: 0,
    longitude: 0,
    radius: 0,
  });

  const { data: ramenyaList } = useRamenyaListWithGeolocationQuery(currentGeolocation);
  const [selectedMarker, setSelectedMarker] = useState<Ramenya | null>(null);

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
          selectedMarker={selectedMarker}
          onMarkerClick={(marker) => {
            setSelectedMarker(null);
            setSelectedMarker(marker.data);
          }}
          resultList={ramenyaList?.ramenyas.map((ramenya) => ({
            id: ramenya._id,
            data: ramenya,
            element: (
              <RamenyaCard
                key={ramenya._id}
                isMapCard={true}
                _id={ramenya._id}
                name={ramenya.name}
                rating={ramenya.rating}
                latitude={ramenya.latitude}
                longitude={ramenya.longitude}
                address={ramenya.address}
                businessHours={ramenya.businessHours}
                genre={ramenya.genre}
                reviewCount={ramenya.reviewCount}
                thumbnailUrl={ramenya.thumbnailUrl}
                width={"350px"}
              />
            ),
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
