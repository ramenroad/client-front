import type { ActivityBaseParams } from '@stackflow/config'
import type { Actions, StepActions } from '@stackflow/react'
import { navigationStore } from './navigationStore'
import { matchActivityPath } from './path'
import { ACTIVITY_ROUTES } from './routes'

export interface NavigateOptions {
  replace?: boolean
}

interface StackNavigator {
  actions: Actions
  stepActions: StepActions<ActivityBaseParams>
}

/**
 * 스택 액션 주입 — app/stack이 stackflow()로 만든 액션을 넣는다(initializeHttpAuth와 같은 패턴).
 *
 * shared는 app을 import할 수 없는데, 네비게이션은 화면 코드(pages/widgets)와 스택 밖(브리지 리스너)
 * 양쪽에서 호출된다. 구현을 shared에 두고 액션만 주입받아 호출 경로를 하나로 유지한다.
 */
let navigator: StackNavigator | null = null

export const initializeNavigator = (next: StackNavigator | null) => {
  navigator = next
}

const paramsEqual = (a: ActivityBaseParams, b: ActivityBaseParams) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    if ((a[key] ?? '') !== (b[key] ?? '')) {
      return false
    }
  }
  return true
}

/**
 * 경로 문자열 → 액티비티 네비게이션. 화면 코드(useAppNavigate)와 브리지(NAVIGATE)가 공유하는 단일 진입점.
 *
 * singleton 화면은 push 대신 재사용한다 — 스택이 이전 화면을 살려두므로 재진입을 push로 처리하면
 * 같은 화면이 겹겹이 쌓이고, 지도의 경우 네이버 지도 인스턴스가 그만큼 늘어난다.
 */
export const navigateToPath = (to: string, options?: NavigateOptions) => {
  const matched = matchActivityPath(to)
  if (!matched || !navigator) {
    return
  }

  const { name, params } = matched
  const { actions, stepActions } = navigator
  const { stack } = navigationStore.getSnapshot()

  if (ACTIVITY_ROUTES[name].singleton) {
    const index = stack.findIndex((entry) => entry.name === name)

    if (index >= 0) {
      const target = stack[index]
      const isTop = index === stack.length - 1

      // 이미 top이면 화면을 새로 만들지 않고 파라미터만 갈아끼운다(지도 재중심 등).
      if (isTop) {
        if (!paramsEqual(target.params, params)) {
          stepActions.replaceStep(params)
        }
        return
      }

      // 스택 아래에 살아 있으면 그 지점까지 되감는다 — 탭 재탭 시 홈/지도가 두 장 되는 것을 막는다.
      actions.pop(stack.length - 1 - index)
      if (!paramsEqual(target.params, params)) {
        stepActions.replaceStep(params, { targetActivityId: target.id })
      }
      return
    }
  }

  if (options?.replace) {
    actions.replace(name, params)
    return
  }

  actions.push(name, params)
}

/**
 * 뒤로가기. history를 되감으면 history-sync가 popstate를 받아 액티비티/스텝 중 옳은 쪽을 pop한다
 * (지도 상세 시트처럼 step으로 쌓인 상태도 자연히 닫힌다). pop()을 직접 부르면 step이 무시된다.
 */
export const goBack = (delta = -1) => {
  window.history.go(delta)
}

/** react-router useNavigate 대체 — 경로 문자열 또는 음수 delta. */
export const navigate = (to: string | number, options?: NavigateOptions) => {
  if (typeof to === 'number') {
    goBack(to)
    return
  }

  navigateToPath(to, options)
}
