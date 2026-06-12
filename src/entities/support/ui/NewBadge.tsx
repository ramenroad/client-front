import render from '@/shared/ui/render'

// 최근 등록된 글을 나타내는 주황 'N' 뱃지.
export const NewBadge = () => <Badge aria-label="새 글">N</Badge>

const Badge = render.span(
  'inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange font-10-b leading-none text-white',
)
