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

const View = render.main(
  'relative box-border flex min-h-[100dvh] w-390 flex-col items-center border-0 border-x border-solid border-outline bg-surface text-primary',
)

export default MobileFrame
