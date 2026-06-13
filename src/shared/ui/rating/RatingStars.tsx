import { IconStar } from '@/shared/ui/icon'
import render from '@/shared/ui/render'

const RATING_STARS = [1, 2, 3, 4, 5]

interface RatingStarsProps {
  rating: number
  size?: number
  className?: string
}

export const RatingStars = ({ rating, size = 14, className }: RatingStarsProps) => {
  return (
    <StarRow className={className}>
      {RATING_STARS.map((star) => {
        if (rating >= star) {
          return <IconStar key={star} size={size} />
        }

        if (rating >= star - 0.5) {
          return <IconStar key={star} size={size} isHalf />
        }

        return <IconStar key={star} size={size} inactive />
      })}
    </StarRow>
  )
}

const StarRow = render.div('flex items-center gap-2')
