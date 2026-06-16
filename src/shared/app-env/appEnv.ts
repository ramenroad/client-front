/**
 * 앱 환경 3채널 노출 (W1, §1): ① React store(useAppEnv) ② <html> class ③ <html> CSS 변수.
 * 단일 동기화기에서 셋을 함께 세팅해 분산 매직넘버 재발을 막는다. store 컨벤션은 auth-store와 동일
 * (useSyncExternalStore 커스텀 팩토리, zustand 미도입 — R-A).
 */
import { useSyncExternalStore } from 'react'
import { getAppGlobal } from '@/shared/bridge'

export interface AppEnv {
  isApp: boolean
  platform: 'ios' | 'android' | 'web'
  appVersion: string | null
  tabBarNative: boolean
  tabBarHeight: number
  // 잔여 인셋(§2.7.1). 앱 기본형에서 safeBottom=0(네이티브 탭바가 처리), safeTop은 지도 풀블리드 때만 실값.
  safeTop: number
  safeBottom: number
  safeLeft: number
  safeRight: number
}

const WEB_ENV: AppEnv = {
  isApp: false,
  platform: 'web',
  appVersion: null,
  tabBarNative: false,
  tabBarHeight: 0,
  safeTop: 0,
  safeBottom: 0,
  safeLeft: 0,
  safeRight: 0,
}

// UA 토큰 폴백 — __RAISING_APP__ 미주입(Android 타이밍 등) 시 `RaisingApp/x (ios|android)`로 판별.
const readUaPlatform = (): 'ios' | 'android' | null => {
  if (typeof navigator === 'undefined') {
    return null
  }
  const m = /RaisingApp\/[\d.]+\s*\((ios|android)\)/i.exec(navigator.userAgent)
  return m ? (m[1].toLowerCase() as 'ios' | 'android') : null
}

export function readAppEnv(): AppEnv {
  const g = getAppGlobal()
  if (g) {
    return {
      isApp: true,
      platform: g.platform,
      appVersion: g.appVersion ?? null,
      tabBarNative: Boolean(g.tabBar?.native),
      tabBarHeight: g.tabBar?.height ?? 0,
      // 부트 시 주입된 raw 값으로 시드해, 비동기 SAFE_AREA_INSETS 이벤트가 늦거나(리스너 등록 전 emit) 유실돼도
      // 첫 렌더부터 여백이 적용되게 한다(이후 이벤트가 정확값으로 갱신). §2.7.1
      // - 상단: edge-to-edge라 잔여 상단 = raw 상단 인셋.
      // - 하단: 각 탭 WebView의 초기 라우트는 항상 탭 라우트(탭바 표시)라 잔여 하단 ≈ 탭바 높이 + 홈인디케이터.
      //   (이벤트 유실 시 하단 시트 최하단 여백이 0으로 남던 문제 방지. 비-탭 라우트로 가면 이벤트가 insets.bottom으로 정정.)
      safeTop: g.insets?.top ?? 0,
      safeBottom: (g.tabBar?.height ?? 0) + (g.insets?.bottom ?? 0),
      safeLeft: 0,
      safeRight: 0,
    }
  }
  const uaPlatform = readUaPlatform()
  if (uaPlatform) {
    return { ...WEB_ENV, isApp: true, platform: uaPlatform, tabBarNative: true }
  }
  return WEB_ENV
}

let state: AppEnv = typeof window === 'undefined' ? WEB_ENV : readAppEnv()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

const applyCssVars = (env: AppEnv) => {
  if (typeof document === 'undefined') {
    return
  }
  const s = document.documentElement.style
  s.setProperty('--native-tab-bar-height', `${env.tabBarHeight}px`)
  s.setProperty('--safe-top', `${env.safeTop}px`)
  s.setProperty('--safe-bottom', `${env.safeBottom}px`)
  s.setProperty('--safe-left', `${env.safeLeft}px`)
  s.setProperty('--safe-right', `${env.safeRight}px`)
}

/** <html> class + CSS 변수 동기화. 마운트 시 1회 + env 변경 시 호출. */
export function applyAppEnvToDom(env: AppEnv = state) {
  if (typeof document === 'undefined') {
    return
  }
  const el = document.documentElement
  el.classList.toggle('is-app', env.isApp)
  el.classList.toggle('is-web', !env.isApp)
  el.classList.toggle('is-ios', env.platform === 'ios')
  el.classList.toggle('is-android', env.platform === 'android')
  applyCssVars(env)
}

// 모듈 로드 시점(=첫 페인트 전)에 class/CSS 변수를 적용해, 마운트 effect를 기다리며 한 프레임 깜빡이는 것을 막는다.
// __RAISING_APP__는 콘텐츠 로드 전 주입되므로 여기서 동기로 읽을 수 있다. (applyCssVars 정의 이후에 호출 — TDZ 회피)
applyAppEnvToDom(state)

/** SAFE_AREA_INSETS(잔여) 수신 시 호출 — store + CSS 변수 갱신. */
export function setSafeInsets(insets: { top: number; bottom: number; left: number; right: number }) {
  state = {
    ...state,
    safeTop: insets.top,
    safeBottom: insets.bottom,
    safeLeft: insets.left,
    safeRight: insets.right,
  }
  applyCssVars(state)
  notify()
}

export const appEnvStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot() {
    return state
  },
}

export function useAppEnv(): AppEnv {
  return useSyncExternalStore(appEnvStore.subscribe, appEnvStore.getSnapshot, () => WEB_ENV)
}
