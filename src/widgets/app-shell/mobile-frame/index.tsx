import type { ReactNode } from 'react'
import { useAppEnv } from '@/shared/app-env'
import { ACTIVITY_ROUTES, useNavigationSnapshot } from '@/shared/navigation'
import render from '@/shared/ui/render'
import AppBar from '@/widgets/navigation/app-bar'

interface MobileFrameProps {
  children: ReactNode
}

const MobileFrame = ({ children }: MobileFrameProps) => {
  const { isApp } = useAppEnv()
  const { activityName } = useNavigationSnapshot()

  return (
    <Screen>
      <View>
        {children}
        {/* 웹 하단 탭바는 스택 **밖**에서 한 번만 그린다 — 화면마다 그리면 push 전환 때 탭바가 화면과 함께 밀려온다.
            노출 여부는 라우트 테이블이 정하고(구 AppBarLayout·MapLayout·커뮤니티), 앱에선 네이티브 탭바가 대신한다. */}
        {!isApp && ACTIVITY_ROUTES[activityName].appBar && <AppBar />}
      </View>
    </Screen>
  )
}

const Screen = render.section('box-border flex min-h-[100dvh] justify-center overflow-hidden bg-background')

// 각 화면(AppScreen)이 position:absolute라 이 View가 컨테이닝 블록이 된다 → 화면들이 390 프레임 안에 갇힌다
// (구 오버레이 패널이 fixed inset-0으로 프레임을 탈출해 가로로 늘어나던 문제도 여기서 사라진다).
// 그러려면 높이가 확정이어야 하므로 min-h가 아니라 h. 스크롤은 화면 안에서 일어난다.
// 상단 안전영역 패딩은 화면마다 다르므로(지도는 풀블리드) 여기서 주지 않고 스크린 래퍼가 처리한다.
const View = render.main(
  'relative box-border h-[100dvh] w-390 border-0 border-x border-solid border-outline-muted bg-surface text-primary',
)

export default MobileFrame
