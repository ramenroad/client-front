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
      // raw 인셋은 직접 적용 금지(§2.7.1). 잔여값은 SAFE_AREA_INSETS 이벤트로 갱신되므로 0 기준이 안전.
      safeTop: 0,
      safeBottom: 0,
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
