import type { ComponentType } from 'react'
import Lottie from 'lottie-react'
import type { LottieComponentProps } from 'lottie-react'
import loadingAnimation from '@/assets/lotties/loading.json'
import render from '@/shared/ui/render'

type LottieInteropModule =
  | ComponentType<LottieComponentProps>
  | {
      default: ComponentType<LottieComponentProps> | { default: ComponentType<LottieComponentProps> }
    }

const resolveLottieComponent = (module: LottieInteropModule) => {
  if (typeof module === 'function') {
    return module
  }

  if (typeof module.default === 'function') {
    return module.default
  }

  return module.default.default
}

const LottieComponent = resolveLottieComponent(Lottie as unknown as LottieInteropModule)

interface LoadingLottieProps {
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export const LoadingLottie = ({ className, loop = true, autoplay = true }: LoadingLottieProps) => {
  return (
    <Wrapper className={className} role="status" aria-label="불러오는 중">
      <LottieComponent animationData={loadingAnimation} loop={loop} autoplay={autoplay} />
    </Wrapper>
  )
}

const Wrapper = render.div('h-46 w-46')
