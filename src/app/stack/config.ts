import { defineConfig } from '@stackflow/config'
import { ACTIVITY_NAMES, ACTIVITY_ROUTES, pathParamKeys, type ActivityName } from '@/shared/navigation'

/** push/pop 전환 시간(ms). basic-ui(cupertino/android) 애니메이션과 스택 코어가 공유한다. */
export const TRANSITION_DURATION = 270

const mapKeys = (
  params: Record<string, string | undefined>,
  keys: string[],
  transform: (value: string) => string,
) => {
  const next = { ...params }
  keys.forEach((key) => {
    const value = params[key]
    if (typeof value !== 'string') {
      return
    }
    try {
      next[key] = transform(value)
    } catch {
      next[key] = value // 잘못된 % 시퀀스 등 — 원본 유지(디코딩 실패로 화면 전체가 죽지 않게)
    }
  })
  return next
}

/**
 * 경로 변수 인코딩 코덱.
 *
 * history-sync가 쓰는 url-pattern은 경로 변수를 인코딩/디코딩하지 않고, 기본 세그먼트 문자셋도 ASCII다.
 * 그래서 한글 장르·지역명(/genre/쇼유)을 그대로 넘기면 내부 match()가 null을 뱉고
 * history-sync가 그 null을 Object.keys()에 넘겨 터진다(react-router는 이걸 자동으로 해줘서 안 보이던 문제).
 * → 경로 변수만 골라 인코딩해 넣고 읽을 때 되돌린다. 쿼리 파라미터는 URLSearchParams가 알아서 처리한다.
 */
const toRoute = (name: ActivityName) => {
  const path = ACTIVITY_ROUTES[name].route
  const keys = pathParamKeys(name)

  if (keys.length === 0) {
    return path
  }

  return {
    path,
    encode: (params: Record<string, string | undefined>) => mapKeys(params, keys, encodeURIComponent),
    decode: (params: Record<string, string>) => mapKeys(params, keys, decodeURIComponent) as Record<string, string>,
  }
}

export const stackConfig = defineConfig({
  transitionDuration: TRANSITION_DURATION,
  activities: ACTIVITY_NAMES.map((name) => ({
    name,
    route: toRoute(name),
  })),
})
