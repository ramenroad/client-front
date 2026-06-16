/**
 * raising-app ↔ raising-client 브리지 프로토콜 — 단일 소스 (B0/B1, 계획서 §2 확정 스펙).
 *
 * 두 repo는 별도 공유 패키지가 없으므로 이 파일을 **양쪽에 동일 내용으로 미러링**한다.
 * (app: src/bridge/protocol.ts · client: src/shared/bridge/protocol.ts)
 * 프레임워크 비의존(순수 TS) — RN/DOM 타입을 참조하지 않는다.
 */

/** 봉투 구조 호환 게이트 (§2.5). 구조 변경 시 메이저 bump. */
export const ENVELOPE_VERSION = 1;
/** __RAISING_APP__.bridgeProtocol 로 주입되는 정수. method 단위 협상은 capabilities가 담당. */
export const BRIDGE_PROTOCOL_VERSION = 1;
/** 일반 invoke 기본 타임아웃(ms). 권한 다이얼로그 동반 method는 무제한(§2.4). */
export const DEFAULT_INVOKE_TIMEOUT_MS = 8000;

/** 표준 에러코드 (§2.3). */
export type BridgeErrorCode =
  | 'E_UNSUPPORTED' // 화이트리스트에 없는/미지원 method
  | 'E_PERMISSION_DENIED' // OS 권한 거부
  | 'E_TIMEOUT' // 클라이언트 타임아웃(웹 자체 reject)
  | 'E_CANCELLED' // 사용자 취소
  | 'E_INVALID_PARAMS' // params 스키마 위반
  | 'E_NATIVE'; // 그 외 네이티브 내부 예외

export interface BridgeError {
  code: BridgeErrorCode;
  message?: string;
}

/** (1) rpc.request — 웹→네이티브. */
export interface RpcRequestEnvelope {
  v: number;
  kind: 'rpc.request';
  id: string;
  method: string;
  params?: unknown;
  ts: number;
}

/** (2) rpc.response — 네이티브→웹. id echo. */
export interface RpcResponseEnvelope {
  v: number;
  kind: 'rpc.response';
  id: string;
  ok: boolean;
  result?: unknown;
  error?: BridgeError;
  ts: number;
}

/** (3) event — 단방향(양쪽 발신 가능). */
export interface EventEnvelope {
  v: number;
  kind: 'event';
  topic: string;
  payload?: unknown;
  ts: number;
}

export type BridgeEnvelope =
  | RpcRequestEnvelope
  | RpcResponseEnvelope
  | EventEnvelope;

/** RPC method 화이트리스트 — handshake capabilities 대상 (§2.7 / §2.8). */
export const BridgeMethods = {
  systemGetInfo: 'system.getInfo',
  geoGetCurrent: 'geo.getCurrent',
  geoWatch: 'geo.watch',
  geoClearWatch: 'geo.clearWatch',
  netGetStatus: 'net.getStatus',
  hapticImpact: 'haptic.impact',
  hapticNotification: 'haptic.notification',
  hapticSelection: 'haptic.selection',
  shareOpen: 'share.open',
  kakaoShare: 'kakao.share',
  openURL: 'openURL',
  clipboardWrite: 'clipboard.write',
  clipboardRead: 'clipboard.read',
  storageGet: 'storage.get',
  storageSet: 'storage.set',
  storageRemove: 'storage.remove',
  permissionsQuery: 'permissions.query',
  permissionsRequest: 'permissions.request',
  // 외부 콘솔 의존(보류, capabilities에서 제외 → 웹 has()=false 자동 폴백)
  pushRequestPermission: 'push.requestPermission',
  pushGetToken: 'push.getToken',
  imagePickerPick: 'imagePicker.pick',
  cameraCapture: 'camera.capture',
} as const;

export type BridgeMethod = (typeof BridgeMethods)[keyof typeof BridgeMethods];

/** 이벤트 topic — handshake 대상 아님(§2.8.2). */
export const BridgeTopics = {
  // 동기화/라우팅/세이프에어리어 (§2.7.1)
  navigate: 'NAVIGATE', // N→W: 탭 터치
  routeChanged: 'ROUTE_CHANGED', // W→N: 라우트 변경(하이라이트만)
  setSafeAreaMode: 'SET_SAFE_AREA_MODE', // W→N: 지도 진입/이탈(멱등)
  setTabBar: 'SET_TAB_BAR', // W→N: 풀스크린 커버 — 탭바 강제 숨김/복원(라우트 무관, 멱등)
  switchTab: 'SWITCH_TAB', // W→N: 다른 탭 소유 라우트로 이동 — 탭 전환 + 해당 탭 WebView 로드(크로스탭 네비)
  safeAreaInsets: 'SAFE_AREA_INSETS', // N→W: 잔여 인셋
  setStatusBar: 'SET_STATUS_BAR', // W→N: 상태바 스타일
  keyboard: 'KEYBOARD', // N→W: {height,duration}
  scrollTop: 'scroll.top', // N→W: 재탭 스크롤 top
  // 시스템/생애주기/네트워크 (§2.7.2)
  appLifecycle: 'app.lifecycle', // N→W: active/background/inactive
  netStatus: 'net.status', // N→W: 온/오프라인
  androidBackPress: 'android.backPress', // N→W: 백버튼 위임
  backState: 'back.state', // W→N: 모달 열림/back 처리가능 상태 미러(G5)
  // 위치 (§2.7.3)
  geoWatchUpdate: 'geo.watch.update', // N→W: watch 좌표 push
  // 푸시 (§2.7.5, 보류)
  pushTokenRefresh: 'push.token.refresh',
  pushReceived: 'push.received',
  pushOpened: 'push.opened',
} as const;

export type BridgeTopic = (typeof BridgeTopics)[keyof typeof BridgeTopics];

export type Insets = { top: number; bottom: number; left: number; right: number };

export type SafeAreaMode = 'inset' | 'edge-to-edge';
export type SafeAreaEdge = 'top' | 'bottom' | 'left' | 'right';
export type StatusBarStyle = 'dark-content' | 'light-content';
export type ActiveTab = 'home' | 'map' | 'community' | 'my';

/** injectedJavaScriptBeforeContentLoaded 로 주입되는 객체 (§2.8.1). */
export interface RaisingAppGlobal {
  platform: 'ios' | 'android';
  appVersion: string;
  bridgeProtocol: number;
  /** raw 디바이스 인셋(부트스트랩 참조용). 직접 패딩 금지 — 웹은 잔여 인셋 모델로 산출(§2.7.1). */
  insets: Insets;
  tabBar: { native: boolean; height: number };
  capabilities: string[];
  openURLSchemes?: string[];
  /** 이 WebView가 속한 탭(소유 탭). 웹이 크로스탭 네비(다른 탭 소유 라우트로 이동)를 판별하는 데 쓴다. */
  tab?: ActiveTab;
}

/** envelope 판별 헬퍼. */
export const isEnvelope = (value: unknown): value is BridgeEnvelope =>
  typeof value === 'object' &&
  value !== null &&
  'kind' in value &&
  (value.kind === 'rpc.request' ||
    value.kind === 'rpc.response' ||
    value.kind === 'event');
