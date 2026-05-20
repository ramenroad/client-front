import { useEffect, useRef, useState } from 'react'
import { IconMore } from '@/shared/ui/icon'
import { formatFullDate } from '@/shared/lib/date'
import render from '@/shared/ui/render'

interface MenuBoardDetailProps {
  profileImage: string
  nickname: string
  createdAt: string
  description: string
  isMine: boolean
  onDelete: () => void
}

export const MenuBoardDetail = ({
  profileImage,
  nickname,
  createdAt,
  description,
  isMine,
  onDelete,
}: MenuBoardDetailProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const iconMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconMoreRef.current && !iconMoreRef.current.contains(event.target as Node)) {
        setIsTooltipOpen(false)
      }
    }

    if (isTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTooltipOpen])

  return (
    <MenuBoardDetailWrapper>
      <Header>
        <WriterInfo>
          <ProfileImage src={profileImage} alt={nickname} />
          <Nickname>{nickname}</Nickname>
          <Divider />
          <CreatedAt>{formatFullDate(createdAt)}</CreatedAt>
        </WriterInfo>
        {isMine && (
          <IconMoreWrapper ref={iconMoreRef} onClick={() => setIsTooltipOpen((prev) => !prev)}>
            <IconMore width={20} color="#A0A0A0" />
            {isTooltipOpen && (
              <Tooltip onClick={onDelete}>
                <TooltipText>삭제</TooltipText>
              </Tooltip>
            )}
          </IconMoreWrapper>
        )}
      </Header>
      <Description>{description}</Description>
    </MenuBoardDetailWrapper>
  )
}

const MenuBoardDetailWrapper = render.div(
  'relative box-border flex h-84 w-240 flex-col justify-center gap-10 rounded-[8px] bg-white/10 px-20 py-16 font-14-m text-black',
)

const Header = render.div('flex items-center')

const WriterInfo = render.div('flex items-center gap-6')

const IconMoreWrapper = render.div('relative ml-auto cursor-pointer')

const ProfileImage = render.img('h-24 w-24 rounded-full object-cover')

const Divider = render.div('h-10 w-1 bg-gray-800')

const Nickname = render.div('w-60 truncate font-14-r leading-18 text-gray-200')

const CreatedAt = render.div('font-12-l text-gray-400')

const Description = render.div('truncate font-14-r text-white')

const Tooltip = render.div(
  'absolute left-[-24px] z-10 mt-4 flex h-37 w-48 items-center justify-center rounded-[8px] bg-gray-700',
)

const TooltipText = render.div('font-12-m text-gray-200')
