/**
 * 웹 브리지 런타임 (W1, §2.8.3) — has()/invoke()/on()/emit() + 네이티브 응답 수신(receive).
 *
 * 계약: has()=1차 필터(handshake capabilities), invoke() 에러폴백=2차 안전망.
 * 웹 코드 한 벌이 "신버전 앱 / 구버전 앱 / 순수 웹" 3환경을 동시 지탱한다.
 */
import {
  DEFAULT_INVOKE_TIMEOUT_MS,
  ENVELOPE_VERSION,
  isEnvelope,
  type BridgeEnvelope,
  type BridgeError,
  type RaisingAppGlobal,
} from './protocol'

declare global {
  interface Window {
    __RAISING_APP__?: RaisingAppGlobal
    __RAISING_BRIDGE__?: { receive: (envelope: BridgeEnvelope) => void }
    ReactNativeWebView?: { postMessage: (msg: string) => void }
  }
}

type EventHandler = (payload: unknown) => void

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (error: BridgeError) => void
  timer: ReturnType<typeof setTimeout> | null
}

let seq = 0
const genId = () => `req_${Date.now().toString(36)}_${(++seq).toString(36)}`

const pending = new Map<string, PendingRequest>()
const listeners = new Map<string, Set<EventHandler>>()

export const isInApp = () => typeof window !== 'undefined' && typeof window.__RAISING_APP__ !== 'undefined'

export const getAppGlobal = (): RaisingAppGlobal | undefined =>
  typeof window === 'undefined' ? undefined : window.__RAISING_APP__

export const has = (method: string) =>
  isInApp() && Boolean(window.__RAISING_APP__?.capabilities?.includes(method))

const postToNative = (envelope: BridgeEnvelope) => {
  window.ReactNativeWebView?.postMessage(JSON.stringify(envelope))
}

/** 요청-응답. 미지원이면 즉시 E_UNSUPPORTED reject → 호출부가 폴백 선택. */
export function invoke<T = unknown>(method: string, params?: object): Promise<T> {
  if (!has(method)) {
    return Promise.reject<T>({ code: 'E_UNSUPPORTED', message: `미지원 method: ${method}` } satisfies BridgeError)
  }
  const id = genId()
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id)
      reject({ code: 'E_TIMEOUT', message: `${method} 타임아웃` } satisfies BridgeError)
    }, DEFAULT_INVOKE_TIMEOUT_MS)
    pending.set(id, { resolve: resolve as (value: unknown) => void, reject, timer })
    postToNative({ v: ENVELOPE_VERSION, kind: 'rpc.request', id, method, params, ts: Date.now() })
  })
}

/** 이벤트 구독. 반환 함수로 해제. */
export function on(topic: string, handler: EventHandler): () => void {
  let set = listeners.get(topic)
  if (!set) {
    set = new Set()
    listeners.set(topic, set)
  }
  set.add(handler)
  return () => {
    set?.delete(handler)
  }
}

/** 웹 → 네이티브 이벤트 발신 (ROUTE_CHANGED, SET_SAFE_AREA_MODE, SET_STATUS_BAR, back.state). */
export function emit(topic: string, payload?: unknown) {
  if (!isInApp()) {
    return
  }
  postToNative({ v: ENVELOPE_VERSION, kind: 'event', topic, payload, ts: Date.now() })
}

function receive(envelope: BridgeEnvelope) {
  if (!isEnvelope(envelope)) {
    return
  }
  if (envelope.kind === 'rpc.response') {
    const p = pending.get(envelope.id)
    if (!p) {
      return // 미매칭(이미 timeout/cancel) → 폐기
    }
    pending.delete(envelope.id)
    if (p.timer) {
      clearTimeout(p.timer)
    }
    if (envelope.ok) {
      p.resolve(envelope.result)
    } else {
      p.reject(envelope.error ?? { code: 'E_NATIVE' })
    }
  } else if (envelope.kind === 'event') {
    listeners.get(envelope.topic)?.forEach((handler) => {
      try {
        handler(envelope.payload)
      } catch {
        // 핸들러 예외가 다른 구독자/네이티브로 전파되지 않게 격리
      }
    })
  }
}

let installed = false

/** 네이티브가 injectJavaScript로 호출할 수 있도록 window.__RAISING_BRIDGE__.receive를 노출. */
export function installBridge() {
  if (typeof window === 'undefined' || installed) {
    return
  }
  installed = true
  window.__RAISING_BRIDGE__ = { receive }
}
