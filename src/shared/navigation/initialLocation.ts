/**
 * 앱이 부팅될 때의 URL(쿼리 + 해시)을 그대로 붙잡아 둔다.
 *
 * Stackflow(history-sync)는 마운트 직후 replaceState로 URL을 액티비티 기준으로 다시 쓰는데, 그때 만드는
 * URL은 pathname + 쿼리뿐이라 **해시가 사라진다**. 구글 OAuth는 implicit flow(response_type=token)라
 * 토큰이 해시(`#access_token=...`)로 돌아오므로, 콜백 화면이 읽기도 전에 통째로 유실된다
 * (react-router는 로드 시 URL을 건드리지 않아 드러나지 않던 문제다).
 *
 * 이 모듈은 **React 렌더 전(모듈 평가 시점)** 에 값을 붙잡는다. 그러려면 앱 진입점에서 정적으로 임포트되어야
 * 하는데, app/stack이 shared/navigation을 정적으로 쓰므로 지연 로드되는 페이지보다 항상 먼저 평가된다.
 */
const initialSearch = typeof window === 'undefined' ? '' : window.location.search
const initialHash = typeof window === 'undefined' ? '' : window.location.hash

/** 부팅 시점의 쿼리 파라미터. 콜백 처리 중 URL이 정리돼도 원본을 읽을 수 있다. */
export const getInitialSearchParams = () => new URLSearchParams(initialSearch)

/** 부팅 시점의 해시 파라미터(구글 implicit flow의 access_token 등). */
export const getInitialHashParams = () => new URLSearchParams(initialHash.replace(/^#/, ''))
