import type { ActivityBaseParams } from '@stackflow/config'
import { ACTIVITY_NAMES, ACTIVITY_ROUTES, type ActivityName } from './routes'

export interface MatchedActivity {
  name: ActivityName
  params: ActivityBaseParams
}

/**
 * history-sync(sortActivityRoutes)와 동일한 특이도 점수 — 정적 세그먼트가 동적보다 우선한다.
 * 같은 점수 체계를 써야 우리 매처와 history-sync의 판정이 갈리지 않는다.
 * (예: '/community/write'가 '/community/:id'보다, '/review/list/:id'가 '/review/:mode/:id'보다 먼저.)
 */
const scoreRoute = (route: string) => {
  const segments = route.split('/')
  return segments.reduce(
    (score, segment) => score + (segment.startsWith(':') ? 3 : segment === '' ? 1 : 10),
    segments.length,
  )
}

const SORTED_ROUTES = ACTIVITY_NAMES.map((name) => ({
  name,
  segments: ACTIVITY_ROUTES[name].route.split('/'),
  score: scoreRoute(ACTIVITY_ROUTES[name].route),
})).sort((a, b) => b.score - a.score)

const PATH_PARAM_KEYS = new Map<ActivityName, string[]>(
  ACTIVITY_NAMES.map((name) => [
    name,
    ACTIVITY_ROUTES[name].route
      .split('/')
      .filter((segment) => segment.startsWith(':'))
      .map((segment) => segment.slice(1)),
  ]),
)

/** 해당 액티비티에서 경로 변수로 쓰이는 키들(나머지 파라미터는 쿼리스트링이 된다). */
export const pathParamKeys = (name: ActivityName): string[] => PATH_PARAM_KEYS.get(name) ?? []

/** 잘못된 % 시퀀스가 섞여도 화면 전체가 죽지 않게 — 디코딩 실패 시 원본을 쓴다. */
const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** 후행 슬래시 제거 + 선행 슬래시 보장. history-sync는 URL에 후행 슬래시를 붙이므로 매칭 전에 벗겨낸다. */
const normalizePathname = (pathname: string) => {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') || '/' : '/'
}

const matchSegments = (routeSegments: string[], pathSegments: string[]): Record<string, string> | null => {
  if (routeSegments.length !== pathSegments.length) {
    return null
  }

  const params: Record<string, string> = {}

  for (let index = 0; index < routeSegments.length; index += 1) {
    const routeSegment = routeSegments[index]
    const pathSegment = pathSegments[index]

    if (!routeSegment.startsWith(':')) {
      if (routeSegment !== pathSegment) {
        return null
      }
      continue
    }

    if (!pathSegment) {
      return null // 빈 세그먼트는 경로 변수로 인정하지 않는다(예: '/detail/'는 매칭 실패)
    }

    params[routeSegment.slice(1)] = safeDecode(pathSegment)
  }

  return params
}

/**
 * 경로 문자열 → 액티비티. 딥링크·브리지 NAVIGATE·로그인 복귀 경로처럼 "문자열로만 들어오는" 진입점의 관문.
 * 매칭 실패 시 null (호출부가 무시하거나 홈으로 폴백한다).
 */
export const matchActivityPath = (path: string): MatchedActivity | null => {
  const [rawPathname = '/', rawSearch = ''] = path.split('?')
  const pathSegments = normalizePathname(rawPathname).split('/')

  for (const route of SORTED_ROUTES) {
    const pathParams = matchSegments(route.segments, pathSegments)
    if (!pathParams) {
      continue
    }

    // history-sync의 parse와 동일하게 경로 파라미터가 쿼리 파라미터를 덮는다.
    const params: ActivityBaseParams = {}
    new URLSearchParams(rawSearch).forEach((value, key) => {
      params[key] = value
    })
    Object.assign(params, pathParams)

    return { name: route.name, params }
  }

  return null
}

/**
 * 액티비티 → 정규 경로. **후행 슬래시를 붙이지 않는다** — history-sync가 주소창에 쓰는 URL과 달리
 * 브리지 계약(ROUTE_CHANGED.path, 탭 루트 판별)과 로그인 복귀 경로는 후행 슬래시 없는 정규형을 쓴다.
 * 빈 문자열/undefined 파라미터는 쿼리에서 뺀다(history-sync의 fill과 동일).
 */
export const buildActivityPath = (name: ActivityName, params: ActivityBaseParams = {}): string => {
  const pathKeys = pathParamKeys(name)

  const pathname = ACTIVITY_ROUTES[name].route
    .split('/')
    .map((segment) =>
      segment.startsWith(':') ? encodeURIComponent(params[segment.slice(1)] ?? '') : segment,
    )
    .join('/')

  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (pathKeys.includes(key) || !value) {
      return
    }
    search.set(key, value)
  })

  const query = search.toString()
  return query ? `${pathname}?${query}` : pathname
}
