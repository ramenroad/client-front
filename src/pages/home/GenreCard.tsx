import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

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

const GenreIconContainer = render.div("flex flex-col items-center gap-4 cursor-pointer");

const GenreIconImage = render.img("w-48 h-48");

const GenreIconInformation = render.extend(RaisingText, "text-black whitespace-nowrap");
