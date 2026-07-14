import { useCallback, useMemo } from 'react'
import type { ActivityBaseParams } from '@stackflow/config'
import { useActivity, useActivityParams, useStepFlow } from '@stackflow/react'
import { useNavigationSnapshot } from './navigationStore'
import { pathParamKeys } from './path'
import type { ActivityName } from './routes'
import { navigate, type NavigateOptions } from './navigator'

/**
 * react-router의 useNavigate 대체(드롭인).
 * 구현이 모듈 스코프 함수라 참조가 안정적이다 — 의존성 배열에 넣어도 재실행을 유발하지 않는다.
 */
export const useAppNavigate = () => navigate

/**
 * react-router의 useParams 대체. 경로 파라미터 + 쿼리 파라미터가 함께 담긴다.
 * 반환 타입도 useParams와 같게 Partial로 둔다 — 경로가 안 맞으면 값이 없을 수 있다는 사실은 그대로다.
 */
export const useAppParams = <T extends ActivityBaseParams = ActivityBaseParams>(): Readonly<Partial<T>> =>
  useActivityParams<ActivityName>() as Readonly<Partial<T>>

/**
 * 이 화면이 지금 "보이는 화면"인가.
 *
 * 스택은 화면을 살려두므로(라우터처럼 언마운트되지 않는다) 화면 단위 부수효과 — 네이티브 탭바 덮기,
 * 세이프에어리어 모드 전환처럼 **전역 상태를 건드리는 것** — 을 마운트/언마운트에 걸면 안 된다.
 * 위에 다른 화면이 얹혀도 cleanup이 돌지 않아 그 상태가 그대로 남는다. 이 훅으로 "보이는 동안"에 건다.
 */
export const useIsActiveScreen = (): boolean => useActivity().isActive

/** react-router의 useLocation 대체(pathname/search만). 정규 경로 기준이라 후행 슬래시가 없다. */
export const useAppLocation = () => {
  const { path } = useNavigationSnapshot()

  return useMemo(() => {
    const [pathname = '/', search = ''] = path.split('?')
    return { pathname, search: search ? `?${search}` : '' }
  }, [path])
}

type SearchParamsInit = string | string[][] | Record<string, string> | URLSearchParams
type SetSearchParams = (
  next: SearchParamsInit | ((prev: URLSearchParams) => SearchParamsInit),
  options?: { replace?: boolean },
) => void

const toSearchParams = (params: ActivityBaseParams, pathKeys: string[]) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (pathKeys.includes(key) || !value) {
      return
    }
    search.set(key, value)
  })
  return search
}

/**
 * react-router의 useSearchParams 대체 — Stackflow의 **step** 위에 얹는다.
 *
 * step은 액티비티를 새로 만들지 않고 파라미터만 바꾸면서 히스토리 항목은 쌓는 단위라, 쿼리스트링으로
 * 화면 상태를 들고 다니던 코드(지도 뷰포트·선택 매장, 탭 선택)와 의미가 정확히 맞물린다.
 * - `{ replace: true }` → replaceStep: 히스토리에 안 쌓임(지도 뷰포트 동기화처럼 잦은 갱신)
 * - 옵션 없음      → pushStep:    뒤로가기로 되돌릴 수 있음(지도 상세 시트 열기)
 *
 * 경로 파라미터는 쿼리에서 감추되 쓰기 때 다시 합친다 — step은 액티비티 파라미터를 통째로 갈아끼우므로
 * 경로 변수를 빠뜨리면 URL이 깨진다.
 */
export const useAppSearchParams = (): [URLSearchParams, SetSearchParams] => {
  const activity = useActivity()
  const params = useActivityParams<ActivityName>()
  const activityName = activity.name as ActivityName
  const { pushStep, replaceStep } = useStepFlow<ActivityName>(activityName)

  const pathKeys = useMemo(() => pathParamKeys(activityName), [activityName])
  const searchParams = useMemo(() => toSearchParams(params, pathKeys), [params, pathKeys])

  const setSearchParams = useCallback<SetSearchParams>(
    (next, options) => {
      const update = (prev: ActivityBaseParams): ActivityBaseParams => {
        const nextInit = typeof next === 'function' ? next(toSearchParams(prev, pathKeys)) : next
        const nextSearch = new URLSearchParams(nextInit as Record<string, string>)

        const merged: ActivityBaseParams = {}
        pathKeys.forEach((key) => {
          merged[key] = prev[key]
        })
        nextSearch.forEach((value, key) => {
          merged[key] = value
        })

        return merged
      }

      if (options?.replace) {
        replaceStep(update)
        return
      }

      pushStep(update)
    },
    [pathKeys, pushStep, replaceStep],
  )

  return [searchParams, setSearchParams]
}

export type { NavigateOptions }
