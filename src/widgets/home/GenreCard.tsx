import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface GenreCardProps {
  genreName: string
  genreIcon: string
  onClick: () => void
}

export const GenreCard = ({ genreName, genreIcon, onClick }: GenreCardProps) => {
  return (
    <GenreIconContainer onClick={onClick}>
      <GenreIconImage src={genreIcon} alt={genreName} />
      <GenreIconInformation size={14} weight="r">
        {genreName}
      </GenreIconInformation>
    </GenreIconContainer>
  )
}

const GenreIconContainer = render.div('flex flex-col items-center gap-4 cursor-pointer')

const GenreIconImage = render.img('w-48 h-48')

const GenreIconInformation = render.extend(RaisingText, 'text-black whitespace-nowrap')
