import type { ReactNode } from 'react'
import render from '@/shared/ui/render'

interface MobileFrameProps {
  children: ReactNode
}

const MobileFrame = ({ children }: MobileFrameProps) => {
  return (
    <Screen>
      <View>{children}</View>
    </Screen>
  )
}

const Screen = render.section('box-border flex min-h-[100dvh] justify-center overflow-hidden bg-background')

// 앱: 상단 안전영역만큼 패딩(edge-to-edge). #root가 아니라 overflow-hidden(Screen) '안쪽'의 View에 줘야
// 풀블리드 화면(지도)·sticky 헤더(커뮤니티)의 음수 마진 상쇄가 Screen의 overflow-hidden에 클립되지 않는다.
// 웹/구버전 앱은 --safe-top=0이라 무효.
const View = render.main(
  'relative box-border flex min-h-[100dvh] w-390 flex-col items-center border-0 border-x border-solid border-outline-muted bg-surface pt-[var(--safe-top)] text-primary',
)

export default MobileFrame
