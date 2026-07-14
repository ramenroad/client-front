/**
 * 로그인 후 "원래 가려던 페이지"로 복귀시키기 위한 목적지 저장소.
 * OAuth는 외부 제공자로 풀페이지 이동 후 /oauth/:id로 돌아오므로 라우터 state/쿼리가 유실된다.
 * → sessionStorage에 보관해 외부 왕복을 견디게 한다.
 */
const KEY = 'post-login-redirect'

// 앱 내부 경로만 허용(오픈 리다이렉트 방지) + 로그인 흐름 자체로의 복귀 루프 차단.
const isSafeRedirect = (path: string): boolean =>
  typeof path === 'string' &&
  path.startsWith('/') &&
  !path.startsWith('//') &&
  !path.startsWith('/login') &&
  !path.startsWith('/oauth') &&
  !path.startsWith('/register')

export const setPostLoginRedirect = (path: string): void => {
  try {
    if (isSafeRedirect(path)) {
      sessionStorage.setItem(KEY, path)
    }
  } catch {
    // sessionStorage 비가용(프라이빗 모드 등) — 무시하고 기본 경로로 폴백
  }
}

/** 저장된 복귀 경로를 읽고 제거한다(1회성). 없거나 안전하지 않으면 null. */
export const consumePostLoginRedirect = (): string | null => {
  try {
    const value = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    return value && isSafeRedirect(value) ? value : null
  } catch {
    return null
  }
}

/**
 * G6(앱) 로그인 히스토리 되감기 마커 — OAuth 왕복(location.href → 제공자 → 콜백)으로 쌓인 back 항목이
 * 남아 있으면 iOS 스와이프 백 제스처가 재무장돼 스냅샷 흰 화면이 재발한다. 콜백 페이지가 history.go로
 * 첫 항목까지 되감으면 자신이 언마운트돼 useNavigate가 무시되므로, 최종 목적지를 여기 마커로 남기고
 * 라우터 구독자(app-provider)가 POP 정착 후 replace 네비로 마무리한다.
 * 목적지는 내부에서 계산된 값이라 isSafeRedirect를 적용하지 않는다(/register 등 로그인 흐름 경로 포함).
 */
const REWIND_KEY = 'post-login-rewind-destination'

/** @returns 저장 성공 여부 — 실패(프라이빗 모드 등) 시 호출부는 되감기 없이 일반 네비로 폴백한다. */
export const setPendingLoginRewind = (path: string): boolean => {
  try {
    sessionStorage.setItem(REWIND_KEY, path)
    return true
  } catch {
    return false
  }
}

/** 되감기 목적지를 읽고 제거한다(1회성). */
export const consumePendingLoginRewind = (): string | null => {
  try {
    const value = sessionStorage.getItem(REWIND_KEY)
    if (value != null) {
      sessionStorage.removeItem(REWIND_KEY)
    }
    return value
  } catch {
    return null
  }
}
