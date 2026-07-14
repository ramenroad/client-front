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
