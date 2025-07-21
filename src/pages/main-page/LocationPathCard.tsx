import { useNavigate } from "react-router-dom";
import tw from "twin.macro";
import { useMobileState } from "../../hooks/common/useMobileState.ts";
import styled from "@emotion/styled/macro";
import { RamenroadText } from "../../components/common/RamenroadText.tsx";

interface LocationPathCardProps {
  location: string;
}

export const LocationPathCard = ({ location }: LocationPathCardProps) => {
  const navigate = useNavigate();
  const { isMobile } = useMobileState();

  return (
    <Wrapper isMobile={isMobile} onClick={() => navigate(`/location/${location}`)}>
      <LocationPathText size={14} weight="r">
        {location}
      </LocationPathText>
    </Wrapper>
  );
};

const Wrapper = styled.div(({ isMobile }: { isMobile: boolean }) => [
  tw`
    flex items-center justify-center
    border-solid border-1 border-divider
    rounded-4 w-110 h-50
    cursor-pointer`,
  !isMobile && tw`hover:(bg-orange text-white) active:(bg-orange text-white)`,
]);

const LocationPathText = tw(RamenroadText)`
  flex
`;
