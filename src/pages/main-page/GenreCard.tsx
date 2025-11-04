import tw from "twin.macro";
import { RaisingText } from "../../components/common/RamenroadText";

export interface GenreIconProps {
  genreName: string;
  genreIcon: string;
  onClick: () => void;
}

const GenreCard = ({ genreName, genreIcon, onClick }: GenreIconProps) => {
  return (
    <GenreIconContainer onClick={onClick}>
      <GenreIconImage src={genreIcon} alt={genreName} />
      <GenreIconInformation size={14} weight="r">
        {genreName}
      </GenreIconInformation>
    </GenreIconContainer>
  );
};

export default GenreCard;

const GenreIconContainer = tw.div`
  flex flex-col items-center gap-4 cursor-pointer
`;

const GenreIconImage = tw.img`
  w-48 h-48
`;

const GenreIconInformation = tw(RaisingText)`
  text-black whitespace-nowrap
`;
