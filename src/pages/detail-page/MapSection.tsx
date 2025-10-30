import { IconMap, IconArrowRight } from "../../components/Icon";
import tw from "twin.macro";
import KakaoMap from "./KaKaoMap";

interface MapSectionProps {
  latitude: number | undefined;
  longitude: number | undefined;
  mapButtons: {
    type: "naver" | "kakao" | "google";
    url: string | undefined;
    label: string;
  }[];
  onOpenMapURL: (url: string) => void;
}

export const MapSection = ({ latitude, longitude, mapButtons, onOpenMapURL }: MapSectionProps) => {
  return (
    <>
      {latitude && longitude && (
        <LocationWrapper>
          <LocationTitle>위치</LocationTitle>
          <KakaoMap latitude={latitude} longitude={longitude} />
        </LocationWrapper>
      )}

      <MapRedirectButtonContainer>
        {mapButtons
          .filter((button) => button.url)
          .map((button) => (
            <MapRedirectButton
              key={button.type}
              onClick={() => {
                if (button.url) {
                  onOpenMapURL(button.url);
                }
              }}
            >
              <IconMap type={button.type} />
              <span>{button.label}</span>
              <StyledIconArrowRight color="#888888" />
            </MapRedirectButton>
          ))}
      </MapRedirectButtonContainer>
    </>
  );
};

// 스타일 컴포넌트들
const LocationTitle = tw.div`
  font-18-sb pt-32
`;

const LocationWrapper = tw.div`
  flex flex-col gap-16 px-20
`;

const MapRedirectButtonContainer = tw.div`
  flex flex-col px-20 gap-8 mt-16
`;

const MapRedirectButton = tw.button`
  bg-transparent box-border
  border border-solid border-gray-100 rounded-8
  flex items-center gap-10
  py-14 px-20 h-52
  font-14-r
  text-black
  cursor-pointer
`;

const StyledIconArrowRight = tw(IconArrowRight)`
  ml-auto
`;
