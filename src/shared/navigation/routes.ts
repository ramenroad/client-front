import type { ActivityBaseParams } from '@stackflow/config'

/**
 * 화면 크롬 — 구 레이아웃(AppBarLayout / WithoutAppBarLayout / MapLayout / OverlayLayout)의 대체.
 * Stackflow에선 라우트 중첩이 없으므로 레이아웃을 라우트 테이블의 플래그로 표현하고, 스크린 래퍼가 해석한다.
 */
export interface ActivityRoute {
  /**
   * history-sync가 URL ↔ 액티비티를 잇는 패턴. **액티비티당 정확히 하나**여야 한다.
   * history-sync는 URL을 만들 때 activityName으로 라우트를 하나만 찾으므로(첫 매치),
   * 한 액티비티에 선택 파라미터 경로를 둘 달면 파라미터 누락으로 stringify가 터진다.
   * → /community/write 와 /community/write/:id 는 CommunityWrite / CommunityEdit 로 나눈다.
   */
  route: string
  /** Footer 노출(구 AppBarLayout·WithoutAppBarLayout). */
  footer?: boolean
  /** 하단 Space 노출 — 웹 AppBar/네이티브 탭바에 Footer가 가리지 않게 하는 여백(구 AppBarLayout). */
  space?: boolean
  /** 웹 하단 탭바. 앱에선 네이티브 탭바가 대체하므로 렌더하지 않는다. 스택 밖에서 한 번만 그린다. */
  appBar?: boolean
  /** 풀블리드(구 MapLayout) — 상단 안전영역까지 채우고 화면 자체는 스크롤하지 않는다. */
  fullBleed?: boolean
  /** 네이티브 탭바까지 덮는 독립 화면(구 OverlayLayout). */
  immersive?: boolean
  /** 상단 안전영역 패딩. 지도·커뮤니티처럼 스스로 처리하는 화면만 false. */
  safeTop?: boolean
  /**
   * 스택에 인스턴스를 하나만 유지한다. 이미 스택에 있으면 push 대신 그 지점까지 pop하고,
   * 이미 top이면 파라미터만 교체한다.
   *
   * 스택은 이전 화면을 살려두므로(그게 도입 목적) 재진입을 push로 처리하면 같은 화면이 겹겹이 쌓인다.
   * 특히 지도는 네이버 지도 인스턴스를 들고 있어 두 장이 되는 순간 메모리를 두 배로 먹는다.
   * 탭 루트 + 지도에만 건다.
   */
  singleton?: boolean
}

/** 구 AppBarLayout = Footer + Space + 웹 AppBar. */
const APP_BAR_LAYOUT = { footer: true, space: true, appBar: true } as const

/**
 * 액티비티 라우트 테이블 — 앱 전체 네비게이션의 단일 소스.
 * history-sync가 특이도(정적 세그먼트 우선)로 자동 정렬하므로 선언 순서는 매칭에 영향을 주지 않는다.
 */
const ACTIVITY_ROUTE_TABLE = {
  // 홈 탭
  Home: { route: '/', ...APP_BAR_LAYOUT, singleton: true },
  RamenyaByRegion: { route: '/location/:location', ...APP_BAR_LAYOUT },
  RamenyaDetail: { route: '/detail/:id', ...APP_BAR_LAYOUT },
  RamenyaByGenre: { route: '/genre/:genre', ...APP_BAR_LAYOUT },
  Banner: { route: '/banner', ...APP_BAR_LAYOUT },
  Group: { route: '/group/:id', ...APP_BAR_LAYOUT },

  // 지도 탭 — 풀블리드라 상단 패딩을 주지 않는다(지도 오버레이가 --map-search-top으로 자체 처리).
  MapSearch: { route: '/map', appBar: true, fullBleed: true, safeTop: false, singleton: true },

  // 커뮤니티 탭 — 목록은 sticky 헤더가 상태바를 덮어야 해서 상단 패딩을 스스로 처리한다.
  Community: { route: '/community', appBar: true, safeTop: false, singleton: true },
  CommunityNotifications: { route: '/community/notifications' },
  CommunityDetail: { route: '/community/:id', immersive: true },
  CommunityWrite: { route: '/community/write', immersive: true },
  CommunityEdit: { route: '/community/write/:id', immersive: true },

  // 마이 탭
  MyProfile: { route: '/mypage', ...APP_BAR_LAYOUT, singleton: true },
  MyActivity: { route: '/my-activity', ...APP_BAR_LAYOUT },
  MySearch: { route: '/my-search', ...APP_BAR_LAYOUT },
  MyInformation: { route: '/information', ...APP_BAR_LAYOUT },
  UserReviews: { route: '/user-review/:id', ...APP_BAR_LAYOUT },
  ReviewList: { route: '/review/list/:id', ...APP_BAR_LAYOUT },

  // 라멘 캘린더 — 탭 하위가 아니라 앱 위에 덮이는 독립 화면
  MyCalendar: { route: '/my-calendar', immersive: true },

  // 구 WithoutAppBarLayout (Footer만)
  Register: { route: '/register', footer: true },
  MenuBoardSubmit: { route: '/menu-board-submit/:id', footer: true },
  MenuBoardEdit: { route: '/menu-board-edit/:id', footer: true },

  // 단독 화면 (레이아웃 없음)
  Login: { route: '/login' },
  OAuthCallback: { route: '/oauth/:id' },
  ReviewCreate: { route: '/review/create/:id' },
  ReviewEdit: { route: '/review/edit/:id' },
  ReviewImages: { route: '/images/:id' },
  MenuBoardImages: { route: '/menu-board-images/:id' },
  Withdraw: { route: '/withdraw' },
  Notice: { route: '/notice' },
  NoticeDetail: { route: '/notice/:id' },
  PatchNote: { route: '/patch-note' },
  PatchNoteDetail: { route: '/patch-note/:id' },
  Inquiry: { route: '/inquiry' },
  Policy: { route: '/policy' },
} as const satisfies Record<string, ActivityRoute>

export type ActivityName = keyof typeof ACTIVITY_ROUTE_TABLE

// 리터럴 테이블은 키를 좁히는 용도로만 쓰고, 노출은 균일한 ActivityRoute로 한다
// (as const를 그대로 내보내면 항목마다 없는 플래그가 타입에서 사라져 chrome.fullBleed 같은 접근이 막힌다).
export const ACTIVITY_ROUTES: Record<ActivityName, ActivityRoute> = ACTIVITY_ROUTE_TABLE

export const ACTIVITY_NAMES = Object.keys(ACTIVITY_ROUTES) as ActivityName[]

/**
 * 액티비티 파라미터 타입 등록.
 *
 * 파라미터를 전부 ActivityBaseParams(모든 키가 optional string)로 둔다. 이 앱의 네비게이션 어휘는
 * 경로 문자열이고(딥링크·브리지 NAVIGATE·로그인 복귀 경로가 전부 경로다), 호출부는 경로를 넘기면
 * 파사드가 매칭해 파라미터를 만든다 — 즉 파라미터는 항상 경로에서 유도되어 구조적으로 옳다.
 * 액티비티별로 좁은 타입을 달면 파사드 경계마다 캐스팅만 늘고 얻는 게 없다.
 * 대신 useActivityParams()가 useParams()와 같은 모양이 되어 페이지 코드가 그대로 산다.
 */
declare module '@stackflow/config' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Register extends Record<ActivityName, ActivityBaseParams> {}
}
