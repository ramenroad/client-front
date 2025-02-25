import tw from "twin.macro";
import { useMobileState } from "../../hooks/common/useMobileState.ts";
import styled from "@emotion/styled/macro";

interface LocationPathBoxProps  {
  location: string;
  onClick: () => void;
}

export const LocationPathBox = ({ location, onClick }: LocationPathBoxProps) => {
  const { isMobile } = useMobileState();

  return (
    <Wrapper
      isMobile={isMobile}
      onClick={onClick}
    >
      <LocationPathText>{location}</LocationPathText>
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

const LocationPathText = tw.div`
  flex font-14-r 
`;
