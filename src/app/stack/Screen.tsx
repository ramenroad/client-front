import { Suspense, useEffect, type ReactNode } from 'react'
import { AppScreen, useAppScreen } from '@stackflow/plugin-basic-ui'
import { useImmersive } from '@/shared/app-env'
import {
  ACTIVITY_ROUTES,
  registerActiveScreenScroll,
  useIsActiveScreen,
  type ActivityName,
  type ActivityRoute,
} from '@/shared/navigation'
import render from '@/shared/ui/render'
import { Footer } from '@/widgets/footer'
import { StackLoader } from './StackLoader'

/**
 * 스크린 래퍼 — 구 레이아웃 4종(AppBarLayout / WithoutAppBarLayout / MapLayout / OverlayLayout)의 대체.
 *
 * Stackflow에는 라우트 중첩이 없으므로 레이아웃을 액티비티 플래그(ACTIVITY_ROUTES)로 표현하고 여기서 해석한다.
 * AppScreen이 화면 컨테이너(절대 위치) + push/pop 전환 + 엣지 스와이프 백을 전부 제공하므로,
 * 자체 구현했던 Panel 전환·useEdgeSwipeBack은 필요 없다.
 *
 * 웹 하단 AppBar는 여기서 그리지 않는다 — 화면마다 그리면 전환 때 탭바가 화면과 함께 밀려온다.
 * 스택 밖(MobileFrame)에서 한 번만 그리고, 노출 여부는 navigationStore가 알려준다.
 */
interface ScreenProps {
  name: ActivityName
  children: ReactNode
}

export const Screen = ({ name, children }: ScreenProps) => {
  const chrome = ACTIVITY_ROUTES[name]

  return (
    // 지도는 가로 드래그가 지도 패닝이라 엣지 스와이프 백과 충돌한다(탭 루트라 되돌아갈 화면도 없다).
    <AppScreen preventSwipeBack={chrome.fullBleed} backgroundColor="var(--color-surface)">
      <ScreenBody chrome={chrome}>{children}</ScreenBody>
    </AppScreen>
  )
}

interface ScreenBodyProps {
  chrome: ActivityRoute
  children: ReactNode
}

const ScreenBody = ({ chrome, children }: ScreenBodyProps) => {
  const isActiveScreen = useIsActiveScreen()
  const { scroll } = useAppScreen()

  // 구 OverlayLayout: 네이티브 탭바를 덮는다. 순수 웹/구버전 앱에선 no-op.
  //
  // 반드시 "지금 보이는 화면"일 때만 덮어야 한다. 스택은 화면을 살려두므로(라우터처럼 언마운트되지 않는다)
  // 마운트 기준으로 걸면, 커뮤니티 상세(immersive) → 작성자 프로필처럼 탭바가 보여야 하는 화면으로 나가도
  // 상세가 스택에 살아 있어 cleanup이 돌지 않고 탭바가 숨겨진 채로 남는다.
  useImmersive(Boolean(chrome.immersive) && isActiveScreen)

  // 브리지 scroll.top(재탭)은 스택 밖에서 오므로, 활성 화면이 자기 스크롤 함수를 등록해 둔다.
  useEffect(() => {
    if (!isActiveScreen) {
      return
    }

    return registerActiveScreenScroll((top) => scroll({ top }))
  }, [isActiveScreen, scroll])

  const content = <Suspense fallback={<StackLoader />}>{children}</Suspense>

  // 구 MapLayout: 풀블리드 — 상단 안전영역까지 채우고 화면 자체는 스크롤하지 않는다.
  if (chrome.fullBleed) {
    return <FullBleed>{content}</FullBleed>
  }

  return (
    <Content className={chrome.safeTop === false ? undefined : 'pt-[var(--safe-top)]'}>
      {content}
      {chrome.footer && <Footer />}
      {chrome.space && <Space />}
    </Content>
  )
}

const Content = render.div('flex min-h-full w-full flex-col')

// 구 MapLayout의 MapScreen. 앱은 --app-bar-space가 0이라 100dvh(풀블리드), 웹은 하단 AppBar만큼 뺀다.
//
// select-none: 이 화면은 드래그가 곧 조작(지도 패닝, 하단시트 높이 조절)이라 텍스트가 블록으로 잡히면 안 된다.
// user-select는 상속되므로 입력 요소에서만 되살린다 — WebKit은 조상의 none이 input 안의 캐럿/선택까지 막는다.
const FullBleed = render.main(
  'relative h-[calc(100dvh-var(--app-bar-space))] w-full select-none overflow-hidden box-border [&_input]:select-text [&_textarea]:select-text',
)

// 구 AppBarLayout의 Space — Footer가 웹 AppBar/네이티브 탭바에 가리지 않게 하는 하단 여백.
const Space = render.div('h-[var(--app-bottom-space)] min-h-[var(--app-bottom-space)]')
