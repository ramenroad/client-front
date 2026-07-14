import { LoadingLottie } from '@/shared/ui/lottie'
import { RaisingText } from '@/shared/ui/text'
import render from '@/shared/ui/render'

/** 액티비티 청크 로딩 폴백(구 RouteLoader). AppScreen 안에서 뜨므로 화면을 가득 채운다. */
export const StackLoader = () => {
  return (
    <LoaderScreen>
      <LoadingLottie />
      <LoaderText size={14} weight="m">
        페이지 로딩 중
      </LoaderText>
    </LoaderScreen>
  )
}

const LoaderScreen = render.section('flex min-h-full w-full flex-1 flex-col items-center justify-center gap-12 bg-background')

const LoaderText = render.extend(RaisingText, 'text-muted')
