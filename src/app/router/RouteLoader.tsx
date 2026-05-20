import { LoadingLottie } from '@/shared/ui/lottie'
import { RaisingText } from '@/shared/ui/text'
import render from '@/shared/ui/render'

export const RouteLoader = () => {
  return (
    <LoaderScreen>
      <LoadingLottie />
      <LoaderText size={14} weight="m">
        페이지 로딩 중
      </LoaderText>
    </LoaderScreen>
  )
}

const LoaderScreen = render.section('flex min-h-[100dvh] w-full flex-col items-center justify-center gap-12 bg-white')

const LoaderText = render.extend(RaisingText, 'text-gray-500')
