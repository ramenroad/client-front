import { useNavigate } from "react-router-dom";
import { useMobileState } from "@/shared/lib/use-mobile-state.ts";
import styled from "@emotion/styled";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

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
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#ebebed",
    borderRadius: "4px",
    width: "110px",
    height: "50px",
    cursor: "pointer",
  },
  !isMobile && {
    "&:hover, &:active": {
      backgroundColor: "#ff5e00",
      color: "#ffffff",
    },
  },
]);

const LocationPathText = render.extend(RaisingText, "flex");
